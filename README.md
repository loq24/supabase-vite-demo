# Supabase + React + Vite Demo

A modern todo application demonstrating Supabase integration with React, TypeScript, and TanStack Query. This project showcases best practices for building a full-stack application with authentication, real-time database operations, and type-safe development.

## Features

- **Authentication**: Email/password authentication with Supabase Auth
- **Todo Management**: Create, read, update, and delete todos with real-time updates
- **Type Safety**: Auto-generated TypeScript types from your Supabase schema
- **State Management**: TanStack Query for efficient server state management
- **Protected Routes**: Route protection with authentication guards
- **Modern UI**: Clean, minimalist interface built with TailwindCSS

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Backend**: Supabase (PostgreSQL + Auth)
- **Styling**: TailwindCSS v3
- **Data Fetching**: TanStack Query v5
- **Routing**: React Router v7
- **Type Generation**: Supabase CLI

## Prerequisites

- Node.js 18+ and npm
- A Supabase account and project ([sign up free](https://supabase.com))

## Setup Instructions

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd supabase-vite-demo
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. In your Supabase dashboard, go to **SQL Editor** and run:

```sql
-- Create todos table
create table todos (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  description text,
  completed boolean default false,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable Row Level Security
alter table todos enable row level security;

-- Create policies
create policy "Users can view their own todos"
  on todos for select
  using (auth.uid() = user_id);

create policy "Users can create their own todos"
  on todos for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own todos"
  on todos for update
  using (auth.uid() = user_id);

create policy "Users can delete their own todos"
  on todos for delete
  using (auth.uid() = user_id);
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
```

Find these values in your Supabase dashboard under **Settings > API**.

### 4. Generate TypeScript Types

Generate type-safe types from your database schema:

```bash
npm run types:generate
```

See `TYPE_GENERATION_GUIDE.md` for detailed instructions.

### 5. Run the Application

```bash
npm run dev
```

Visit `http://localhost:5173` to see your app!

## Project Structure

```
src/
├── components/        # Reusable React components
│   ├── AuthForm.tsx
│   ├── ErrorBoundary.tsx
│   ├── ProtectedRoute.tsx
│   └── TodoForm.tsx
├── contexts/          # React context providers
│   ├── auth-context.ts
│   └── AuthContext.tsx
├── hooks/             # Custom React hooks
│   ├── useAuth.ts     # Authentication mutations
│   └── useTodos.ts    # Todo CRUD operations
├── lib/               # Configuration and utilities
│   └── supabase.ts    # Supabase client setup
├── pages/             # Page components
│   ├── LoginPage.tsx
│   └── TodosPage.tsx
├── types/             # TypeScript type definitions
│   └── supabase.ts    # Auto-generated from DB schema
├── App.tsx            # Main app component with routing
└── main.tsx           # Application entry point
```

## Key Concepts

### TanStack Query Integration

This app uses TanStack Query for all server state management:

- Automatic caching and background refetching
- Optimistic updates for better UX
- Query invalidation on mutations
- Loading and error states

### Type-Safe Database Operations

All database operations are fully typed using auto-generated types from your Supabase schema:

```typescript
import type { Todo, TodoInsert, TodoUpdate } from "./lib/supabase";

// TypeScript knows the exact shape of your data
const newTodo: TodoInsert = {
  title: "Learn Supabase",
  completed: false
};
```

### Authentication Flow

- Protected routes redirect unauthenticated users to login
- Auth state is managed with React Context
- Automatic session persistence with Supabase

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run types:generate` - Generate TypeScript types from Supabase schema

## Learn More

- [Supabase Documentation](https://supabase.com/docs)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [React Router Documentation](https://reactrouter.com)
- [Vite Documentation](https://vite.dev)

## License

MIT
