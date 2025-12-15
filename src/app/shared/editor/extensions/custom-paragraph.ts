import { mergeAttributes } from '@tiptap/core';
import Paragraph from '@tiptap/extension-paragraph';

export const CustomParagraph = Paragraph.extend({
  name: 'paragraph',

  renderHTML({ node, HTMLAttributes }) {
    // If paragraph parent is a listItem, render children only (no <p>)
    const parent = node?.parent;
    if (parent && parent.type && parent.type.name === 'listItem') {
      return 0; // render children inline
    }

    return ['p', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },
});
