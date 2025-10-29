# AI Mode API Documentation

This API provides AI-powered Excel data cleaning capabilities using natural language instructions.

## Authentication

All AI endpoints require user authentication via Clerk. Users must be signed in and provide their `user_id` with each request.

## Token System

- Each user has a daily token allowance (default: 50 tokens)
- Each successful AI operation consumes 1 token
- Tokens reset daily at midnight UTC
- Failed operations do not consume tokens

## Endpoints

### Upload File and Create AI Session

**POST** `/api/ai/upload`

Upload an Excel file and create a new AI session.

**Request (Multipart Form Data):**
- `file`: Excel file (max 20MB, .xlsx or .xls)
- `user_id`: Clerk user ID
- `email`: User email address

**Response:**
```json
{
  "session_id": "uuid",
  "file_name": "example.xlsx",
  "sheets": ["Sheet1", "Sheet2"],
  "selected_sheet": "Sheet1",
  "tokens_remaining": 49
}
```

**Example:**
```bash
curl -X POST \
  http://localhost:5000/api/ai/upload \
  -F "file=@data.xlsx" \
  -F "user_id=user_abc123" \
  -F "email=user@example.com"
```

---

### Send Message to AI Assistant

**POST** `/api/ai/chat`

Send a message to the AI assistant to perform data cleaning operations.

**Request (JSON):**
```json
{
  "session_id": "uuid",
  "message": "Remove duplicate rows",
  "user_id": "user_abc123"
}
```

**Success Response:**
```json
{
  "type": "success",
  "message": "I'll remove duplicate rows for you.\n\nRemoved 5 duplicate rows",
  "operation": "drop_duplicates",
  "summary": "Removed 5 duplicate rows",
  "preview": [
    {"Name": "John", "Age": 25},
    {"Name": "Jane", "Age": 30}
  ],
  "stats": {
    "rows": 95,
    "columns": 3,
    "column_names": ["Name", "Age", "Salary"]
  },
  "tokens_remaining": 48
}
```

**Error Response:**
```json
{
  "type": "error",
  "message": "I can only perform safe Excel operations",
  "suggestion": "Try asking to remove duplicates, fill missing values, or sort data",
  "tokens_remaining": 49
}
```

**Supported Operations:**
- Remove duplicate rows
- Remove rows with missing values
- Fill missing values
- Remove/rename columns
- Filter rows by conditions
- Sort data
- Replace values
- Change data types
- Text transformations (uppercase, lowercase, trim)
- Round numbers
- Remove empty rows/columns

**Example:**
```bash
curl -X POST \
  http://localhost:5000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "abc-123",
    "message": "Remove duplicate rows",
    "user_id": "user_abc123"
  }'
```

---

### Get Session Details

**GET** `/api/ai/sessions/{session_id}?user_id={user_id}`

Retrieve session details including conversation history.

**Response:**
```json
{
  "id": "uuid",
  "user_id": "user_abc123",
  "file_name": "data.xlsx",
  "selected_sheet": "Sheet1",
  "conversation_history": [
    {
      "role": "user",
      "content": "Remove duplicates",
      "timestamp": "2025-01-01T12:00:00Z"
    },
    {
      "role": "assistant",
      "content": "Removed 5 duplicate rows",
      "timestamp": "2025-01-01T12:00:05Z",
      "metadata": {
        "operation": "drop_duplicates",
        "stats": {"rows": 95, "columns": 3}
      }
    }
  ],
  "created_at": "2025-01-01T12:00:00Z",
  "updated_at": "2025-01-01T12:00:05Z"
}
```

---

### Get Sheet Preview

**GET** `/api/ai/preview/{session_id}?user_id={user_id}`

Get a preview of the current sheet (first 5 rows).

**Response:**
```json
{
  "preview": [
    {"Name": "John", "Age": 25, "Salary": 50000},
    {"Name": "Jane", "Age": 30, "Salary": 75000}
  ],
  "stats": {
    "rows": 95,
    "columns": 3,
    "column_names": ["Name", "Age", "Salary"]
  },
  "sheet_name": "Sheet1"
}
```

---

### Download Cleaned File

**GET** `/api/ai/download/{session_id}?user_id={user_id}`

Download the cleaned Excel file.

**Response:**
Excel file download with name `cleaned_{original_filename}.xlsx`

**Example:**
```bash
curl -X GET \
  "http://localhost:5000/api/ai/download/abc-123?user_id=user_abc123" \
  -o cleaned_data.xlsx
```

---

### Get User Tokens

**GET** `/api/ai/tokens?user_id={user_id}`

Get user's remaining tokens.

**Response:**
```json
{
  "tokens_remaining": 48,
  "daily_limit": 50,
  "tokens_used_today": 2
}
```

---

### Select Sheet

**POST** `/api/ai/select-sheet`

Change the active sheet for the session.

**Request (JSON):**
```json
{
  "session_id": "uuid",
  "sheet_name": "Sheet2",
  "user_id": "user_abc123"
}
```

**Response:**
```json
{
  "success": true,
  "selected_sheet": "Sheet2"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "session_id, message, and user_id are required"
}
```

### 401 Unauthorized
```json
{
  "error": "user_id and email are required"
}
```

### 403 Forbidden
```json
{
  "error": "No tokens remaining",
  "tokens_remaining": 0
}
```

### 404 Not Found
```json
{
  "error": "Session not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Error processing message: [detailed error]"
}
```

---

## Environment Variables

Required environment variables for AI Mode:

```bash
# OpenAI API Key (required for AI functionality)
OPENAI_API_KEY=sk-...

# Database URL (optional, defaults to SQLite)
DATABASE_URL=sqlite:///xls_cleaner.db
# Or PostgreSQL:
# DATABASE_URL=postgresql://user:password@localhost/xls_cleaner

# File upload settings
UPLOAD_FOLDER=uploads
PROCESSED_FOLDER=processed

# CORS settings
CORS_ORIGINS=http://localhost:3001,http://localhost:3000
```

---

## Security Features

1. **Safe Operations Only**: AI can only execute pre-approved Excel operations
2. **Session Isolation**: Each user's files and sessions are isolated
3. **File Size Limit**: Maximum 20MB per file
4. **Token Limits**: Daily token limits prevent abuse
5. **User Authentication**: All endpoints require authenticated user ID
6. **Operation Validation**: All operations are validated before execution

---

## Example Workflow

1. **Upload File**
   ```bash
   curl -X POST http://localhost:5000/api/ai/upload \
     -F "file=@data.xlsx" \
     -F "user_id=user_123" \
     -F "email=user@example.com"
   ```

2. **Send Cleaning Instructions**
   ```bash
   curl -X POST http://localhost:5000/api/ai/chat \
     -H "Content-Type: application/json" \
     -d '{"session_id": "abc-123", "message": "Remove duplicate rows and fill missing values with 0", "user_id": "user_123"}'
   ```

3. **Get Preview**
   ```bash
   curl "http://localhost:5000/api/ai/preview/abc-123?user_id=user_123"
   ```

4. **Download Cleaned File**
   ```bash
   curl "http://localhost:5000/api/ai/download/abc-123?user_id=user_123" -o cleaned.xlsx
   ```

---

## Rate Limits

- File upload: 20MB max
- Message length: No explicit limit, but practical limit ~1000 characters
- Daily tokens: 50 per user (configurable)
- Session duration: No expiration (files persist until manually deleted)
