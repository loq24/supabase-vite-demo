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
      <div className="page">
        <div className="page-header">
          <h1>Todos</h1>
          <div className="user-info">
            <span>Welcome, {user?.email}</span>
            <button
              onClick={handleSignOut}
              disabled={signOutMutation.isPending}
              className="sign-out-button"
            >
              {signOutMutation.isPending ? "Signing out..." : "Sign Out"}
            </button>
          </div>
        </div>
        <p>Loading todos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div className="page-header">
          <h1>Todos</h1>
          <div className="user-info">
            <span>Welcome, {user?.email}</span>
            <button
              onClick={handleSignOut}
              disabled={signOutMutation.isPending}
              className="sign-out-button"
            >
              {signOutMutation.isPending ? "Signing out..." : "Sign Out"}
            </button>
          </div>
        </div>
        <div className="error">
          <h2>Error</h2>
          <p>{error?.message || "An unexpected error occurred"}</p>
          <p>Make sure to:</p>
          <ul>
            <li>Set up your Supabase project</li>
            <li>Create the 'todos' table</li>
            <li>Add your Supabase URL and key to environment variables</li>
            <li>Enable Row Level Security and add appropriate policies</li>
          </ul>
          <button onClick={() => refetch()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>My Todos</h1>
        <div className="user-info">
          <span>Welcome, {user?.email}</span>
          <button
            onClick={handleSignOut}
            disabled={signOutMutation.isPending}
            className="sign-out-button"
          >
            {signOutMutation.isPending ? "Signing out..." : "Sign Out"}
          </button>
        </div>
      </div>

      <TodoForm />

      <div className="card">
        <h2>Your Todos</h2>
        {todos.length === 0 ? (
          <p>No todos found. Add your first todo above!</p>
        ) : (
          <ul className="todos-list">
            {todos.map((todo) => (
              <li key={todo.id} className="todo-item">
                <div className="todo-info">
                  <div className="todo-header">
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
                    />
                    <h3 className={todo.completed ? "completed" : ""}>
                      {todo.title}
                    </h3>
                    <button
                      onClick={() => deleteTodoMutation.mutate(todo.id)}
                      disabled={deleteTodoMutation.isPending}
                      className="delete-button"
                      aria-label="Delete todo"
                    >
                      ×
                    </button>
                  </div>
                  {todo.description && (
                    <p className="todo-description">{todo.description}</p>
                  )}
                  {todo.image_url && (
                    <div className="todo-image-container">
                      <img
                        src={todo.image_url}
                        alt={todo.title}
                        className="todo-image"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                  <p className="todo-status">
                    Status: {todo.completed ? "Completed" : "Pending"}
                  </p>
                  {todo.created_at && (
                    <p className="todo-date">
                      Created: {new Date(todo.created_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
        <button onClick={() => refetch()} className="refresh-button">
          Refresh Data
        </button>
      </div>
    </div>
  );
}
