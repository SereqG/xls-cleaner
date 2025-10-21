This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set up Clerk Authentication

This project uses [Clerk](https://clerk.com) for authentication. To set it up:

1. Create a free account at [https://clerk.com](https://clerk.com)
2. Create a new application in the Clerk dashboard
3. Copy your API keys from [https://dashboard.clerk.com/last-active?path=api-keys](https://dashboard.clerk.com/last-active?path=api-keys)
4. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
5. Update `.env.local` with your actual Clerk keys:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
   CLERK_SECRET_KEY=sk_test_your_key_here
   ```

### 3. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Authentication Features

- **Login/Register**: Access authentication pages via links in the navbar
- **Protected Upload**: File upload is only available to authenticated users
- **Session Management**: Automatic redirect to login when session expires
- **SSR Support**: Authentication state is handled on both server and client side
- **Auto Logout Redirect**: Users are redirected to home page after logout

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

**Note**: When deploying, make sure to add your Clerk API keys as environment variables in your deployment platform.
