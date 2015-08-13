define(function (require, exports, module) {

  const Plugin = require('../Plugin');
  const chatFacade = require('plug/facades/chatFacade');
  const currentUser = require('plug/models/currentUser');
  const currentRoom = require('plug/models/currentRoom');
  const ChatView = require('plug/views/rooms/chat/ChatView');
  const Events = require('plug/core/Events');
  const { find } = require('underscore');
  const { before, after, joinpoint } = require('meld');
  const $ = require('jquery');

  // Adds a bunch of new chat events.
  // "chat:incoming" is fired as soon as a new message is received from the socket.
  //   It gets three arguments: The Message object, a boolean `isSystemMessage`, and
  //   a boolean `isMine` (true if the current user sent the message.)
  function fireIncoming(message, isSystemMessage, isMine) {
    Events.trigger('chat:incoming', message, isSystemMessage, isMine);
  }
  // "chat:beforereceive" is fired after some initial processing, but before the message
  // is passed to the plug.dj view layer. This is where you probably want to do your
  // modifications to the Message object.
  function fireBeforeReceive(message, isSystemMessage) {
    Events.trigger('chat:beforereceive', message, isSystemMessage);
  }
  // "chat:afterreceive" is fired after the message has been rendered. It gets two arguments:
  //   The Message object, and a jQuery object containing the message DOM element.
  function fireAfterReceive(message) {
    let element = $('#chat-messages .cm:last-child');
    Events.trigger('chat:afterreceive', message, element);
  }
  // "chat:send" is fired when the user sends a message. It takes a single argument: A string
  //   with the text content of the message.
  function fireSend(message) {
    // ensure that the user is allowed to send a message.
    // this does _not_ check for mutes. Plug will pretend that your message
    // went through if you're muted--so we do the same.
    if (currentUser.get('guest') || !currentRoom.get('joined') ||
        currentUser.get('level') < currentRoom.get('minChatLevel') ||
        message[0] === '/') {
      return;
    }
    Events.trigger('chat:send', message);
  }

  const MoreChatEvents = Plugin.extend({
    name: 'More Chat Events',
    description: 'Adds more chat events for plugins to hook into.',

    enable() {
      Events.on('chat:receive', fireBeforeReceive);
      // ensure fireBeforeReceive is the first event handler to be called
      Events._events['chat:receive'].unshift(Events._events['chat:receive'].pop());
      this.incomingAdvice = before(chatFacade, 'onChatReceived', fireIncoming);
      this.replaceEventHandler(() => {
        this.afterReceiveAdvice = after(ChatView.prototype, 'onReceived', () => {
          fireAfterReceive(...joinpoint().args);
        });
      });
      this.sendAdvice = before(chatFacade, 'sendChat', fireSend);
    },

    disable() {
      this.incomingAdvice.remove();
      this.afterReceiveAdvice.remove();
      this.sendAdvice.remove();
      Events.off('chat:receive', fireBeforeReceive);
    },

    // replace callback without affecting calling order
    replaceEventHandler(fn) {
      let chatView = this.ext.appView.room.chat;
      let handler;
      if (chatView) {
        handler = find(Events._events['chat:receive'], e => e.callback === chatView.onReceived);
      }
      fn();
      if (chatView && handler) {
        handler.callback = chatView.onReceived;
      }
    }
  });

  module.exports = MoreChatEvents;

});