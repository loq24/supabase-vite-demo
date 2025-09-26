import { createClient } from "@supabase/supabase-js";
import type { Database } from "../types/supabase";

// Supabase configuration
// Replace these with your actual Supabase project credentials
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || "your-supabase-url-here";
const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  "your-supabase-publishable-key-here";

// Create Supabase client with typed database schema
export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

// Re-export types from generated schema
export type {
  User,
  Todo,
  UserInsert,
  TodoInsert,
  UserUpdate,
  TodoUpdate
} from "../types/supabase";
