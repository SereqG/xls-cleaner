# AI Assist Modal - Feature Documentation

## Overview

The AI Assist Modal is a powerful feature that allows users to clean and modify their Excel files using natural language commands powered by OpenAI and LangChain.

## Features

### 1. Token-Based System
- Each user gets 15 tokens per day
- Each message to the AI costs 1 token
- Tokens reset daily at midnight UTC
- Token usage is tracked per user using Clerk authentication and Redis

### 2. Multi-Step Workflow

#### Step 1: Sheet Selection (Optional)
- If the Excel file has multiple sheets, user selects which sheet to work with
- Automatically skipped if file has only one sheet

#### Step 2: Chat Interface
- User interacts with AI chatbot using natural language
- AI can:
  - Answer questions about the data
  - Modify the spreadsheet based on instructions
  - Provide information about columns, types, and data
- Token counter displays remaining daily tokens
- Chat history is maintained throughout the session

#### Step 3: Preview
- User can preview the modified data
- Shows first 10 rows of changes
- Option to proceed or go back to make more changes

#### Step 4: Download
- Download the cleaned/modified Excel file
- File is named with "cleaned_" prefix

### 3. AI Capabilities

The AI agent can:

**Data Information:**
- Show column names and types
- Display row counts
- Preview data structure

**Data Cleaning:**
- Remove rows with empty values in specific columns
- Fill empty cells with specified values
- Convert text to uppercase/lowercase
- Remove duplicate rows
- Sort data by columns
- Apply custom transformations

**Example Commands:**
```
"Show me information about the data"
"Remove rows where Email is empty"
"Convert Name column to uppercase"
"Fill empty cells in Age with 0"
"Remove duplicate rows"
"Sort by Date in descending order"
```

### 4. Safety Features

- AI only responds to Excel-related queries
- Non-Excel questions receive: "I can't respond to non Excel-related prompts"
- Authentication required (Clerk)
- Rate limiting via token system
- Session-based file handling with automatic cleanup

## Technical Implementation

### Backend

**Services:**
- `AIAgentService`: Manages LangChain agents with memory
- `TokenTrackingService`: Tracks daily token usage with Redis

**Tools:**
- `ExcelModificationTool`: Modifies Excel files using pandas
- Supports various data operations (filter, sort, transform, etc.)

**API Endpoints:**
- `POST /api/ai/start-session`: Initialize AI session
- `POST /api/ai/chat`: Send message to AI
- `GET /api/ai/preview`: Get data preview
- `GET /api/ai/download`: Download modified file
- `POST /api/ai/end-session`: Cleanup session
- `GET /api/ai/token-status`: Check token usage

### Frontend

**Components:**
- `AIModal`: Main modal container
- `AISelectSheet`: Sheet selection interface
- `ChatInterface`: Chat UI with message history
- `AIPreview`: Data preview display
- `AIDownload`: Download interface

**Hooks:**
- `useAIModal`: Manages modal state and AI interactions
- `useFileActions`: Handles modal opening

**State Management:**
- Chat messages with timestamps
- Token tracking
- Session management
- Error handling

## Setup

### Prerequisites

1. **OpenAI API Key**
   ```bash
   OPENAI_API_KEY=your_key_here
   ```

2. **Redis**
   ```bash
   # Using Docker
   docker run -d -p 6379:6379 redis:latest
   
   # Or install locally
   brew install redis  # macOS
   sudo apt-get install redis-server  # Ubuntu
   ```

3. **Clerk Authentication**
   - Configure Clerk in both frontend and backend
   - Set CLERK_SECRET_KEY in backend

### Backend Setup

1. Install dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. Configure environment variables in `.env`:
   ```bash
   OPENAI_API_KEY=your_key
   REDIS_HOST=localhost
   REDIS_PORT=6379
   DAILY_TOKEN_LIMIT=15
   CLERK_SECRET_KEY=your_clerk_secret
   ```

3. Start Redis:
   ```bash
   redis-server
   ```

4. Run backend:
   ```bash
   python app.py
   ```

### Frontend Setup

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Configure environment variables:
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:5000
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
   CLERK_SECRET_KEY=your_secret
   ```

3. Run frontend:
   ```bash
   npm run dev
   ```

## Usage Flow

1. **Upload File**: User uploads Excel file
2. **Click "Use AI for Cleaning"**: Opens AI modal
3. **Select Sheet** (if multiple): Choose which sheet to work with
4. **Chat with AI**: Send natural language commands
5. **Preview Changes**: Review modifications
6. **Download**: Get cleaned file

## Architecture

```
┌─────────────┐
│   Frontend  │
│  (Next.js)  │
└──────┬──────┘
       │
       │ HTTP/REST
       │
┌──────▼──────┐
│   Backend   │
│   (Flask)   │
└──────┬──────┘
       │
       ├─────────────┐
       │             │
┌──────▼──────┐ ┌───▼────┐
│   OpenAI    │ │  Redis │
│  (GPT-3.5)  │ │ (Cache)│
└─────────────┘ └────────┘
```

## Token Economics

- **Daily Limit**: 15 tokens
- **Cost per Message**: 1 token
- **Reset Time**: Midnight UTC
- **Storage**: Redis with automatic expiration

## Security

- JWT authentication via Clerk
- Token validation on every request
- Session-based file isolation
- Automatic cleanup of temporary files
- CORS protection
- Environment variable secrets

## Styling

The modal follows the same design system as the manual data formatting modal:
- Similar layout and navigation
- Consistent button styles
- Matching color scheme (green accent for AI)
- Responsive design
- Dark mode support

## Future Enhancements

Potential improvements:
- More sophisticated data transformations
- Multi-sheet operations
- Data visualization
- Export to different formats
- Advanced filtering options
- Scheduled cleanings
- Team collaboration features
