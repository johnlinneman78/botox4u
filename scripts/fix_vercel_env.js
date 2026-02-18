const { execSync } = require('child_process');

const envs = {
    NEXT_PUBLIC_SUPABASE_URL: "https://tgqgsmaqmyeguapcogel.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmJhc2UiLCJyZWYiOiJ0Z3Fnc21hcW15ZWd1YXBjb2dlbCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzcxMTk0ODI0LCJleHAiOjIwODY3NzA4MjR9.JmZw3Z9MU-l5FDfhWpfgjNuyTF09UxbELs9M5BjDeo0",
    NEXT_PUBLIC_APP_URL: "https://botox-4u.com",
    SUPABASE_SERVICE_ROLE_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRncWdzbWFxbXllZ3VhcGNvZ2VsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTE5NDgyNCwiZXhwIjoyMDg2NzcwODI0fQ.zVpz7CjppFXXThUnCTIBo2XfLscdhSNJ0t2EddGcFHc"
};

for (const [key, value] of Object.entries(envs)) {
    console.log(`Setting ${key}...`);
    // Use node to output the string without a newline
    execSync(`node -e "process.stdout.write('${value}')" | npx vercel env add ${key} production`);
}
