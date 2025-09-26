# Supabase Integration Setup

This project integrates with Supabase following the official documentation and best practices.

## Prerequisites

1. A Supabase account and project
2. Node.js and npm installed

## Setup Instructions

### 1. Create Supabase Project

Go to [database.new](https://database.new) and create a new Supabase project.

### 2. Set up the Database

Run this SQL in your Supabase SQL Editor to create the sample table:

```sql
-- Create the instruments table
create table instruments (
  id bigint primary key generated always as identity,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Insert some sample data
insert into instruments (name)
values
  ('violin'),
  ('viola'),
  ('cello'),
  ('piano'),
  ('guitar'),
  ('drums');

-- Enable Row Level Security
alter table instruments enable row level security;

-- Create a policy to allow public read access
create policy "public can read instruments"
on public.instruments
for select to anon
using (true);
```

### 3. Configure Environment Variables

Create a `.env` file in the project root with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key-here
```

You can find these values in your Supabase project dashboard under **Settings > API**.

### 4. Install Dependencies and Run

```bash
npm install
npm run dev
```

## Features Implemented

- ✅ Supabase client configuration with TypeScript
- ✅ Error handling and loading states
- ✅ Type-safe database queries
- ✅ Responsive UI with proper styling
- ✅ Environment variable configuration
- ✅ Row Level Security (RLS) support

## Best Practices Followed

1. **Type Safety**: Full TypeScript integration with proper types
2. **Error Handling**: Comprehensive error handling with user-friendly messages
3. **Loading States**: Proper loading indicators for better UX
4. **Environment Variables**: Secure configuration management
5. **Code Organization**: Separate configuration file for Supabase setup
6. **Security**: RLS policies for database access control

## Project Structure

```
src/
├── lib/
│   └── supabase.ts      # Supabase client configuration
├── App.tsx              # Main application component
├── App.css              # Application styles
└── main.tsx             # Application entry point
```

## Troubleshooting

If you see connection errors:

1. Verify your Supabase URL and key are correct
2. Ensure the `instruments` table exists in your database
3. Check that RLS is enabled with proper policies
4. Make sure your environment variables are properly set

## Next Steps

Consider implementing:

- User authentication
- CRUD operations (Create, Update, Delete)
- Real-time subscriptions
- File storage integration
- Advanced querying and filtering
