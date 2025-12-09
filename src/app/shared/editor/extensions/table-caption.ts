import { Node, mergeAttributes } from '@tiptap/core';

export interface TableCaptionOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    tableCaption: {
      /**
       * Set table caption
       */
      setTableCaption: (position?: 'top' | 'bottom') => ReturnType;
      /**
       * Toggle table caption
       */
      toggleTableCaption: () => ReturnType;
      /**
       * Update caption position
       */
      updateCaptionPosition: (position: 'top' | 'bottom') => ReturnType;
    };
  }
}

export const TableCaption = Node.create<TableCaptionOptions>({
  name: 'tableCaption',

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  content: 'inline*',

  parseHTML() {
    return [{ tag: 'caption' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['caption', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },

  addCommands() {
    return {
      setTableCaption:
        (position = 'top') =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: { position },
          });
        },
      toggleTableCaption:
        () =>
        ({ commands }) => {
          return commands.toggleNode(this.name, 'paragraph');
        },
      updateCaptionPosition:
        (position: 'top' | 'bottom') =>
        ({ tr, state }) => {
          const { selection } = state;
          const { $from } = selection;
          
          // Find the caption node
          let captionPos = -1;
          state.doc.descendants((node, pos) => {
            if (node.type.name === 'tableCaption') {
              captionPos = pos;
              return false;
            }
            return true;
          });

          if (captionPos >= 0) {
            tr.setNodeMarkup(captionPos, undefined, { position });
            return true;
          }

          return false;
        },
    };
  },
});
