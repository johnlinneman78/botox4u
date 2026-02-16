import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/Button'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
        redirect('/provider/login')
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-primary text-white hidden md:flex flex-col">
                <div className="p-6 border-b border-white/10">
                    <Link href="/" className="text-xl font-display font-bold">
                        Botox<span className="text-secondary">Directory</span>
                    </Link>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Provider Admin</p>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    <Link
                        href="/provider/dashboard"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg bg-secondary text-white font-medium transition-all"
                    >
                        <span>📊</span> Dashboard
                    </Link>
                    <Link
                        href="/provider/dashboard/leads"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 text-white/70 hover:text-white transition-all"
                    >
                        <span>✉️</span> Leads
                    </Link>
                    <Link
                        href="/provider/dashboard/profile"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 text-white/70 hover:text-white transition-all"
                    >
                        <span>✏️</span> Edit Listing
                    </Link>
                    <Link
                        href="/provider/dashboard/reviews"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 text-white/70 hover:text-white transition-all"
                    >
                        <span>⭐</span> Reviews
                    </Link>
                    <Link
                        href="/provider/dashboard/pricing"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 text-white/70 hover:text-white transition-all"
                    >
                        <span>💎</span> Upgrade
                    </Link>
                </nav>

                <div className="p-4 border-t border-white/10">
                    <form action="/auth/signout" method="post">
                        <button className="w-full text-left px-4 py-3 text-sm text-white/50 hover:text-white transition-all">
                            Sign Out
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col">
                {/* Top Header */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
                    <div className="text-sm text-gray-500">
                        Welcome back, <span className="font-bold text-primary">{session.user.email}</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Badge variant="premium">PREMIUM PARTNER</Badge>
                        <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-bold">
                            {session.user.email?.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-auto p-8">
                    {children}
                </div>
            </main>
        </div>
    )
}

function Badge({ children, variant }: { children: React.ReactNode, variant: string }) {
    return (
        <span className="px-2 py-1 bg-accent/10 text-accent text-[10px] font-bold rounded uppercase tracking-wider border border-accent/20">
            {children}
        </span>
    )
}
