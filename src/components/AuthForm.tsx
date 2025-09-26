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
    <div className="auth-form">
      <div className="auth-form-container">
        <h2>
          {currentMode === "signin" && "Sign In"}
          {currentMode === "signup" && "Sign Up"}
          {currentMode === "reset" && "Reset Password"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              disabled={isLoading}
            />
          </div>

          {currentMode !== "reset" && (
            <div className="form-group">
              <label htmlFor="password">Password:</label>
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
              />
            </div>
          )}

          {currentMode === "signup" && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password:</label>
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
              />
            </div>
          )}

          <button type="submit" disabled={isLoading} className="submit-button">
            {isLoading && "Loading..."}
            {!isLoading && currentMode === "signin" && "Sign In"}
            {!isLoading && currentMode === "signup" && "Sign Up"}
            {!isLoading && currentMode === "reset" && "Send Reset Email"}
          </button>

          {message && (
            <p
              className={`message ${
                message.includes("sent") || message.includes("created")
                  ? "success"
                  : "error"
              }`}
            >
              {message}
            </p>
          )}
        </form>

        <div className="auth-links">
          {currentMode === "signin" && (
            <>
              <button
                type="button"
                onClick={() => handleModeChange("signup")}
                className="link-button"
              >
                Don't have an account? Sign up
              </button>
              <button
                type="button"
                onClick={() => handleModeChange("reset")}
                className="link-button"
              >
                Forgot your password?
              </button>
            </>
          )}

          {currentMode === "signup" && (
            <button
              type="button"
              onClick={() => handleModeChange("signin")}
              className="link-button"
            >
              Already have an account? Sign in
            </button>
          )}

          {currentMode === "reset" && (
            <button
              type="button"
              onClick={() => handleModeChange("signin")}
              className="link-button"
            >
              Back to sign in
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
