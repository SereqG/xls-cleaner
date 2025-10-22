# Format Data Modal Documentation

## Overview

The Format Data Modal is a comprehensive, multi-step interface that allows users to interactively transform and download their uploaded Excel/XLSX files. The modal provides a guided workflow with 5 distinct steps.

## Features

### Modal Layout

- **Responsive Design**: Automatically adjusts to screen size without fixed viewport units
- **Rounded Borders**: Modern, polished appearance
- **Blurred Background**: Dark overlay with backdrop blur for focus
- **Centered Layout**: Modal appears in the center of the screen
- **Scrollable Content**: Content scrolls when it exceeds viewport height
- **Progress State**: No persistent state - all progress is lost when modal closes

### Header

- Displays the uploaded filename prominently
- Close button (×) in the top-right corner
- Clear visual separation from content

### Step Breadcrumbs

Visual progress indicator showing:
1. Select Spreadsheet (conditional - only shown if multiple sheets exist)
2. Select Columns
3. Specify Actions
4. Preview
5. Download File

Features:
- Current step highlighted in violet
- Completed steps shown with lighter violet background
- Future steps in gray
- Numbered for easy reference
- Sequential navigation only (no skipping)

## Workflow Steps

### Step 1: Select Spreadsheet (Conditional)

**When Shown**: Only if the uploaded file contains multiple sheets

**Purpose**: Allow user to choose which spreadsheet to work with

**Features**:
- List view of all available sheets
- Each sheet card shows:
  - Sheet name
  - Number of columns
  - Preview of first 5 column names
  - "+" indicator for additional columns
- Visual selection with violet highlight
- Checkmark on selected sheet
- Must select one sheet to proceed

**Auto-Skip**: If only one sheet exists, this step is automatically skipped and the sheet is auto-selected

### Step 2: Select Columns

**Purpose**: Choose which columns to modify and optionally override their data types

**Features**:
- List of all columns from selected sheet
- Each column displays:
  - Column name
  - Auto-detected data type (e.g., "text", "float", "integer")
  - Checkbox for selection
  - Dropdown to override data type
- Data type options:
  - String
  - Number
  - Date
  - Boolean
- Type dropdown is disabled until column is selected
- Visual feedback with violet highlight on selected columns
- Counter showing number of selected columns
- Must select at least one column to proceed

### Step 3: Specify Actions

**Purpose**: Configure transformations for each selected column

**Features**:

#### Available for ALL Data Types:
- **Replace Empty Values**: Text input to specify replacement value for empty cells
  - Leave blank to keep empty cells as-is
  - Example: Replace empty values with "N/A" or "0"

#### String Columns Only:
- **Change Case**: Dropdown with options:
  - No change (default)
  - UPPERCASE
  - lowercase
  - Title Case

#### Number Columns Only:
- **Round Decimals**: Number input (0-10)
  - Specify decimal places for rounding
  - Leave empty for no rounding
  - Example: 2 → rounds 123.456 to 123.46

**Validation**:
- Actions are type-specific (e.g., can't round decimals on string columns)
- All actions are optional
- Invalid actions prevent progression (with error message)

### Step 4: Preview

**Purpose**: Show the first 5 rows of transformed data before downloading

**Features**:
- Table view with:
  - Row numbers
  - Column headers with data types
  - Transformed values
  - Empty cells shown as "empty" in italics
- Applies all configured transformations:
  - Empty value replacements
  - Case changes
  - Decimal rounding
- Safe UTF-8 and special character handling
- Loading state while processing
- Information note explaining this is a preview only

**Note**: Only first 5 rows are shown in preview, but all rows will be transformed in the downloaded file

### Step 5: Download File

**Purpose**: Generate and download the transformed Excel file

**Features**:
- Editable filename field
  - Default: `{original_name}_formatted.xlsx`
  - User can customize before downloading
- Download button with states:
  - Normal: "Download File" with download icon
  - Processing: "Preparing download..." with spinner
  - Complete: "Downloaded successfully!" with checkmark
- Summary information:
  - Selected sheet name
  - Number of selected columns
  - Number of actions configured
- Auto-close after successful download (2-second delay)
- Uses XLSX library to generate proper Excel format

## Technical Implementation

### Technologies Used

- **React**: Component framework
- **TypeScript**: Type safety
- **Radix UI**: Dialog, Select, Checkbox components
- **Lucide React**: Icons
- **XLSX.js**: Excel file generation
- **Tailwind CSS**: Styling
- **Context API**: File state management

### File Structure

```
frontend/src/
├── components/
│   ├── FormatDataModal.tsx          # Main modal component
│   ├── FileActions.tsx               # Updated to integrate modal
│   └── modal-steps/
│       ├── SelectSheet.tsx           # Step 1 component
│       ├── SelectColumns.tsx         # Step 2 component
│       ├── SpecifyActions.tsx        # Step 3 component
│       ├── PreviewData.tsx           # Step 4 component
│       └── DownloadFile.tsx          # Step 5 component
├── types/
│   └── modal.ts                      # Type definitions
└── components/ui/
    ├── dialog.tsx                    # Dialog component
    ├── checkbox.tsx                  # Checkbox component
    ├── input.tsx                     # Input component
    └── label.tsx                     # Label component
```

### State Management

The modal maintains local state with the following structure:

```typescript
interface FormatDataState {
  currentStep: ModalStep;              // Current step in workflow
  selectedSheet: string | null;         // Selected sheet name
  columns: ColumnSelection[];           // Column selections and types
  actions: ColumnAction[];              // Configured actions
  previewData: Record<string, unknown>[] | null; // Preview data
  isProcessing: boolean;                // Loading state
  error: string | null;                 // Error messages
}
```

### Data Flow

1. **Modal Opens**: 
   - If single sheet: auto-select and start at Step 2
   - If multiple sheets: start at Step 1

2. **User Progresses**:
   - Each step validates before allowing "Next"
   - State updates accumulate
   - Preview step generates transformed data
   
3. **Download**:
   - Applies all transformations to full dataset
   - Generates XLSX file
   - Triggers browser download
   - Auto-closes modal on success

## Usage Example

```typescript
import { FormatDataModal } from '@/components/FormatDataModal'

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        Format Data
      </button>
      
      <FormatDataModal 
        open={isOpen} 
        onOpenChange={setIsOpen} 
      />
    </>
  )
}
```

## Styling

- **Color Scheme**: Uses violet accent colors matching the app theme
- **Responsive Breakpoints**: Adjusts layout for mobile, tablet, and desktop
- **Dark Mode**: Full support with appropriate color adjustments
- **Animations**: Smooth transitions for step changes and state updates

## Accessibility

- Keyboard navigation supported
- ARIA labels on interactive elements
- Focus management within modal
- Screen reader friendly
- Color contrast meets WCAG standards

## Security Considerations

- Client-side file processing only
- No server upload of transformed data
- Input validation on all user entries
- Safe handling of Excel formulas and special characters
- XSS protection through React's built-in escaping

## Known Limitations

1. **Browser Memory**: Large files (>100MB) may cause performance issues
2. **Data Types**: Limited to 4 basic types (string, number, date, boolean)
3. **Preview Only**: Only first 5 rows shown in preview
4. **Single Sheet**: Only one sheet can be transformed at a time
5. **No Undo**: Closing modal loses all progress

## Future Enhancements

- [ ] Save/Load transformation presets
- [ ] Batch processing of multiple sheets
- [ ] More transformation types (trim, replace patterns, etc.)
- [ ] Custom validation rules
- [ ] Export to other formats (CSV, JSON)
- [ ] Undo/Redo functionality within modal
- [ ] Persistent draft state
