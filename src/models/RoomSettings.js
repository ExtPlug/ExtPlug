import currentRoom from 'plug/models/currentRoom';
import util from 'plug/util/util';
import request from '../util/request';
import Backbone from 'backbone';
import Events from 'plug/core/Events';

const RoomSettings = Backbone.Model.extend({

  constructor(ext) {
    Backbone.Model.call(this, {});

    this._loaded = {};

    this.load   = this.load.bind(this);
    this.unload = this.unload.bind(this);
    this.reload = this.reload.bind(this);

    currentRoom.on('change:description', this.reload);

    if (currentRoom.get('joined')) {
      this.load();
    }
  },

  load(unload = false) {
    let description = currentRoom.get('description'),
      m = description.match(/(?:^|\n)@(?:p3|rcs)=(.*?)(?:\n|$)/);

    if (m) {
      let url = util.h2t(m[1]);
      request.json(url).then(settings => {
        if (unload) {
          this.unload();
        }
        else {
          this.clear();
        }
        this.set(settings);
        this.trigger('load', settings);
      }).fail(e => {
        this.unload();
        let message = '';
        if (e.status === 0) {
          message += ' Your browser or an extension may be blocking its URL.';
        }
        else if (e.status >= 400) {
          message += ' Its URL is not accessible.';
        }
        else if (e.status) {
          message += ' Status code: ' + e.status;
        }
        Events.trigger('notify', 'icon-chat-system',
                       'Room Settings could not be loaded for this room.' + message);
      });
    }
    else if (unload) {
      this.unload();
    }
  },

  unload() {
    this.clear();
    this.trigger('unload');
  },

  reload() {
    // "joined" is set *after* "description"
    _.defer(() => {
      if (currentRoom.get('joined')) {
        this.load(true);
      }
    });
  },

  dispose() {
    this.unload();
    currentRoom.off('change:description', this.reload);
  }

});

export default RoomSettings;
