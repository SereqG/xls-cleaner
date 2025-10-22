# Spreadsheet Analysis API

This API provides functionality to analyze uploaded XLSX files and return detailed information about their structure and contents.

## Endpoint

**POST** `/api/analyze-spreadsheet`

## Usage

### Option 1: Upload File (Multipart Form Data)

```bash
curl -X POST \
  http://localhost:5000/api/analyze-spreadsheet \
  -F "file=@your_file.xlsx"
```

### Option 2: Analyze Existing File (JSON Body)

```bash
curl -X POST \
  http://localhost:5000/api/analyze-spreadsheet \
  -H "Content-Type: application/json" \
  -d '{"file_path": "/path/to/your/file.xlsx"}'
```

## Response Format

The API returns a JSON array containing information for each spreadsheet in the XLSX file:

```json
[
  {
    "spreadsheet_name": "Sheet1",
    "columns": [
      {
        "name": "Name",
        "type": "text"
      },
      {
        "name": "Age",
        "type": "integer"
      },
      {
        "name": "Salary",
        "type": "float"
      }
    ],
    "spreadsheet_snippet": [
      {
        "Name": "John Doe",
        "Age": 25,
        "Salary": 50000.0
      },
      {
        "Name": "Jane Smith",
        "Age": 30,
        "Salary": 75000.0
      }
    ]
  }
]
```

## Response Fields

- **spreadsheet_name**: Name of the Excel sheet
- **columns**: Array of column information
  - **name**: Column header name
  - **type**: Detected data type (text, integer, float, boolean, datetime, date, numeric_string, unknown)
- **spreadsheet_snippet**: First 5 rows of data as an array of objects

## Column Types

The API automatically detects the following column types:

- `integer`: Whole numbers
- `float`: Decimal numbers
- `text`: String data
- `boolean`: True/False values
- `datetime`: Date and time values
- `date`: Date strings
- `numeric_string`: Numbers stored as text
- `unknown`: Unable to determine type

## Error Responses

### 400 Bad Request

```json
{
  "error": "No file selected"
}
```

```json
{
  "error": "Invalid file type. Only XLSX and XLS files are supported"
}
```

```json
{
  "error": "file_path is required in request body"
}
```

### 500 Internal Server Error

```json
{
  "error": "Error analyzing spreadsheet: [detailed error message]"
}
```

## File Size Limits

- Maximum file size: 16MB
- Supported formats: .xlsx, .xls

## Testing

Run the test script to verify functionality:

```bash
python test_spreadsheet_analysis.py
```

## Dependencies

The API requires the following Python packages:

- pandas
- openpyxl
- flask
- werkzeug
