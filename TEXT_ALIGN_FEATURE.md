# Text Alignment Feature

## Overview
This document describes the text alignment feature that was added to the TipTap editor.

## Features Added

The editor now supports four text alignment options accessible through a dropdown button:

1. **Align Left** - Aligns text to the left (default)
2. **Align Center** - Centers text
3. **Align Right** - Aligns text to the right
4. **Justify** - Justifies text (distributes evenly)

## Implementation Details

### 1. Extension Installation
- Installed `@tiptap/extension-text-align` package
- Configured to work with `heading` and `paragraph` node types

### 2. Component Changes

#### TypeScript (`editor.component.ts`)
- Added `enableTextAlign` input property (default: `true`)
- Added `showTextAlignDropdown` state variable
- Added `currentTextAlign` state variable to track current alignment
- Implemented methods:
  - `toggleTextAlignDropdown()` - Opens/closes the dropdown
  - `closeTextAlignDropdown()` - Closes the dropdown
  - `setTextAlign(align)` - Sets the text alignment
  - `getTextAlignIcon()` - Returns the appropriate Font Awesome icon based on current alignment
- Updated `updateCurrentBlockType()` to track current text alignment
- Added dropdown close handler when clicking outside

#### HTML Template (`editor.component.html`)
- Added a new toolbar group with text alignment dropdown
- Dropdown button shows current alignment icon
- Dropdown menu contains four alignment options with icons and labels
- Uses conditional rendering with `*ngIf="enableTextAlign"`

### 3. Translation Keys

Added translations for three languages:

**Portuguese (pt_br.json):**
```json
"textAlign": "Alinhamento de texto",
"alignLeft": "Alinhar à esquerda",
"alignCenter": "Alinhar ao centro",
"alignRight": "Alinhar à direita",
"alignJustify": "Justificar"
```

**English (en.json):**
```json
"textAlign": "Text alignment",
"alignLeft": "Align left",
"alignCenter": "Align center",
"alignRight": "Align right",
"alignJustify": "Justify"
```

**Spanish (es.json):**
```json
"textAlign": "Alineación de texto",
"alignLeft": "Alinear a la izquierda",
"alignCenter": "Alinear al centro",
"alignRight": "Alinear a la derecha",
"alignJustify": "Justificar"
```

## Usage

### Basic Usage
The text alignment feature is enabled by default. Users can:

1. Click the alignment button in the toolbar (shows current alignment icon)
2. Select desired alignment from the dropdown menu
3. The text in the current paragraph or heading will be aligned accordingly

### Configuration
To disable text alignment:

```typescript
<app-editor [enableTextAlign]="false"></app-editor>
```

### Icons Used
- Left: `fa-align-left`
- Center: `fa-align-center`
- Right: `fa-align-right`
- Justify: `fa-align-justify`

## Technical Notes

- The feature uses TipTap's built-in `TextAlign` extension
- Alignment is stored as an attribute on the node
- The dropdown automatically closes when clicking outside
- The toolbar button icon updates to reflect the current alignment
- Works with both paragraph and heading blocks
