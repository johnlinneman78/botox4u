import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://tgqgsmaqmyeguapcogel.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRncWdzbWFxbXllZ3VhcGNvZ2VsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTE5NDgyNCwiZXhwIjoyMDg2NzcwODI0fQ.zVpz7CjppFXXThUnCTIBo2XfLscdhSNJ0t2EddGcFHc";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function main() {
    const { data, error } = await supabase.rpc('exec_sql', { sql_string: 'SELECT 1;' });
    console.log('exec_sql string:', data, error);

    const { data: d2, error: e2 } = await supabase.rpc('execute_sql', { sql: 'SELECT 1;' });
    console.log('execute_sql:', d2, e2);

    const { data: d3, error: e3 } = await supabase.rpc('exec', { query: 'SELECT 1;' });
    console.log('exec:', d3, e3);
}

main().catch(console.error);
