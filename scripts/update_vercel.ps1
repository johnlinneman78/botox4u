$anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRncWdzbWFxbXllZ3VhcGNvZ2VsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExOTQ4MjQsImV4cCI6MjA4Njc3MDgyNH0.JmZw3Z9MU-l5FDfhWpfgjNuyTF09UxbELs9M5BjDeo0"
$serviceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRncWdzbWFxbXllZ3VhcGNvZ2VsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTE5NDgyNCwiZXhwIjoyMDg2NzcwODI0fQ.zVpz7CjppFXXThUnCTIBo2XfLscdhSNJ0t2EddGcFHc"
$url = "https://tgqgsmaqmyeguapcogel.supabase.co"
$appUrl = "https://injectorindex.com"

Write-Host "Updating Environment Variables on Vercel..."

# Update Anon Key
echo $anonKey | npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
echo $anonKey | npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY preview
echo $anonKey | npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY development

# Update Service Key
echo $serviceKey | npx vercel env add SUPABASE_SERVICE_ROLE_KEY production
echo $serviceKey | npx vercel env add SUPABASE_SERVICE_ROLE_KEY preview
echo $serviceKey | npx vercel env add SUPABASE_SERVICE_ROLE_KEY development

# Update URLs
echo $url | npx vercel env add NEXT_PUBLIC_SUPABASE_URL production
echo $url | npx vercel env add NEXT_PUBLIC_SUPABASE_URL preview
echo $url | npx vercel env add NEXT_PUBLIC_SUPABASE_URL development

echo $appUrl | npx vercel env add NEXT_PUBLIC_APP_URL production
echo $appUrl | npx vercel env add NEXT_PUBLIC_APP_URL preview
echo $appUrl | npx vercel env add NEXT_PUBLIC_APP_URL development

Write-Host "Triggering Redeploy..."
npx vercel --prod --yes
