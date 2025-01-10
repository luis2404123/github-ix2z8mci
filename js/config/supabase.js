import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hfporiyhrfqhqgmvkfsu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmcG9yaXlocmZxaHFnbXZrZnN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU4MTI1NTEsImV4cCI6MjA1MTM4ODU1MX0.ppErrWGHZt19wQygk2avi2b8zP0x1-I4S9JU-JSazl8';

export const supabase = createClient(supabaseUrl, supabaseKey);