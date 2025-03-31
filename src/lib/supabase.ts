import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wqnkoqvvosssvpnsuaad.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxbmtvcXZ2b3Nzc3ZwbnN1YWFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1NTU1ODIsImV4cCI6MjA1ODEzMTU4Mn0.nC3LnPg6OyvNisMdG8UNyzRn8gTWrVVdNkTtJUZ2T28'

export const supabase = createClient(supabaseUrl, supabaseKey)
