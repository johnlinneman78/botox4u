const { spawn } = require('child_process');

const envs = [
    { name: 'NEXT_PUBLIC_SUPABASE_URL', value: 'https://tgqgsmaqmyeguapcogel.supabase.co', targets: ['production', 'preview', 'development'] },
    { name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRncWdzbWFxbXllZ3VhcGNvZ2VsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExOTQ4MjQsImV4cCI6MjA4Njc3MDgyNH0.JmZw3Z9MU-l5FDfhWpfgjNuyTF09UxbELs9M5BjDeo0', targets: ['production', 'preview', 'development'] },
    { name: 'SUPABASE_SERVICE_ROLE_KEY', value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRncWdzbWFxbXllZ3VhcGNvZ2VsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTE5NDgyNCwiZXhwIjoyMDg2NzcwODI0fQ.zVpz7CjppFXXThUnCTIBo2XfLscdhSNJ0t2EddGcFHc', targets: ['production', 'preview', 'development'] },
    { name: 'NEXT_PUBLIC_APP_URL', value: 'https://fiery-cosmos.vercel.app', targets: ['production', 'preview', 'development'] }
];

async function runVercel(args, input) {
    return new Promise((resolve, reject) => {
        console.log(`Running: vercel ${args.join(' ')}`);
        const proc = spawn('npx', ['-y', 'vercel', ...args], { shell: true });

        proc.stdin.write(input);
        proc.stdin.end();

        let output = '';
        proc.stdout.on('data', (data) => output += data);
        proc.stderr.on('data', (data) => output += data);

        proc.on('close', (code) => {
            if (code === 0) resolve(output);
            else reject(new Error(`Exit code ${code}: ${output}`));
        });
    });
}

async function main() {
    for (const env of envs) {
        for (const target of env.targets) {
            try {
                // Remove first to be safe
                // await runVercel(['env', 'rm', env.name, target, '-y'], '');
                // Try to add/set
                const result = await runVercel(['env', 'add', env.name, target], env.value);
                console.log(`Success: ${env.name} for ${target}`);
            } catch (err) {
                console.error(`Error adding ${env.name} for ${target}: ${err.message}`);
                // If it exists, we might need to remove it and then add
                if (err.message.includes('already exists')) {
                    console.log(`Key ${env.name} exists, removing and retrying...`);
                    await runVercel(['env', 'rm', env.name, target, '-y'], '');
                    await runVercel(['env', 'add', env.name, target], env.value);
                    console.log(`Success: ${env.name} for ${target} (after rm)`);
                }
            }
        }
    }
    console.log('All environment variables updated.');
}

main();
