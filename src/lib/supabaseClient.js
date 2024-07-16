import { createClient } from "@supabase/supabase-js";

export const supabase = createClient("https://mruowxbmzmzydlagozsj.supabase.co", import.meta.env.VITE_SUPABASE_CLIENT_KEY);
