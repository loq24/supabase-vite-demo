import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../contexts/auth-context";
import { todoKeys } from "./useTodos";

// Hook for sign in mutation
export function useSignIn() {
  const { signIn } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      signIn(email, password),
    onSuccess: (result) => {
      if (!result.error) {
        // Clear todos cache when user signs in to refetch user-specific data
        queryClient.invalidateQueries({ queryKey: todoKeys.all });
      }
    }
  });
}

// Hook for sign up mutation
export function useSignUp() {
  const { signUp } = useAuth();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      signUp(email, password)
  });
}

// Hook for sign out mutation
export function useSignOut() {
  const { signOut } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => signOut(),
    onSuccess: (result) => {
      if (!result.error) {
        // Clear all cached data when user signs out
        queryClient.clear();
      }
    }
  });
}

// Hook for password reset mutation
export function useResetPassword() {
  const { resetPassword } = useAuth();

  return useMutation({
    mutationFn: ({ email }: { email: string }) => resetPassword(email)
  });
}

// useAuth hook for convenience
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
