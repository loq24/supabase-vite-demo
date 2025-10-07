import { useTodos, useToggleTodo, useDeleteTodo } from "../hooks/useTodos";
import { useAuth, useSignOut } from "../hooks/useAuth";
import TodoForm from "../components/TodoForm";

export default function TodosPage() {
  const { data: todos = [], isLoading, error, refetch } = useTodos();
  const { user } = useAuth();
  const toggleTodoMutation = useToggleTodo();
  const deleteTodoMutation = useDeleteTodo();
  const signOutMutation = useSignOut();

  const handleSignOut = async () => {
    await signOutMutation.mutateAsync();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-light text-gray-900">Todos</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Welcome, {user?.email}
              </span>
              <button
                onClick={handleSignOut}
                disabled={signOutMutation.isPending}
                className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 transition disabled:text-gray-400"
              >
                {signOutMutation.isPending ? "Signing out..." : "Sign Out"}
              </button>
            </div>
          </div>
          <p className="text-gray-600">Loading todos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-light text-gray-900">Todos</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Welcome, {user?.email}
              </span>
              <button
                onClick={handleSignOut}
                disabled={signOutMutation.isPending}
                className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 transition disabled:text-gray-400"
              >
                {signOutMutation.isPending ? "Signing out..." : "Sign Out"}
              </button>
            </div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-medium text-red-900 mb-2">Error</h2>
            <p className="text-red-800 mb-4">
              {error?.message || "An unexpected error occurred"}
            </p>
            <p className="text-red-800 mb-2">Make sure to:</p>
            <ul className="list-disc list-inside text-red-800 space-y-1 mb-4">
              <li>Set up your Supabase project</li>
              <li>Create the 'todos' table</li>
              <li>Add your Supabase URL and key to environment variables</li>
              <li>Enable Row Level Security and add appropriate policies</li>
            </ul>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-red-900 text-white rounded-md hover:bg-red-800 transition"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-light text-gray-900">My Todos</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Welcome, {user?.email}
            </span>
            <button
              onClick={handleSignOut}
              disabled={signOutMutation.isPending}
              className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 transition disabled:text-gray-400"
            >
              {signOutMutation.isPending ? "Signing out..." : "Sign Out"}
            </button>
          </div>
        </div>

        <TodoForm />

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-light text-gray-900">Your Todos</h2>
            <button
              onClick={() => refetch()}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:border-gray-400 transition"
            >
              Refresh
            </button>
          </div>
          {todos.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No todos found. Add your first todo above!
            </p>
          ) : (
            <ul className="space-y-3">
              {todos.map((todo) => (
                <li
                  key={todo.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition"
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={(e) =>
                        toggleTodoMutation.mutate({
                          id: todo.id,
                          completed: e.target.checked
                        })
                      }
                      disabled={toggleTodoMutation.isPending}
                      className="mt-1 w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-2 focus:ring-gray-900 cursor-pointer"
                    />
                    <div className="flex-1 min-w-0">
                      <h3
                        className={`text-lg font-medium ${
                          todo.completed
                            ? "line-through text-gray-400"
                            : "text-gray-900"
                        }`}
                      >
                        {todo.title}
                      </h3>
                      {todo.description && (
                        <p className="text-gray-600 text-sm mt-1">
                          {todo.description}
                        </p>
                      )}
                      {todo.image_url && (
                        <div className="mt-3 rounded-lg overflow-hidden">
                          <img
                            src={todo.image_url}
                            alt={todo.title}
                            className="max-w-full h-auto max-h-64 object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        </div>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>
                          Status: {todo.completed ? "Completed" : "Pending"}
                        </span>
                        {todo.created_at && (
                          <span>
                            Created:{" "}
                            {new Date(todo.created_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteTodoMutation.mutate(todo.id)}
                      disabled={deleteTodoMutation.isPending}
                      className="text-gray-400 hover:text-red-600 transition text-xl leading-none disabled:text-gray-300"
                      aria-label="Delete todo"
                    >
                      ×
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
