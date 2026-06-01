import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ktzpfdwbvlaqtdjqgioa.supabase.co'
const supabaseAnonKey = 'sb_publishable_RPiuZWzr5LTtz3n3JOt81A_g67kmsrO'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)