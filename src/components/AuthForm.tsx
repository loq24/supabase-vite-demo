import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSignIn, useSignUp, useResetPassword } from "../hooks/useAuth";

type AuthMode = "signin" | "signup" | "reset";

interface AuthFormProps {
  mode?: AuthMode;
  onModeChange?: (mode: AuthMode) => void;
}

export default function AuthForm({
  mode = "signin",
  onModeChange
}: AuthFormProps) {
  const navigate = useNavigate();
  const [currentMode, setCurrentMode] = useState<AuthMode>(mode);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [message, setMessage] = useState("");

  const signInMutation = useSignIn();
  const signUpMutation = useSignUp();
  const resetPasswordMutation = useResetPassword();

  const handleModeChange = (newMode: AuthMode) => {
    setCurrentMode(newMode);
    setMessage("");
    setFormData({ email: "", password: "", confirmPassword: "" });
    onModeChange?.(newMode);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!formData.email.trim()) {
      setMessage("Email is required");
      return;
    }

    if (currentMode === "reset") {
      try {
        const result = await resetPasswordMutation.mutateAsync({
          email: formData.email
        });
        if (result.error) {
          setMessage(result.error.message);
        } else {
          setMessage("Password reset email sent! Check your inbox.");
        }
      } catch {
        setMessage("An error occurred. Please try again.");
      }
      return;
    }

    if (!formData.password.trim()) {
      setMessage("Password is required");
      return;
    }

    if (formData.password.length < 6) {
      setMessage("Password must be at least 6 characters long");
      return;
    }

    if (
      currentMode === "signup" &&
      formData.password !== formData.confirmPassword
    ) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      if (currentMode === "signin") {
        const result = await signInMutation.mutateAsync({
          email: formData.email,
          password: formData.password
        });
        if (result.error) {
          setMessage(result.error.message);
        } else {
          // Redirect to todos page on successful sign-in
          navigate("/todos");
        }
      } else if (currentMode === "signup") {
        const result = await signUpMutation.mutateAsync({
          email: formData.email,
          password: formData.password
        });
        if (result.error) {
          setMessage(result.error.message);
        } else {
          setMessage(
            "Account created! Please check your email to verify your account."
          );
          handleModeChange("signin");
        }
      }
    } catch {
      setMessage("An error occurred. Please try again.");
    }
  };

  const isLoading =
    signInMutation.isPending ||
    signUpMutation.isPending ||
    resetPasswordMutation.isPending;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <h2 className="text-2xl font-light text-gray-900 mb-6">
        {currentMode === "signin" && "Sign In"}
        {currentMode === "signup" && "Sign Up"}
        {currentMode === "reset" && "Reset Password"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
            disabled={isLoading}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>

        {currentMode !== "reset" && (
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              disabled={isLoading}
              minLength={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>
        )}

        {currentMode === "signup" && (
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
              disabled={isLoading}
              minLength={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gray-900 text-white py-2 px-4 rounded-md hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed font-medium mt-6"
        >
          {isLoading && "Loading..."}
          {!isLoading && currentMode === "signin" && "Sign In"}
          {!isLoading && currentMode === "signup" && "Sign Up"}
          {!isLoading && currentMode === "reset" && "Send Reset Email"}
        </button>

        {message && (
          <p
            className={`text-sm p-3 rounded-md ${
              message.includes("sent") || message.includes("created")
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {message}
          </p>
        )}
      </form>

      <div className="mt-6 space-y-2 border-t border-gray-200 pt-6">
        {currentMode === "signin" && (
          <>
            <button
              type="button"
              onClick={() => handleModeChange("signup")}
              className="w-full text-sm text-gray-600 hover:text-gray-900 transition"
            >
              Don't have an account? Sign up
            </button>
            <button
              type="button"
              onClick={() => handleModeChange("reset")}
              className="w-full text-sm text-gray-600 hover:text-gray-900 transition"
            >
              Forgot your password?
            </button>
          </>
        )}

        {currentMode === "signup" && (
          <button
            type="button"
            onClick={() => handleModeChange("signin")}
            className="w-full text-sm text-gray-600 hover:text-gray-900 transition"
          >
            Already have an account? Sign in
          </button>
        )}

        {currentMode === "reset" && (
          <button
            type="button"
            onClick={() => handleModeChange("signin")}
            className="w-full text-sm text-gray-600 hover:text-gray-900 transition"
          >
            Back to sign in
          </button>
        )}
      </div>
    </div>
  );
}
