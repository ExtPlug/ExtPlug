define('extplug/plugins/compact-history/main', function (require, exports, module) {

  var Plugin = require('extplug/Plugin'),
    fnUtils = require('extplug/util/function'),
    _ = require('underscore'),
    $ = require('jquery');

  module.exports = Plugin.extend({
    name: 'Compact History',
    description: 'Lays out the room history in a much more compact view.',

    // We'll just use CSS
    enable: function () {
      this._super();
      var ITEM_HEIGHT = 20;
      var heightPx = ITEM_HEIGHT + 'px';
      this.Style({
        '#history-panel .media-list.history .playlist-media-item:not(.selected)': {
          'height': heightPx
        },
        '#history-panel .media-list.history .playlist-media-item:not(.selected) img': {
          'height': heightPx,
          'width': (ITEM_HEIGHT * 1.5) + 'px',
          'margin-top': '0px'
        },
        '#history-panel .media-list.history .playlist-media-item:not(.selected) .score': {
          'height': 'auto',
          'width': 'auto',
          'top': '0px',
          'left': '65px'
        },
        '#history-panel .media-list.history .playlist-media-item:not(.selected) .score .item': {
          'margin-right': '10px'
        },
        '#history-panel .media-list.history .playlist-media-item:not(.selected) .meta': {
          'height': 'auto'
        },
        '#history-panel .media-list.history .playlist-media-item:not(.selected) .meta span': {
          'height': heightPx,
          'top': '0px'
        },
        '#history-panel .media-list.history .playlist-media-item:not(.selected) .actions': {
          'height': heightPx,
          'top': '0px'
        },
        '#history-panel .media-list.history .playlist-media-item:not(.selected) .author': {
          'left': '120px',
          'right': '300px',
          'width': 'auto'
        },
        '#history-panel .media-list.history .playlist-media-item:not(.selected) .name': {
          'right': '125px'
        },
        '#history-panel .media-list.history .playlist-media-item:not(.selected) .actions div': {
          'height': heightPx
        },
        '#history-panel .media-list.history .playlist-media-item:not(.selected) .actions div i': {
          'top': '-4px'
        }
      });
    }

  });

});