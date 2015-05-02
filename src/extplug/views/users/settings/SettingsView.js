define(function (require, exports, module) {
  var BaseView = require('extplug/views/BaseView'),
    ControlGroupView = require('extplug/views/users/settings/ControlGroupView'),
    ModulesGroupView = require('./ModulesGroupView'),
    ManagingGroupView = require('./ManagingGroupView'),
    ErrorCheckboxView = require('extplug/views/users/settings/ErrorCheckboxView'),
    CheckboxView = require('extplug/views/users/settings/CheckboxView'),
    DropdownView = require('extplug/views/users/settings/DropdownView'),
    SliderView = require('extplug/views/users/settings/SliderView'),
    RemoveBoxView = require('./RemoveBoxView'),
    ModuleMeta = require('extplug/models/Module'),
    Events = require('plug/core/Events'),
    _ = require('underscore'),
    $ = require('jquery');

  /**
   * Wires a control to a setting model, updating the model when the control changes.
   *
   * @param {Backbone.View} el Control view.
   * @param {Backbone.Model} settings Model to reflect the settings to.
   * @param {string} target Relevant property on the model.
   */
  function wireSettingToModel(view, settings, target) {
    view.on('change', function (value) {
      settings.set(target, value);
    });
  }

  var SettingsView = BaseView.extend({
    className: 'ext-plug section',

    initialize: function (o) {
      this.modules = o.modules;
      this.modules.on('reset add remove', () => {
        this.refresh()
        this.render();
      });
      this.ext = o.ext;
      this.mode = 'normal';

      this.refresh();
      this.manage = this.manage.bind(this);
      this.unmanage = this.unmanage.bind(this);

      Events.on('extplug:modules:manage', this.manage);
      Events.on('extplug:modules:unmanage', this.unmanage);
    },

    refresh: function () {
      this.groups = [];
      if (this.mode === 'manage') {
        this.addGroup(this.createModulesManageGroup(), 1000);
      }
      else {
        this.addGroup(this.createModulesGroup(), 1000);
      }
      this.addGroup(this.createExtPlugGroup(), 999);
      this.modules.forEach(function (mod) {
        // add module settings group for stuff that was already enabled
        if (mod.get('enabled')) {
          var moduleSettings = this.createSettingsGroup(mod);
          if (moduleSettings) {
            this.addGroup(moduleSettings);
          }
        }
      }, this)
    },

    manage() {
      this.mode = 'manage';
      this.refresh();
      this.render();
    },
    unmanage() {
      this.mode = 'normal';
      this.refresh();
      this.render();
    },

    render: function () {
      this.$container = $('<div>').addClass('container');
      this.$el.empty().append(this.$container);

      this.sort();
      this.groups.forEach(function (group) {
        this.$container.append(group.items.render().$el);
      }, this);

      return this;
    },

    createModulesGroup: function () {
      var modulesGroup = new ModulesGroupView({ name: 'Modules' });
      // generate module list
      this.modules.forEach(mod => {
        var module = mod.get('module'),
          name = mod.get('name');
        if (module instanceof Error) {
          // this module errored out during its initialization
          modulesGroup.add(new ErrorCheckboxView({ label: name }));
        }
        else {
          let box = new CheckboxView({
            label: name,
            description: module.description || false,
            enabled: mod.get('enabled')
          });
          modulesGroup.add(box);
          box.on('change', value => {
            // add / remove module settings group
            if (value) {
              mod.enable();
              let moduleSettings = this.createSettingsGroup(mod);
              if (moduleSettings) {
                view.addGroup(moduleSettings);
                view.$container.append(moduleSettings.render().$el);
              }
            }
            else {
              mod.disable();
              let moduleSettings = this.getGroup(name);
              if (moduleSettings) {
                this.removeGroup(name);
                moduleSettings.remove();
              }
            }
          });
        }
      });

      return modulesGroup;
    },
    createModulesManageGroup() {
      var modulesGroup = new ManagingGroupView({ name: 'Manage Modules' });
      // generate module list
      this.modules.forEach(mod => {
        modulesGroup.add(new RemoveBoxView({ model: mod }));
      });

      return modulesGroup;
    },
    createExtPlugGroup: function () {
      return this.createSettingsGroup(new ModuleMeta({
        module: this.ext,
        name: 'ExtPlug'
      }));
    },

    createSettingsGroup: function (mod) {
      var module = mod.get('module');
      if (!module._settings) {
        return;
      }
      var group = new ControlGroupView({ name: mod.get('name') });
      var meta = module._settings;
      var settings = module.settings;

      _.each(meta, function (setting, name) {
        var control;
        switch (setting.type) {
          case 'boolean':
            control = new CheckboxView({
              label: setting.label,
              enabled: settings.get(name)
            });
            break;
          case 'dropdown':
            control = new DropdownView({
              label: setting.label,
              options: setting.options,
              selected: settings.get(name)
            });
            break;
          case 'slider':
            control = new SliderView({
              label: setting.label,
              min: setting.min,
              max: setting.max,
              value: settings.get(name)
            });
            break;
          default:
            control = new ErrorCheckboxView({ label: 'Unknown type for "' + name + '"' });
            break;
        }
        wireSettingToModel(control, settings, name);
        group.add(control);
      });

      return group;
    },

    sort: function () {
      this.groups.sort(function (a, b) {
        var c = b.priority - a.priority;
        if (c === 0) {
          c = a.items.get('name') > b.items.get('name') ? 1
            : a.items.get('name') < b.items.get('name') ? -1
            : 0;
        }
        return c;
      });
    },

    onResize: function () {
    },

    addGroup: function (items, priority) {
      this.groups.push({
        items: items,
        priority: typeof priority === 'number' ? priority : 0
      });
    },

    getGroup: function (name) {
      for (var i = 0, l = this.groups.length; i < l; i++) {
        if (this.groups[i].items.name === name) {
          return this.groups[i].items;
        }
      }
    },

    hasGroup: function (name) {
      return this.groups.some(function (group) {
        return group.items.name === name;
      });
    },

    removeGroup: function (name) {
      for (var i = 0, l = this.groups.length; i < l; i++) {
        if (this.groups[i].items.name === name) {
          return this.groups.splice(i, 1);
        }
      }
    }

  });

  module.exports = SettingsView;

});
