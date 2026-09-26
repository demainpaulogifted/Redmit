import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ywfkxecubxiwbijviwfq.supabase.co'
const supabaseKey = 'sb_publishable_jvKVND-WOKJVrU704SqnSg_IrruYSEV'

export const supabase = createClient(supabaseUrl, supabaseKey)