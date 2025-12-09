# Table Features

## Overview

The TipTap editor now includes comprehensive table functionality with all the features requested.

## Features Implemented

### 1. Table Creation and Management
- **Insert Table**: Creates a new 3x3 table with header row
- **Delete Table**: Removes the entire table
- **Duplicate Table**: Creates a copy of the current table

### 2. Table Caption
- **Add Caption**: Add a caption/legend to the table
- **Caption Position**: Toggle between top and bottom positions
- Caption is fully editable inline

### 3. Column Management
- **Column Resizing**: Drag column borders to resize (enabled by default)
- **Insert Column Before**: Add a new column to the left of the current column
- **Insert Column After**: Add a new column to the right of the current column
- **Delete Column**: Remove the current column
- **Select Column**: Select an entire column (via TipTap's built-in functionality)

### 4. Row Management
- **Header Row**: Toggle header row on/off
- **Insert Row Above**: Add a new row above the current row
- **Insert Row Below**: Add a new row below the current row
- **Delete Row**: Remove the current row
- **Select Row**: Select an entire row (via TipTap's built-in functionality)

### 5. Cell Operations
- **Merge Cells**: Combine selected cells into one
- **Split Cell**: Divide a merged cell back into individual cells
- **Cell Vertical Alignment**: 
  - Align Top
  - Align Middle
  - Align Bottom
- **Cell Background Color**: 
  - Predefined color palette
  - Custom color picker
  - Remove background color

### 6. Styling
- Professional table appearance with borders
- Highlighted header cells
- Visual feedback for selected cells
- Column resize handles
- Responsive table wrapper

## Usage

### Enabling Table Feature

The table feature is enabled by default. To disable it:

```typescript
<app-editor 
  [enableTable]="false"
  ...>
</app-editor>
```

### Accessing Table Controls

1. Click the **Table** button in the toolbar (displays a table icon with dropdown)
2. Select the desired operation from the dropdown menu
3. Some operations have nested menus (e.g., Cell Alignment, Cell Background)

### Keyboard Shortcuts

TipTap provides standard table navigation:
- **Tab**: Move to next cell
- **Shift+Tab**: Move to previous cell
- **Arrow Keys**: Navigate between cells

### Caption Usage

1. Create or select a table
2. Click "Add Caption" from the table menu
3. Enter your caption text in the prompt
4. The caption will appear at the top or bottom based on the current position setting
5. Click directly on the caption to edit it

### Column Resizing

1. Hover over a column border in the table
2. A blue resize handle will appear
3. Click and drag to adjust column width

### Cell Styling

1. Select one or more cells
2. Open the table menu
3. Choose "Cell Background Color" for background colors
4. Choose "Vertical Alignment" for top/middle/bottom alignment

## Technical Details

### Extensions Used
- `@tiptap/extension-table` - Base table functionality
- `@tiptap/extension-table-row` - Row management
- `@tiptap/extension-table-header` - Header cells
- `@tiptap/extension-table-cell` - Cell management
- Custom `TableCaption` extension - Caption support

### Configuration

Tables are configured with:
- Resizable columns enabled
- Custom CSS classes for styling
- Support for cell attributes (background, alignment)

### Custom Extension

A custom `TableCaption` extension was created to support:
- Caption text editing
- Top/bottom positioning
- Integration with the table structure

## Translations

Table features are fully translated in:
- **Portuguese (pt_br)**: Full translation
- **English (en)**: Full translation
- **Spanish (es)**: Full translation

Translation keys are located in `src/assets/i18n/*.json` under the `editor.table` namespace.

## Styling Customization

Table styles can be customized in `editor.component.scss`:

```scss
::ng-deep .tiptap-table {
  // Customize table appearance
  border-collapse: collapse;
  width: 100%;
  // ... more styles
}
```

## Browser Compatibility

Table features work in all modern browsers that support:
- CSS Grid/Flexbox
- HTML5 tables
- ProseMirror (the underlying editor framework)

## Known Limitations

1. Caption position toggle updates the state but moving existing captions requires manual repositioning
2. Footer rows are not implemented (only header rows are supported by TipTap's table extension)
3. Advanced column/row selection requires manual cell selection with mouse/keyboard

## Future Enhancements

Potential improvements:
- Table templates (different preset styles)
- More sophisticated caption positioning
- Table borders customization
- Cell padding/spacing controls
- Import/export tables from CSV or Excel
