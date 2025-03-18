import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vbbpxagkwlhvlsuqcovw.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZiYnB4YWdrd2xodmxzdXFjb3Z3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyOTY4ODgsImV4cCI6MjA1Nzg3Mjg4OH0.-zwWM_KAownBBfya1rJbm6809IhwBHgSQI5cq-OwJI8'

export const supabase = createClient(supabaseUrl, supabaseKey)
