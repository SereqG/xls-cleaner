# Clerk Authentication Setup Guide

This project has been integrated with [Clerk](https://clerk.com) for authentication. This guide explains how to set up and use the authentication features.

## Features Implemented

### 1. Authentication Pages
- **Sign In Page** (`/sign-in`): Login page with Clerk authentication widget
- **Sign Up Page** (`/sign-up`): Registration page with Clerk authentication widget

### 2. Protected Routes
- File upload functionality is now protected and only accessible to authenticated users
- Unauthenticated users see a "Let's Start" button that redirects to the login page

### 3. Navbar Updates
- **For Unauthenticated Users**: Login and Register links appear on the left side
- **For Authenticated Users**: User profile button appears on the right side with logout functionality

### 4. Session Management
- Automatic redirect to login when session expires (handled by middleware)
- SSR-compatible session checks
- Automatic redirect to home page after logout

## Setup Instructions

### Step 1: Create a Clerk Account

1. Go to [https://clerk.com](https://clerk.com) and create a free account
2. Create a new application in the Clerk dashboard
3. Choose your preferred authentication methods (Email, Google, GitHub, etc.)

### Step 2: Get Your API Keys

1. Navigate to your Clerk dashboard: [https://dashboard.clerk.com](https://dashboard.clerk.com)
2. Go to "API Keys" section
3. Copy both keys:
   - **Publishable Key** (starts with `pk_test_` or `pk_live_`)
   - **Secret Key** (starts with `sk_test_` or `sk_live_`)

### Step 3: Configure Environment Variables

1. In the `frontend` directory, copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` and replace the placeholder values with your actual Clerk keys:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_key_here
   CLERK_SECRET_KEY=sk_test_your_actual_key_here
   
   # These URLs are already configured correctly
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
   ```

### Step 4: Install Dependencies and Run

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will now be running at [http://localhost:3000](http://localhost:3000) with full authentication functionality.

## Testing the Authentication Flow

### 1. Test Registration
1. Navigate to [http://localhost:3000](http://localhost:3000)
2. Click "Register" in the navbar
3. Complete the sign-up process
4. You should be redirected to the home page as an authenticated user

### 2. Test Login
1. Click "Login" in the navbar
2. Enter your credentials
3. You should be redirected to the home page with access to the file upload

### 3. Test Protected Routes
1. When logged in, you can see and use the file upload feature
2. When logged out, you only see the "Let's Start" button

### 4. Test Logout
1. Click on your profile picture in the navbar (top right)
2. Click "Sign Out"
3. You should be redirected to the home page as an unauthenticated user

## Architecture Overview

### Files Modified/Created

1. **`src/app/layout.tsx`**: Wrapped with ClerkProvider
2. **`src/middleware.ts`**: Handles authentication checks and redirects
3. **`src/app/sign-in/page.tsx`**: Sign-in page with Clerk widget
4. **`src/app/sign-up/page.tsx`**: Sign-up page with Clerk widget
5. **`src/components/navbar/Navbar.tsx`**: Added auth links and user button
6. **`src/app/HeroSection.tsx`**: Conditional rendering based on auth status
7. **`.env.example`**: Template for environment variables

### How It Works

1. **ClerkProvider**: Wraps the entire application in `layout.tsx`, providing authentication context
2. **Middleware**: Intercepts all requests and checks authentication status
   - Public routes: `/`, `/sign-in`, `/sign-up`
   - All other routes require authentication
3. **SignedIn/SignedOut Components**: Clerk provides these components to conditionally render UI based on authentication status
4. **UserButton**: Clerk's pre-built component for user profile and logout

### Security Features

- Server-side session validation
- Automatic token refresh
- Secure session management
- CSRF protection
- XSS protection

## Deployment

When deploying to production:

1. Create a production application in Clerk (or use the same app with production keys)
2. Add environment variables to your deployment platform:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - Other Clerk URL variables as needed

3. Ensure the redirect URLs are properly configured in your Clerk dashboard:
   - Sign-in URL: `https://yourdomain.com/sign-in`
   - Sign-up URL: `https://yourdomain.com/sign-up`
   - After sign-in URL: `https://yourdomain.com/`
   - After sign-up URL: `https://yourdomain.com/`

## Troubleshooting

### Error: "Publishable key not valid"
- Make sure you've copied the keys correctly from your Clerk dashboard
- Ensure there are no extra spaces or quotes in the `.env.local` file
- Restart your development server after changing environment variables

### User not staying logged in
- Check that the middleware is properly configured
- Verify that the Clerk keys are correct
- Clear your browser cookies and try again

### Authentication pages not loading
- Ensure the sign-in and sign-up pages are marked as `dynamic` (already done)
- Check that ClerkProvider is wrapping the application in layout.tsx
- Verify the middleware is not blocking these routes

## Additional Resources

- [Clerk Documentation](https://clerk.com/docs)
- [Clerk Next.js Integration](https://clerk.com/docs/quickstarts/nextjs)
- [Clerk API Reference](https://clerk.com/docs/reference/clerk-react)
