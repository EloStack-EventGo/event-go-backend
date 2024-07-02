import { createClient } from '@supabase/supabase-js';
import {SUPA_URL, SUPA_ANON_KEY, SUPA_SERVICE_KEY} from '../credentials.js';
export const supabaseClient = createClient(SUPA_URL, SUPA_ANON_KEY)
export const supabaseAdminClient = createClient(SUPA_URL, SUPA_SERVICE_KEY)
export {SUPA_URL, SUPA_ANON_KEY, SUPA_SERVICE_KEY}