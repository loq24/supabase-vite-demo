# Supabase TypeScript Type Generation

This project uses generated TypeScript types from your Supabase database schema instead of manually defined interfaces.

## Benefits

- **Type Safety**: Automatically synced with your database schema
- **IntelliSense**: Better autocomplete and error detection
- **Maintenance**: No need to manually update types when schema changes
- **Accuracy**: Types reflect your actual database structure

## How to Generate Types

### Prerequisites: Authentication

Before generating types, you need to authenticate with Supabase:

1. **Get an access token** from your Supabase dashboard:

   - Go to https://supabase.com/dashboard/account/tokens
   - Click "Generate new token"
   - Copy the token

2. **Set the access token** as an environment variable:
   ```bash
   export SUPABASE_ACCESS_TOKEN=your-access-token-here
   ```

### Option 1: Using the npm script (recommended)

Once authenticated, run the generation script:

```bash
npm run types:generate
```

Or use the token-aware script:

```bash
SUPABASE_ACCESS_TOKEN=your-token npm run types:generate-with-token
```

### Option 2: Direct command

Replace `YOUR_PROJECT_ID` with your actual Supabase project ID:

```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID --schema public > src/types/supabase.ts
```

### Option 3: Using environment variables

You can also use your project URL instead of project ID:

```bash
npx supabase gen types typescript --project-id $(echo $VITE_SUPABASE_URL | sed 's/.*\/\/\([^.]*\).*/\1/') --schema public > src/types/supabase.ts
```

## Finding Your Project ID

You can find your project ID in:

1. Your Supabase dashboard URL: `https://supabase.com/dashboard/project/YOUR_PROJECT_ID`
2. Your project settings in the Supabase dashboard
3. Extract from your `VITE_SUPABASE_URL`: it's the subdomain before `.supabase.co`

## Usage in Code

The generated types provide several benefits:

### 1. Typed Supabase Client

Your Supabase client is now fully typed:

```typescript
import { supabase } from "./lib/supabase";

// TypeScript knows the exact structure of your tables
const { data, error } = await supabase
  .from("todos")
  .select("*")
  .eq("completed", false);

// data is automatically typed as Todo[] | null
```

### 2. Type-safe Operations

```typescript
import type { TodoInsert, TodoUpdate } from "./lib/supabase";

// Insert operations are type-checked
const newTodo: TodoInsert = {
  title: "Learn TypeScript",
  description: "Master type generation",
  completed: false
};

// Update operations are also type-checked
const update: TodoUpdate = {
  completed: true,
  updated_at: new Date().toISOString()
};
```

### 3. Available Type Exports

The generated types include:

- `User`, `Todo` - Row types (what you get from SELECT queries)
- `UserInsert`, `TodoInsert` - Insert types (for INSERT operations)
- `UserUpdate`, `TodoUpdate` - Update types (for UPDATE operations)
- `Database` - Full database schema type

## When to Regenerate Types

Regenerate your types whenever you:

- Add/remove tables
- Add/remove columns
- Change column types
- Modify constraints
- Update your database schema in any way

## Automation

Consider adding type generation to your CI/CD pipeline or git hooks to ensure types stay in sync with your database schema.

## Troubleshooting

### Authentication Issues

If you get authentication errors, you may need to log in to Supabase CLI:

```bash
npx supabase login
```

### Project Not Found

Make sure your project ID is correct and you have access to the project.

### Network Issues

Ensure you have internet access and can reach supabase.com.
