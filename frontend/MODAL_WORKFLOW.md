# Format Data Modal - Workflow Diagram

## Visual Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                      USER UPLOADS FILE                           │
│                  (Already Implemented)                           │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                  USER CLICKS "FORMAT DATA"                       │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
                    ┌───────────────┐
                    │ Modal Opens   │
                    └───────┬───────┘
                            │
                            ▼
                ┌───────────────────────┐
                │  Multiple Sheets?     │
                └─────┬─────────┬───────┘
                      │         │
                  Yes │         │ No (auto-skip)
                      │         │
                      ▼         └──────────┐
        ┌─────────────────────────┐        │
        │  STEP 1: Select Sheet   │        │
        │  • Show all sheets      │        │
        │  • Display columns      │        │
        │  • User selects one     │        │
        └─────────┬───────────────┘        │
                  │                        │
                  └────────────┬───────────┘
                               ▼
                ┌──────────────────────────────┐
                │  STEP 2: Select Columns      │
                │  • List all columns          │
                │  • Show detected types       │
                │  • User selects columns      │
                │  • Override types (optional) │
                │  • Min 1 column required     │
                └──────────┬───────────────────┘
                           ▼
                ┌──────────────────────────────┐
                │  STEP 3: Specify Actions     │
                │  For each selected column:   │
                │  • Replace empty values      │
                │  • Change case (strings)     │
                │  • Round decimals (numbers)  │
                │  • All actions optional      │
                └──────────┬───────────────────┘
                           ▼
                ┌──────────────────────────────┐
                │  STEP 4: Preview Data        │
                │  • Show first 5 rows         │
                │  • Apply transformations     │
                │  • Display in table format   │
                │  • Loading state while       │
                │    processing                │
                └──────────┬───────────────────┘
                           ▼
                ┌──────────────────────────────┐
                │  STEP 5: Download File       │
                │  • Edit filename             │
                │  • Show summary              │
                │  • Generate XLSX             │
                │  • Download to browser       │
                │  • Auto-close modal          │
                └──────────┬───────────────────┘
                           ▼
                ┌──────────────────────────────┐
                │   FILE DOWNLOADED! ✅        │
                │   Modal Closes               │
                └──────────────────────────────┘
```

## Navigation Rules

### Forward Navigation (Next Button)

| Step | Required Before Next |
|------|---------------------|
| Step 1 | Must select a sheet |
| Step 2 | Must select at least 1 column |
| Step 3 | No requirement (actions optional) |
| Step 4 | Preview generated successfully |
| Step 5 | N/A (final step) |

### Backward Navigation (Back Button)

- Available on all steps except Step 1
- Returns to previous step in sequence
- Preserves all user selections

### Special Cases

**Auto-skip Step 1:**
- Condition: Only 1 sheet in file
- Behavior: Sheet auto-selected, start at Step 2

**Error Handling:**
- Invalid action configuration shows error
- Prevents progression until resolved
- Error displayed prominently above step content

**Modal Close:**
- Click X button (top-right)
- Press Escape key
- Click outside modal
- **Warning**: All progress is lost!

## State Transitions

```
Initial State:
  currentStep: 'select-sheet' or 'select-columns'
  selectedSheet: null or auto-selected
  columns: []
  actions: []
  previewData: null
  
After Sheet Selection:
  currentStep: 'select-columns'
  selectedSheet: "Sheet1"
  columns: [...] (populated from sheet)
  
After Column Selection:
  columns: [...] (some marked isSelected: true)
  
After Action Configuration:
  actions: [...] (one per selected column)
  
After Preview Generation:
  currentStep: 'preview'
  previewData: [...] (first 5 rows transformed)
  
After Download:
  Modal closes (state resets)
```

## Data Transformation Pipeline

```
Raw Sheet Data
      │
      ▼
Filter Selected Columns
      │
      ▼
For Each Row:
  │
  ├─► Empty Check
  │   └─► Replace if configured
  │
  ├─► String Transformations
  │   └─► Apply case change
  │
  └─► Number Transformations
      └─► Round decimals
      │
      ▼
Transformed Data
      │
      ├─► Preview (5 rows)
      └─► Download (all rows)
```

## Component Hierarchy

```
FormatDataModal
  │
  ├─► DialogContent
  │   │
  │   ├─► Header (filename + close button)
  │   │
  │   ├─► Breadcrumbs (step indicators)
  │   │
  │   ├─► Error Display (if any)
  │   │
  │   ├─► Step Content:
  │   │   ├─► SelectSheet
  │   │   ├─► SelectColumns
  │   │   ├─► SpecifyActions
  │   │   ├─► PreviewData
  │   │   └─► DownloadFile
  │   │
  │   └─► Navigation Buttons
  │       ├─► Back
  │       └─► Next / Close
  │
  └─► DialogOverlay (blurred background)
```

## User Interaction Flow

```
┌──────────────┐
│ Click Button │
└──────┬───────┘
       │
       ▼
┌──────────────┐    ┌─────────────┐
│ Modal Opens  │───►│ View Step 1 │
└──────────────┘    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │ Make Choice │
                    └──────┬──────┘
                           │
                    ┌──────▼───────┐
                    │ Click Next   │
                    └──────┬───────┘
                           │
                    ┌──────▼──────┐
                    │ View Step 2 │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │ Make Choice │
                    └──────┬──────┘
                           │
                    ┌──────▼───────┐
                    │ Click Next   │
                    └──────┬───────┘
                           │
                         [...]
                           │
                    ┌──────▼────────┐
                    │ Download File │
                    └──────┬────────┘
                           │
                    ┌──────▼──────┐
                    │ Modal Close │
                    └─────────────┘
```

## Action Configuration Matrix

| Data Type | Replace Empty | Change Case | Round Decimals |
|-----------|--------------|-------------|----------------|
| String    | ✅           | ✅          | ❌             |
| Number    | ✅           | ❌          | ✅             |
| Date      | ✅           | ❌          | ❌             |
| Boolean   | ✅           | ❌          | ❌             |

## Preview vs Download

| Feature | Preview | Download |
|---------|---------|----------|
| Rows | First 5 | All rows |
| Columns | Selected only | Selected only |
| Transformations | Applied | Applied |
| Format | HTML Table | XLSX File |
| Purpose | Verify changes | Get final file |

## File Generation Process

```
User Clicks Download
      │
      ▼
Get Full Dataset
      │
      ▼
Apply All Transformations
  • Replace empty values
  • Change text case
  • Round decimals
      │
      ▼
Create Workbook (XLSX.utils.book_new)
      │
      ▼
Convert to Worksheet (XLSX.utils.json_to_sheet)
      │
      ▼
Add Sheet to Workbook
      │
      ▼
Write File (XLSX.writeFile)
      │
      ▼
Browser Downloads File
      │
      ▼
Show Success Message
      │
      ▼
Auto-close Modal (2s delay)
```

## Responsive Behavior

```
Mobile (< 640px)
  • Modal width: 95vw
  • Stack breadcrumbs vertically
  • Smaller fonts and padding
  • Touch-friendly controls

Tablet (640px - 1024px)
  • Modal width: 90vw
  • Horizontal breadcrumbs
  • Standard fonts
  • Scrollable tables

Desktop (> 1024px)
  • Modal width: max-w-4xl
  • Full horizontal layout
  • Larger preview table
  • Hover effects enabled
```
