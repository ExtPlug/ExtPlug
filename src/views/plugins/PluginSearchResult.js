import Backbone from 'backbone';
import bel from 'bel';
import Events from 'plug/core/Events';
import ShowDialogEvent from 'plug/events/ShowDialogEvent';
import PackageInfoDialog from './PackageInfoDialog';

export default Backbone.View.extend({
  className: 'PluginRow',

  render() {
    const model = this.model.toJSON();

    const homepage = model.links.homepage || model.links.repository || model.links.npm;
    const userLink = model.publisher ? bel`
      <span>
        by
        <a target="_blank" rel="noreferrer noopener" href="https://npmjs.com/~${model.publisher.username}">
          ${model.publisher.username}
        </a>
      </span>
    ` : '';

    this.$el.append(bel`
      <div class="PluginRow-meta">
        <div class="PluginRow-name">
          <span>${model.name}</span>
        </div>
        <div class="PluginRow-description">
          ${model.description}
        </div>
        <div class="PluginRow-published">
          Published ${new Date(model.date).toLocaleDateString()}
          ${userLink}
        </div>
      </div>
    `, bel`
      <div class="PluginRow-buttons">
        <button class="PluginRow-button PluginRow-install">
          <i class="PluginRow-icon icon icon-add"></i>
          <span>Install</span>
        </button>
        <a class="PluginRow-button PluginRow-package" target="_blank" rel="noreferrer noopener" href="${homepage}">
          <i class="PluginRow-icon icon icon-support-white"></i>
          <span>Package</span>
        </a>
      </div>
    `);

    this.$('.PluginRow-install').on('click', this.onInstall.bind(this));
    this.$('.PluginRow-package').on('click', this.onShowPackage.bind(this));

    return this;
  },

  remove() {
    this.$('.PluginRow-install').off();
    this.$('.PluginRow-package').off();
  },

  onInstall() {
    alert('Unimplemented');
  },

  onShowPackage(event) {
    if (event) event.preventDefault();

    const dialog = new PackageInfoDialog({
      model: this.model,
    });
    dialog.on('install', this.onInstall, this);
    Events.dispatch(new ShowDialogEvent(ShowDialogEvent.SHOW, dialog));
  },
});
