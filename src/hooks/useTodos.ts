import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase, type Todo } from "../lib/supabase";

// Query keys for better organization and type safety
export const todoKeys = {
  all: ["todos"] as const,
  lists: () => [...todoKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...todoKeys.lists(), { filters }] as const,
  details: () => [...todoKeys.all, "detail"] as const,
  detail: (id: string) => [...todoKeys.details(), id] as const
};

// Fetch all todos for the current user
async function fetchTodos(): Promise<Todo[]> {
  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch todos: ${error.message}`);
  }

  return data || [];
}

// Fetch a single todo by ID
async function fetchTodo(id: string): Promise<Todo> {
  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(`Failed to fetch todo: ${error.message}`);
  }

  return data;
}

// Create a new todo
async function createTodo(
  todoData: Omit<Todo, "id" | "created_at" | "updated_at">
): Promise<Todo> {
  const { data, error } = await supabase
    .from("todos")
    .insert([todoData])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create todo: ${error.message}`);
  }

  return data;
}

// Update an existing todo
async function updateTodo({
  id,
  ...todoData
}: Partial<Todo> & { id: string }): Promise<Todo> {
  const { data, error } = await supabase
    .from("todos")
    .update(todoData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update todo: ${error.message}`);
  }

  return data;
}

// Delete a todo
async function deleteTodo(id: string): Promise<void> {
  const { error } = await supabase.from("todos").delete().eq("id", id);

  if (error) {
    throw new Error(`Failed to delete todo: ${error.message}`);
  }
}

// Toggle todo completion status
async function toggleTodo(id: string, completed: boolean): Promise<Todo> {
  const { data, error } = await supabase
    .from("todos")
    .update({ completed })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to toggle todo: ${error.message}`);
  }

  return data;
}

// Custom hooks
export function useTodos() {
  return useQuery({
    queryKey: todoKeys.lists(),
    queryFn: fetchTodos
  });
}

export function useTodo(id: string) {
  return useQuery({
    queryKey: todoKeys.detail(id),
    queryFn: () => fetchTodo(id),
    enabled: !!id
  });
}

export function useCreateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      // Invalidate and refetch todos list
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
    }
  });
}

export function useUpdateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTodo,
    onSuccess: (data) => {
      // Update the specific todo in cache
      queryClient.setQueryData(todoKeys.detail(data.id), data);
      // Invalidate todos list to ensure consistency
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
    }
  });
}

export function useDeleteTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      // Invalidate todos list
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
    }
  });
}

export function useToggleTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, completed }: { id: string; completed: boolean }) =>
      toggleTodo(id, completed),
    onSuccess: (data) => {
      // Update the specific todo in cache
      queryClient.setQueryData(todoKeys.detail(data.id), data);
      // Invalidate todos list to ensure consistency
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
    }
  });
}
