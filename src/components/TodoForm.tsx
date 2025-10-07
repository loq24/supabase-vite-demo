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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-xl font-light text-gray-900 mb-4">Add New Todo</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter todo title..."
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description (optional)
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter todo description..."
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition resize-none"
          />
        </div>

        <div>
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Image (optional)
          </label>
          <input
            ref={fileInputRef}
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-gray-900 file:text-white hover:file:bg-gray-800 file:cursor-pointer cursor-pointer"
            disabled={isUploading || createTodoMutation.isPending}
          />
          <p className="text-xs text-gray-500 mt-1">Maximum file size: 5MB</p>

          {imagePreview && (
            <div className="mt-3 space-y-2">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg border border-gray-200"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="w-full px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                disabled={isUploading || createTodoMutation.isPending}
              >
                Remove Image
              </button>
            </div>
          )}

          {uploadError && (
            <p className="text-sm text-red-600 mt-2">{uploadError}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={createTodoMutation.isPending || isUploading}
          className="w-full bg-gray-900 text-white py-2 px-4 rounded-md hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
        >
          {isUploading
            ? "Uploading..."
            : createTodoMutation.isPending
            ? "Adding..."
            : "Add Todo"}
        </button>

        {createTodoMutation.isError && (
          <p className="text-sm text-red-600">
            Error: {createTodoMutation.error?.message}
          </p>
        )}
      </form>
    </div>
  );
}
