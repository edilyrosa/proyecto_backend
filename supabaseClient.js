import dotenv from 'dotenv'
import {createClient} from '@supabase/supabase-js'

 dotenv.config()
 const supabaseUrl = process.env.SUPABSE_URL
 const supabaseKey = process.env.SUPABSE_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)