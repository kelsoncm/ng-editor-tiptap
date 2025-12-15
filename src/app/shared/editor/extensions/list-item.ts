import { mergeAttributes } from '@tiptap/core';
import ListItem from '@tiptap/extension-list-item';

export const CustomListItem = ListItem.extend({
  name: 'listItem',

  // keep default content (paragraph inside li) — rendering will unwrap <p> for HTML output

  // allow inline content directly inside <li> instead of a <p>
  addOptions() {
    // merge parent options and override HTMLAttributes; cast to any to satisfy TS
    const parent = this.parent ? this.parent() : {};
    return {
      ...parent,
      HTMLAttributes: {},
    } as any;
  },

  parseHTML() {
    return [{ tag: 'li' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['li', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },
});
