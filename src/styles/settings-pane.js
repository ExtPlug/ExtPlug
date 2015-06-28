define({
  '#user-view #user-settings': {
    // unlike plug.dj's own settings, ExtPlug settings are grouped
    // in separate DOM elements (separate backbone views, even)
    // plug.dj's styling doesn't quite work for this so we add some
    // manual margins around the header to make things look somewhat
    // alike.
    '.extplug.control-group:not(:first-child) .header': {
      'margin': '35px 0 8px 0 !important'
    },

    // footer below grouped plugin settings
    '.extplug-group-footer': {
      'clear': 'both',
      'button': {
        'top': 'auto',
        'position': 'relative'
      }
    },

    // numeric range slider
    '.extplug-slider': {
      // plug.dj has three labels on sliders, but ExtPlug sliders
      // just have two counter labels because it's easier
      '.counts .count:nth-child(2)': {
        'float': 'right'
      }
    },

    '.extplug-input': {
      'label.title': {
        'top': '0px',
        'font-size': '14px',
        'width': '50%'
      },
      '.extplug-input-wrap': {
        'position': 'absolute',
        'background': '#212328',
        'box-shadow': 'inset 0 0 0 1px #444a59',
        'box-sizing': 'border-box',
        'height': '31px',
        'padding': '1px',
        'width': '47%',
        'left': '50%',
        'top': '-6px'
      },
      'input': {
        'padding': '1px 1px 1px 5px',
        'height': '29px',
        'width': '100%',
        'box-sizing': 'border-box',
        'font': '14px "Open Sans", sans-serif',
        'color': '#ccc',
        'background': 'transparent',
        'border': 'none'
      },
      '.error': {
        // someone decided to !important the default .focused style ):
        'box-shadow': 'inset 0 0 0 1px #f04f30 !important'
      }
    },

    // colour inputs
    '.extplug-color-input': {
      '.extplug-color-swatch': {
        'height': '23px',
        'width': '23px',
        'top': '4px',
        'left': '4px',
        'position': 'absolute'
      },
      'input': {
        'width': 'calc(100% - 29px)',
        'margin-left': '29px'
      }
    }
  }
});
