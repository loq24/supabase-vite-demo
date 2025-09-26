import { useState } from "react";
import { useCreateUser } from "../hooks/useUsers";

interface UserFormProps {
  onSuccess?: () => void;
}

export default function UserForm({ onSuccess }: UserFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: ""
  });

  const createUserMutation = useCreateUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.age) {
      return;
    }

    try {
      await createUserMutation.mutateAsync({
        name: formData.name,
        email: formData.email,
        age: parseInt(formData.age, 10)
      });

      // Reset form
      setFormData({ name: "", email: "", age: "" });
      onSuccess?.();
    } catch (error) {
      console.error("Failed to create user:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="user-form">
      <h3>Add New User</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="age">Age:</label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            min="1"
            required
          />
        </div>

        <button
          type="submit"
          disabled={createUserMutation.isPending}
          className="submit-button"
        >
          {createUserMutation.isPending ? "Adding..." : "Add User"}
        </button>

        {createUserMutation.isError && (
          <p className="error-message">
            Error: {createUserMutation.error?.message}
          </p>
        )}
      </form>
    </div>
  );
}
