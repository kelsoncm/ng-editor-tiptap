import { mergeAttributes } from '@tiptap/core';
import OrderedList from '@tiptap/extension-ordered-list';

export type OrderedListType =
  | 'decimal'
  | 'decimal-leading-zero'
  | 'lower-alpha'
  | 'upper-alpha'
  | 'lower-roman'
  | 'upper-roman';

export interface CustomOrderedListOptions {
  itemTypeName: string;
  HTMLAttributes: Record<string, any>;
  keepMarks: boolean;
  keepAttributes: boolean;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    customOrderedList: {
      /**
       * Set ordered list type
       */
      setOrderedListType: (listType: OrderedListType) => ReturnType;
    };
  }
}

export const CustomOrderedList = OrderedList.extend<CustomOrderedListOptions>({
  name: 'orderedList',

  addAttributes() {
    return {
      ...this.parent?.(),
      listType: {
        default: 'decimal',
        parseHTML: (element) => {
          const style = element.style.listStyleType;
          if (style) {
            return style;
          }
          const type = element.getAttribute('data-list-type');
          return type || 'decimal';
        },
        renderHTML: (attributes) => {
          const listType = attributes['listType'] || 'decimal';
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
      setOrderedListType:
        (listType: OrderedListType) =>
        ({ commands, chain }) => {
          return chain()
            .updateAttributes(this.name, { listType })
            .run();
        },
    };
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'ol',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },
});
