import { createClient } from "@supabase/supabase-js";

const supabaseURL = "https://ifpzjyhzljjcusvlzhhr.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmcHpqeWh6bGpqY3Vzdmx6aGhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4NTkxNTgsImV4cCI6MjA1NzQzNTE1OH0.h7JnpnudVsvrLi0IBSwybDpoMOED8d-NvL3XoeAN3yY";

export const supabase = createClient(supabaseURL, supabaseAnonKey) 