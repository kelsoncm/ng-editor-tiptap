import { mergeAttributes } from '@tiptap/core';
import BulletList from '@tiptap/extension-bullet-list';

export type BulletListType =
  | 'disc'
  | 'circle'
  | 'square'
  | '"\\2714"'
  | '"\\2705"'
  | '"\\2610"';

export interface CustomBulletListOptions {
  itemTypeName: string;
  HTMLAttributes: Record<string, any>;
  keepMarks: boolean;
  keepAttributes: boolean;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    customBulletList: {
      /**
       * Set bullet list type
       */
      setBulletListType: (listType: BulletListType) => ReturnType;
    };
  }
}

export const CustomBulletList = BulletList.extend<CustomBulletListOptions>({
  name: 'bulletList',

  addAttributes() {
    return {
      ...this.parent?.(),
      listType: {
        default: 'disc',
        parseHTML: (element) => {
          const style = element.style.listStyleType;
          if (style) {
            return style;
          }
          const type = element.getAttribute('data-list-type');
          return type || 'disc';
        },
        renderHTML: (attributes) => {
          const listType = attributes['listType'] || 'disc';
          return {
            style: `list-style-type: ${listType}`,
            'data-list-type': listType,
          };
        },
      },
    };
  },

  addCommands() {
    return {
      ...this.parent?.(),
      setBulletListType:
        (listType: BulletListType) =>
        ({ commands, chain }) => {
          return chain()
            .updateAttributes(this.name, { listType })
            .run();
        },
    };
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'ul',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },
});
