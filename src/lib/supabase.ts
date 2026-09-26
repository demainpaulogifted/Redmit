import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ywfkwecubx2wbh1jvufq.supabase.co'
const supabaseKey = 'sb_publishable_jvKVND-WOKJVrU704SqnSg_IrruYSEV' // Your new publishable key

export const supabase = createClient(supabaseUrl, supabaseKey)