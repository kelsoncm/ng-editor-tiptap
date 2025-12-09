# Quick Start Guide - Table Features

## How to Use Table Features

### 1. Accessing the Table Menu

1. Look for the **Table** button (📊 icon) in the editor toolbar
2. Click it to open the dropdown menu with all table operations

### 2. Creating Your First Table

1. Click **"Inserir tabela"** (Insert table)
2. A 3×3 table with a header row will be inserted
3. Click inside any cell to start editing

### 3. Adding a Caption

1. Click in the table
2. Open the Table menu
3. Select **"Adicionar legenda"** (Add caption)
4. Enter your caption text in the prompt
5. Press Enter

The caption will appear at the top of the table by default.

### 4. Changing Caption Position

1. Open the Table menu
2. Select **"Posição da legenda"** (Caption position)
3. The position toggles between Top and Bottom

### 5. Resizing Columns

1. Hover your mouse over a column border
2. A blue resize handle will appear
3. Click and drag to adjust the column width

### 6. Adding Rows

**To add a row above:**
1. Click in a cell
2. Open Table menu → **"Inserir linha acima"**

**To add a row below:**
1. Click in a cell
2. Open Table menu → **"Inserir linha abaixo"**

### 7. Adding Columns

**To add a column to the left:**
1. Click in a cell
2. Open Table menu → **"Inserir coluna à esquerda"**

**To add a column to the right:**
1. Click in a cell
2. Open Table menu → **"Inserir coluna à direita"**

### 8. Deleting Rows and Columns

**Delete a row:**
1. Click in the row you want to delete
2. Open Table menu → **"Excluir linha"**

**Delete a column:**
1. Click in the column you want to delete
2. Open Table menu → **"Excluir coluna"**

### 9. Merging Cells

1. Select multiple cells (click and drag)
2. Open Table menu → **"Mesclar células"**
3. The cells will combine into one

### 10. Splitting Cells

1. Click in a merged cell
2. Open Table menu → **"Dividir célula"**
3. The cell will split back to individual cells

### 11. Cell Vertical Alignment

1. Click in a cell
2. Open Table menu → **"Alinhamento vertical"** (nested menu will open)
3. Choose:
   - **"Alinhar no topo"** (Align top)
   - **"Alinhar no meio"** (Align middle)
   - **"Alinhar embaixo"** (Align bottom)

### 12. Cell Background Color

1. Click in a cell
2. Open Table menu → **"Cor de fundo da célula"** (nested menu will open)
3. Choose from:
   - Predefined color palette
   - Custom color picker
   - "Remover cor de fundo" to clear

### 13. Duplicating a Table

1. Click anywhere in the table
2. Open Table menu → **"Duplicar tabela"**
3. An exact copy appears below the original

### 14. Deleting a Table

1. Click anywhere in the table
2. Open Table menu → **"Excluir tabela"**
3. The entire table is removed

### 15. Toggling Header Row

1. Click in the table
2. Open Table menu → **"Alternar linha de cabeçalho"**
3. The first row toggles between header and regular styling

## Keyboard Shortcuts

- **Tab**: Move to next cell
- **Shift + Tab**: Move to previous cell
- **Arrow Keys**: Navigate between cells

## Tips

✅ **DO:**
- Use header rows for table titles/labels
- Use captions to describe table content
- Merge cells for spanning headers
- Use background colors to highlight important data

❌ **AVOID:**
- Over-merging cells (can make editing difficult)
- Too many different background colors
- Very narrow columns (harder to read)

## Example: Creating a Simple Schedule Table

1. Insert a 5×4 table
2. Add caption: "Weekly Schedule"
3. Keep header row enabled
4. Fill first row: Time, Monday, Tuesday, Wednesday
5. Fill subsequent rows with schedule data
6. Resize columns to fit content
7. Add background color to important cells

## Troubleshooting

**Q: The table button doesn't appear?**
A: Make sure `[toolbarPreset]="'full'"` is set and `[enableTable]="true"`

**Q: Can't resize columns?**
A: Hover directly on the border between columns, not on the cell content

**Q: Caption doesn't move when changing position?**
A: This is expected - the position setting affects new captions. To move existing captions, delete and recreate.

**Q: Merged cells won't split?**
A: Ensure you're clicking inside the merged cell, not adjacent cells

## Language Support

All features work in:
- 🇧🇷 Português (Brasil)
- 🇺🇸 English  
- 🇪🇸 Español

Switch languages using the dropdown in the top-right corner.

## Need More Help?

See [TABLE_FEATURES.md](./TABLE_FEATURES.md) for comprehensive documentation.
