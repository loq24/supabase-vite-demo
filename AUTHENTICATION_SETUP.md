# Authentication Setup Guide

This application now includes full Supabase authentication integration with React Router for page navigation.

## Features Implemented

✅ **Authentication Context & Provider**

- Centralized auth state management
- Automatic session handling
- Auth state persistence

✅ **Authentication Hooks**

- `useAuth()` - Access current user and auth state
- `useSignIn()` - Sign in mutation with TanStack Query
- `useSignUp()` - Sign up mutation with TanStack Query
- `useSignOut()` - Sign out mutation with automatic cache clearing
- `useResetPassword()` - Password reset functionality

✅ **Routing & Navigation**

- React Router integration
- Protected routes for authenticated pages
- Automatic redirects based on auth state

✅ **UI Components**

- `AuthForm` - Unified login/signup/reset form
- `LoginPage` - Dedicated authentication page
- `TodosPage` - Protected todos management page
- `ProtectedRoute` - Route wrapper for auth protection

✅ **User Experience**

- Smooth loading states
- Error handling with user-friendly messages
- Responsive design with modern styling

## Application Structure

```
src/
├── contexts/
│   ├── auth-context.ts      # Auth context type definitions
│   └── AuthContext.tsx      # Auth provider component
├── hooks/
│   ├── useAuth.ts          # Authentication hooks
│   └── useTodos.ts         # Todos hooks (unchanged)
├── components/
│   ├── AuthForm.tsx        # Login/signup form
│   └── ProtectedRoute.tsx  # Route protection wrapper
├── pages/
│   ├── LoginPage.tsx       # Authentication page
│   └── TodosPage.tsx       # Protected todos page
└── App.tsx                 # Main app with routing
```

## Routes

- `/` - Redirects to `/todos`
- `/login` - Authentication page (login/signup/reset)
- `/todos` - Protected todos management page

## Supabase Setup Required

### 1. Enable Authentication in Supabase

In your Supabase project dashboard:

1. Go to **Authentication** → **Settings**
2. Enable **Email** provider
3. Configure your site URL in **Redirect URLs**:
   - Add `http://localhost:5173` for development
   - Add your production URL when deploying

### 2. Row Level Security (RLS) for Todos

The todos table should have RLS policies to ensure users only see their own todos:

```sql
-- Enable RLS
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own todos
CREATE POLICY "Users can view own todos" ON todos
    FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can insert their own todos
CREATE POLICY "Users can insert own todos" ON todos
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own todos
CREATE POLICY "Users can update own todos" ON todos
    FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Users can delete their own todos
CREATE POLICY "Users can delete own todos" ON todos
    FOR DELETE USING (auth.uid() = user_id);
```

### 3. Update Todos Table Schema

Make sure your todos table includes a `user_id` column:

```sql
-- Add user_id column if it doesn't exist
ALTER TABLE todos ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Set default to current user for new todos
ALTER TABLE todos ALTER COLUMN user_id SET DEFAULT auth.uid();
```

## Environment Variables

Make sure you have your Supabase credentials in your environment:

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

## Usage Flow

1. **Unauthenticated users** are automatically redirected to `/login`
2. **Login page** offers sign in, sign up, and password reset options
3. **After authentication**, users are redirected to `/todos`
4. **Todos page** displays user-specific todos with full CRUD operations
5. **Sign out** clears the session and returns to login page

## Best Practices Implemented

- ✅ Type-safe authentication with TypeScript
- ✅ Proper error handling and user feedback
- ✅ Secure routing with protected routes
- ✅ Optimistic UI updates with TanStack Query
- ✅ Automatic cache invalidation on auth changes
- ✅ Responsive and accessible UI components
- ✅ Modern React patterns (hooks, context, functional components)

## Testing the Authentication

1. Start the development server: `npm run dev`
2. Navigate to `http://localhost:5173`
3. You should be redirected to the login page
4. Try signing up with a new account
5. Check your email for verification (if email confirmation is enabled)
6. Sign in and access the protected todos page
7. Test the sign out functionality

The application is now ready for production use with a complete authentication system!
