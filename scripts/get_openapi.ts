import * as fs from 'fs';

async function main() {
    const url = 'https://tgqgsmaqmyeguapcogel.supabase.co/rest/v1/?apikey=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRncWdzbWFxbXllZ3VhcGNvZ2VsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExOTQ4MjQsImV4cCI6MjA4Njc3MDgyNH0.JmZw3Z9MU-l5FDfhWpfgjNuyTF09UxbELs9M5BjDeo0';

    const response = await fetch(url);
    const data = await response.json();

    // Save locally to understand tables
    fs.writeFileSync('openapi.json', JSON.stringify(data, null, 2));
    console.log("Keys in OpenAPI definitions", Object.keys(data.definitions || {}));
}

main().catch(console.error);
