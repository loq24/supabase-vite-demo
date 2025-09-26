import { useState } from "react";
import { useCreateTodo } from "../hooks/useTodos";

interface TodoFormProps {
  onSuccess?: () => void;
}

export default function TodoForm({ onSuccess }: TodoFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: ""
  });

  const createTodoMutation = useCreateTodo();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      return;
    }

    try {
      await createTodoMutation.mutateAsync({
        title: formData.title.trim(),
        description: formData.description.trim(),
        completed: false
      });

      // Reset form
      setFormData({ title: "", description: "" });
      onSuccess?.();
    } catch (error) {
      console.error("Failed to create todo:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="todo-form">
      <h3>Add New Todo</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter todo title..."
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description (optional):</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter todo description..."
            rows={3}
          />
        </div>

        <button
          type="submit"
          disabled={createTodoMutation.isPending}
          className="submit-button"
        >
          {createTodoMutation.isPending ? "Adding..." : "Add Todo"}
        </button>

        {createTodoMutation.isError && (
          <p className="error-message">
            Error: {createTodoMutation.error?.message}
          </p>
        )}
      </form>
    </div>
  );
}
