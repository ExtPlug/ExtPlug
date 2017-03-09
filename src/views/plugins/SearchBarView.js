import Backbone from 'backbone';
import { debounce } from 'underscore';
import bel from 'bel';

export default Backbone.View.extend({
  initialize({ placeholder }) {
    this.placeholderText = placeholder;
  },

  render() {
    this.$el.append(bel`
      <div class="PluginSearchBar">
        <input class="PluginSearchBar-input" type="text" placeholder="${this.placeholderText}">
        <i class="PluginSearchBar-icon icon icon-search"></i>
      </div>
    `);

    this.$('.PluginSearchBar-input').on('input', debounce(this.onChange.bind(this), 250));

    return this;
  },

  remove() {
    this.$('.PluginSearchBar-input').off();
  },

  onChange(event) {
    this.trigger('search', event.target.value);
  },
});
