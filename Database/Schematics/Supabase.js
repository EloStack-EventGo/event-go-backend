import { createClient } from '@supabase/supabase-js';
export const supabaseClient = createClient(process.env.SUPA_URL, process.env.SUPA_ANON_KEY)
export const supabaseAdminClient = createClient(process.env.SUPA_URL, process.env.SUPA_SERVICE_KEY)