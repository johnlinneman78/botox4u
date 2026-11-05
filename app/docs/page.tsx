// CANCELLED Nov 5, 2026 (John's decision): API access is removed until
// the data is valuable enough for someone who wants it. This page was
// entirely API product documentation, so it now sends visitors to the
// paused notice on /api-access instead of showing plans or key signup.
// Restore the docs from git history when API access returns.
import { redirect } from 'next/navigation'

export default function ApiDocsPage() {
    redirect('/api-access')
}
