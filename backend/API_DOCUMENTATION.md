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

---

# AI-Assisted Excel Cleaning API

This API provides AI-powered Excel file cleaning and modification using LangChain and OpenAI.

## Authentication

All AI endpoints require Clerk authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <clerk_jwt_token>
```

## Token System

- Each user has 15 tokens per day
- Each message sent to the AI costs 1 token
- Tokens reset daily at midnight UTC

## Endpoints

### 1. Start AI Session

**POST** `/api/ai/start-session`

Start a new AI cleaning session for a specific Excel sheet.

**Request:**
- Multipart form data with:
  - `file`: Excel file (.xlsx)
  - `sheet_name`: Name of the sheet to work with

**Response:**
```json
{
  "session_id": "uuid-string",
  "remaining_tokens": 14,
  "daily_limit": 15
}
```

**Example:**
```bash
curl -X POST \
  http://localhost:5000/api/ai/start-session \
  -H "Authorization: Bearer <token>" \
  -F "file=@data.xlsx" \
  -F "sheet_name=Sheet1"
```

### 2. Chat with AI

**POST** `/api/ai/chat`

Send a message to the AI agent and get a response.

**Request:**
```json
{
  "session_id": "uuid-string",
  "message": "Remove rows where Email column is empty"
}
```

**Response:**
```json
{
  "response": "I've removed 5 rows with empty Email values...",
  "remaining_tokens": 13
}
```

**Example:**
```bash
curl -X POST \
  http://localhost:5000/api/ai/chat \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"session_id":"abc-123","message":"Show me the data info"}'
```

### 3. Get Preview

**GET** `/api/ai/preview?session_id=<session_id>`

Get a preview of the current data state after modifications.

**Response:**
```json
{
  "preview": "   Name    Email   Age\n0  John   john@example.com  25\n..."
}
```

### 4. Download Modified File

**GET** `/api/ai/download?session_id=<session_id>`

Download the modified Excel file.

**Response:**
- Excel file (.xlsx) with modifications applied

**Example:**
```bash
curl -X GET \
  "http://localhost:5000/api/ai/download?session_id=abc-123" \
  -H "Authorization: Bearer <token>" \
  -o cleaned_file.xlsx
```

### 5. End Session

**POST** `/api/ai/end-session`

End the AI session and cleanup resources.

**Request:**
```json
{
  "session_id": "uuid-string"
}
```

**Response:**
```json
{
  "message": "Session ended"
}
```

### 6. Get Token Status

**GET** `/api/ai/token-status`

Get current token usage for the authenticated user.

**Response:**
```json
{
  "used_tokens": 5,
  "remaining_tokens": 10,
  "daily_limit": 15
}
```

## AI Agent Capabilities

The AI agent can perform the following operations on Excel data:

### Data Information
- Get column names, types, and row count
- View data preview
- Understand data structure

### Data Modifications
- **Remove empty rows**: "Remove rows where column X is empty"
- **Fill empty cells**: "Fill empty cells in column Y with value Z"
- **Text transformations**: "Convert column A to uppercase/lowercase"
- **Remove duplicates**: "Remove duplicate rows"
- **Sort data**: "Sort by column B in ascending order"
- **Filter data**: Custom filtering operations

### Example Queries
```
"Show me information about the data"
"Remove rows where Name is empty"
"Convert Email column to lowercase"
"Fill empty cells in Age column with 0"
"Remove duplicate rows"
"Sort by Date column in descending order"
```

## Error Responses

### 401 Unauthorized
```json
{
  "error": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "error": "Invalid session"
}
```

### 429 Too Many Requests
```json
{
  "error": "Daily token limit reached",
  "remaining_tokens": 0,
  "daily_limit": 15
}
```

### 500 Internal Server Error
```json
{
  "error": "Error message details"
}
```

## Configuration

Required environment variables:

```bash
OPENAI_API_KEY=your_openai_api_key
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0
DAILY_TOKEN_LIMIT=15
CLERK_SECRET_KEY=your_clerk_secret_key
```

## Redis Setup

The API requires Redis for token tracking. Install and run Redis:

```bash
# Using Docker
docker run -d -p 6379:6379 redis:latest

# Or install locally
# Ubuntu/Debian
sudo apt-get install redis-server

# macOS
brew install redis
```

## Dependencies

Additional Python packages required for AI features:

- langchain==0.1.0
- langchain-community==0.0.10
- langchain-openai==0.0.5
- openai>=1.10.0
- redis==5.0.1
- pyjwt==2.8.0
- cryptography==42.0.4

