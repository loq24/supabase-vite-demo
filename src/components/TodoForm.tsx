import { useState, useRef } from "react";
import { useCreateTodo, uploadTodoImage } from "../hooks/useTodos";
import { useAuth } from "../hooks/useAuth";

interface TodoFormProps {
  onSuccess?: () => void;
}

export default function TodoForm({ onSuccess }: TodoFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: ""
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { user } = useAuth();
  const createTodoMutation = useCreateTodo();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setUploadError(null);

    if (!file) {
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setUploadError("Please select a valid image file");
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      setUploadError("Image size must be less than 5MB");
      return;
    }

    setSelectedImage(file);

    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !user) {
      return;
    }

    setUploadError(null);
    setIsUploading(true);

    try {
      let imageUrl = "";

      // Upload image if selected
      if (selectedImage) {
        try {
          imageUrl = await uploadTodoImage(selectedImage, user.id);
        } catch (error) {
          setUploadError(
            error instanceof Error ? error.message : "Failed to upload image"
          );
          setIsUploading(false);
          return;
        }
      }

      // Create todo with image URL
      await createTodoMutation.mutateAsync({
        title: formData.title.trim(),
        description: formData.description.trim(),
        completed: false,
        user_id: user.id,
        image_url: imageUrl
      });

      // Reset form
      setFormData({ title: "", description: "" });
      handleRemoveImage();
      onSuccess?.();
    } catch (error) {
      console.error("Failed to create todo:", error);
    } finally {
      setIsUploading(false);
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

        <div className="form-group">
          <label htmlFor="image">Image (optional):</label>
          <input
            ref={fileInputRef}
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            className="file-input"
            disabled={isUploading || createTodoMutation.isPending}
          />
          <p className="file-input-help">Maximum file size: 5MB</p>

          {imagePreview && (
            <div className="image-preview-container">
              <img src={imagePreview} alt="Preview" className="image-preview" />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="remove-image-button"
                disabled={isUploading || createTodoMutation.isPending}
              >
                Remove Image
              </button>
            </div>
          )}

          {uploadError && <p className="error-message">{uploadError}</p>}
        </div>

        <button
          type="submit"
          disabled={createTodoMutation.isPending || isUploading}
          className="submit-button"
        >
          {isUploading
            ? "Uploading..."
            : createTodoMutation.isPending
            ? "Adding..."
            : "Add Todo"}
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
