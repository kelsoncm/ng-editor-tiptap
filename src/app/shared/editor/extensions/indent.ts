import { Extension } from '@tiptap/core';
import '@tiptap/extension-text-style';

export type IndentOptions = {
  types: string[];
  indentLevels: number[];
  defaultIndentLevel: number;
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    indent: {
      indent: () => ReturnType;
      outdent: () => ReturnType;
    };
  }
}

export const Indent = Extension.create<IndentOptions>({
  name: 'indent',

  addOptions() {
    return {
      types: ['paragraph', 'heading', 'blockquote'],
      indentLevels: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300],
      defaultIndentLevel: 0,
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          indent: {
            default: this.options.defaultIndentLevel,
            parseHTML: (element) => {
              const marginLeft = element.style.marginLeft;
              if (!marginLeft) {
                return this.options.defaultIndentLevel;
              }
              return parseInt(marginLeft) || this.options.defaultIndentLevel;
            },
            renderHTML: (attributes) => {
              const indent = attributes['indent'] as number | undefined;
              if (!indent) {
                return {};
              }
              return {
                style: `margin-left: ${indent}px`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      indent:
        () =>
        ({ tr, state, dispatch, editor }) => {
          const { selection } = state;
          tr = tr.setSelection(selection);

          tr.doc.nodesBetween(selection.from, selection.to, (node, pos) => {
            if (this.options.types.includes(node.type.name)) {
              const currentIndent = (node.attrs['indent'] as number) || 0;
              const currentIndex = this.options.indentLevels.indexOf(currentIndent);
              if (currentIndex < this.options.indentLevels.length - 1) {
                const nextIndent = this.options.indentLevels[currentIndex + 1];
                tr = tr.setNodeMarkup(pos, undefined, {
                  ...node.attrs,
                  indent: nextIndent,
                });
              }
            }
          });

          if (dispatch) {
            dispatch(tr);
          }

          return true;
        },

      outdent:
        () =>
        ({ tr, state, dispatch }) => {
          const { selection } = state;
          tr = tr.setSelection(selection);

          tr.doc.nodesBetween(selection.from, selection.to, (node, pos) => {
            if (this.options.types.includes(node.type.name)) {
              const currentIndent = (node.attrs['indent'] as number) || 0;
              const currentIndex = this.options.indentLevels.indexOf(currentIndent);
              if (currentIndex > 0) {
                const prevIndent = this.options.indentLevels[currentIndex - 1];
                tr = tr.setNodeMarkup(pos, undefined, {
                  ...node.attrs,
                  indent: prevIndent,
                });
              }
            }
          });

          if (dispatch) {
            dispatch(tr);
          }

          return true;
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      Tab: () => {
        return this.editor.commands.indent();
      },
      'Shift-Tab': () => {
        return this.editor.commands.outdent();
      },
    };
  },
});
