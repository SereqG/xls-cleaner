# AI Mode Setup Guide

This guide explains how to set up and use the AI Mode feature for Excel data cleaning.

## Prerequisites

- Python 3.8+
- Node.js 16+
- OpenAI API Key
- Clerk account (for authentication)

## Backend Setup

1. **Install Dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Configure Environment Variables**

   Create a `.env` file in the `backend` directory:

   ```bash
   # Required: OpenAI API Key
   OPENAI_API_KEY=sk-your-openai-api-key-here

   # Optional: Database (defaults to SQLite)
   DATABASE_URL=sqlite:///xls_cleaner.db

   # Optional: File storage
   UPLOAD_FOLDER=uploads
   PROCESSED_FOLDER=processed

   # Optional: CORS
   CORS_ORIGINS=http://localhost:3001,http://localhost:3000

   # Optional: Server settings
   FLASK_DEBUG=True
   HOST=0.0.0.0
   PORT=5000
   LOG_LEVEL=INFO
   ```

3. **Initialize Database**

   The database will be automatically initialized when you first run the app. To manually initialize:

   ```bash
   python -c "from database import init_db; init_db()"
   ```

4. **Run the Backend**
   ```bash
   python app.py
   ```

   The backend will be available at `http://localhost:5000`

## Frontend Setup

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure Environment Variables**

   Create a `.env.local` file in the `frontend` directory:

   ```bash
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
   CLERK_SECRET_KEY=sk_test_your_key_here

   # Clerk URLs
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

   # API Configuration
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

3. **Run the Frontend**
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:3001`

## Using AI Mode

1. **Sign In**
   - Users must be signed in to use AI Mode
   - Sign up at `/sign-up` or sign in at `/sign-in`

2. **Upload a File**
   - Upload an Excel file (max 20MB)
   - File must be in `.xlsx` or `.xls` format

3. **Open AI Mode**
   - Click the "Use AI for Cleaning" button
   - This will upload your file to the AI backend and open the AI chat interface

4. **Chat with AI Assistant**
   - Type natural language instructions like:
     - "Remove duplicate rows"
     - "Fill missing values in column A with 0"
     - "Sort by column B in descending order"
     - "Remove rows where Age is less than 18"
   
5. **View Results**
   - See a live preview of the first 5 rows
   - View a summary of changes made
   - Check remaining tokens

6. **Download Cleaned File**
   - Click the "Download" button to save your cleaned Excel file

## Token System

- Each user gets 50 tokens per day (resets at midnight UTC)
- Each successful AI operation consumes 1 token
- Failed operations or errors do not consume tokens
- Token count is displayed in the AI Mode modal

## Supported Operations

The AI assistant can perform these safe Excel operations:

- **Remove duplicates**: Remove duplicate rows
- **Remove missing values**: Remove rows with null/empty values
- **Fill missing values**: Fill null values with a specified value
- **Remove columns**: Delete specific columns
- **Rename columns**: Change column names
- **Filter rows**: Keep only rows matching conditions
- **Sort data**: Sort by one or more columns
- **Replace values**: Replace specific values
- **Change types**: Convert column data types
- **Text operations**: Uppercase, lowercase, capitalize, trim whitespace
- **Number operations**: Round numeric values
- **Clean up**: Remove empty rows or columns

## Security Features

1. **Safe Operations Only**
   - AI can only execute pre-approved Excel operations
   - No arbitrary code execution
   - All operations are validated before execution

2. **Session Isolation**
   - Each file upload creates an isolated session
   - Users can only access their own sessions
   - Files are stored separately per user

3. **Rate Limiting**
   - Daily token limits prevent abuse
   - File size limited to 20MB

4. **Authentication Required**
   - All AI endpoints require Clerk authentication
   - User ID verified on every request

## Troubleshooting

### Backend Issues

**"Module not found" errors**
- Run `pip install -r requirements.txt`

**"OpenAI API key not found"**
- Set `OPENAI_API_KEY` in your `.env` file

**"Database error"**
- Delete `xls_cleaner.db` and restart the app to recreate the database

**"CORS error"**
- Check `CORS_ORIGINS` includes your frontend URL

### Frontend Issues

**"User not authenticated" errors**
- Make sure you're signed in
- Check Clerk environment variables are set

**"Failed to upload file" errors**
- Check file is under 20MB
- Check file is `.xlsx` or `.xls` format
- Check backend is running

**"No tokens remaining" errors**
- Wait for tokens to reset (midnight UTC)
- Or contact admin to increase token limit

## Database Options

### SQLite (Default)
```bash
DATABASE_URL=sqlite:///xls_cleaner.db
```
- Simple, no setup required
- Good for development and small deployments
- File stored in backend directory

### PostgreSQL (Production)
```bash
DATABASE_URL=postgresql://user:password@localhost:5432/xls_cleaner
```
- Better for production
- Supports concurrent users
- Requires PostgreSQL installation

## API Documentation

See [AI_MODE_API.md](./AI_MODE_API.md) for complete API documentation.

## Development

### Running Tests
```bash
cd backend
pytest
```

### Linting Frontend
```bash
cd frontend
npm run lint
```

### Building Frontend
```bash
cd frontend
npm run build
```

## Support

For issues or questions:
1. Check this documentation
2. Review [AI_MODE_API.md](./AI_MODE_API.md)
3. Check backend logs for error messages
4. Open an issue on GitHub
