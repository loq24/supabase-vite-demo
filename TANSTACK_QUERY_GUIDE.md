# TanStack Query Integration Guide

This project now uses TanStack Query (formerly React Query) for efficient data fetching, caching, and state management.

## 🚀 What's New

### Features Added

- **TanStack Query** for data fetching and caching
- **Custom hooks** for user CRUD operations
- **Error boundary** for better error handling
- **React Query DevTools** for development
- **Optimistic updates** and cache management
- **User form** for creating new users

## 📁 Project Structure

```
src/
├── hooks/
│   └── useUsers.ts          # Custom TanStack Query hooks
├── components/
│   ├── ErrorBoundary.tsx    # Global error boundary
│   └── UserForm.tsx         # Form for adding users
├── lib/
│   └── supabase.ts          # Supabase client and types
├── App.tsx                  # Main app component
└── main.tsx                 # App entry point with providers
```

## 🔧 Key Components

### 1. Query Client Setup (`main.tsx`)

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error) => {
        // Smart retry logic
        if (error?.status >= 400 && error?.status < 500) {
          return false; // Don't retry 4xx errors
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false
    }
  }
});
```

### 2. Custom Hooks (`hooks/useUsers.ts`)

#### Available Hooks:

- `useUsers()` - Fetch all users
- `useUser(id)` - Fetch single user
- `useCreateUser()` - Create new user
- `useUpdateUser()` - Update existing user
- `useDeleteUser()` - Delete user

#### Query Keys Structure:

```typescript
export const userKeys = {
  all: ["users"],
  lists: () => [...userKeys.all, "list"],
  list: (filters) => [...userKeys.lists(), { filters }],
  details: () => [...userKeys.all, "detail"],
  detail: (id) => [...userKeys.details(), id]
};
```

### 3. Error Handling

- **Error Boundary**: Catches React component errors
- **Query Error Handling**: Built-in error states in hooks
- **Form Validation**: Client-side validation with error display

## 🎯 Best Practices Implemented

### 1. **Query Key Management**

- Hierarchical query keys for better cache invalidation
- Type-safe query key factory functions

### 2. **Cache Management**

- Automatic cache invalidation on mutations
- Optimistic updates for better UX
- Smart stale time and garbage collection

### 3. **Error Handling**

- Multiple layers of error boundaries
- Graceful error states in UI
- Smart retry logic

### 4. **Performance**

- Background refetching
- Stale-while-revalidate pattern
- Efficient re-renders with proper dependencies

### 5. **Developer Experience**

- React Query DevTools integration
- TypeScript support throughout
- Clear separation of concerns

## 🔄 Data Flow

1. **Component renders** → TanStack Query hook called
2. **Cache check** → Return cached data if available and fresh
3. **Background fetch** → Fetch fresh data if stale
4. **UI updates** → Automatic re-render with new data
5. **Mutations** → Optimistic updates + cache invalidation

## 🛠️ Usage Examples

### Fetching Users

```typescript
function UsersList() {
  const { data: users, isLoading, error, refetch } = useUsers();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {users?.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### Creating Users

```typescript
function CreateUser() {
  const createUser = useCreateUser();

  const handleSubmit = async (userData) => {
    try {
      await createUser.mutateAsync(userData);
      // Cache automatically updated!
    } catch (error) {
      console.error("Failed to create user:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button type="submit" disabled={createUser.isPending}>
        {createUser.isPending ? "Creating..." : "Create User"}
      </button>
    </form>
  );
}
```

## 🎮 Development Tools

### React Query DevTools

- Press the TanStack Query icon in the bottom corner
- Inspect queries, mutations, and cache
- Monitor network requests and timing
- Debug cache invalidation

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

## 🚦 Query States

TanStack Query provides detailed state information:

- `isLoading` - Initial fetch in progress
- `isFetching` - Any fetch in progress (including background)
- `isError` - Query failed
- `isSuccess` - Query succeeded
- `isPending` - Loading or error state
- `isStale` - Data is stale and will be refetched

## 🔄 Cache Behavior

- **Stale Time**: 5 minutes (data considered fresh)
- **GC Time**: 10 minutes (unused data garbage collected)
- **Background Refetch**: Automatic when data becomes stale
- **Retry Logic**: Smart retry with exponential backoff

## 📈 Performance Benefits

1. **Reduced API Calls**: Intelligent caching and deduplication
2. **Better UX**: Instant loading states and optimistic updates
3. **Background Sync**: Fresh data without blocking UI
4. **Memory Management**: Automatic cleanup of unused data
5. **Network Efficiency**: Request deduplication and batching

## 🔧 Customization

The query client can be customized in `main.tsx`:

- Adjust stale time and cache time
- Modify retry logic
- Configure refetch behavior
- Add global error handling

## 🐛 Debugging

1. Use React Query DevTools
2. Check browser Network tab
3. Look for cache misses/hits
4. Monitor query key patterns
5. Verify mutation side effects

This integration follows TanStack Query best practices and provides a solid foundation for scalable data fetching in your React application.
