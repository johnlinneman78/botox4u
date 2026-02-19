import Link from 'next/link'
import Logo from '@/components/layout/Logo'

export default function ProviderLoginPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center mb-6">
                    <Logo className="h-12 w-auto" />
                </div>
                <h2 className="text-center text-3xl font-display font-bold text-gray-900">
                    Provider Login
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Access your clinic dashboard and manage leads.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-gray-100">
                    <div className="space-y-6">
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
                            <span className="text-blue-500 mt-0.5">ℹ️</span>
                            <p className="text-xs text-blue-800 leading-relaxed">
                                <strong>Beta Notice:</strong> We are currently in the process of rolling out self-service logins.
                                Please check your invitation email for access details.
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email Address</label>
                            <input
                                type="email"
                                disabled
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-gray-50 text-gray-400 sm:text-sm cursor-not-allowed"
                                placeholder="clinic@example.com"
                            />
                        </div>

                        <button
                            disabled
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-gray-400 cursor-not-allowed"
                        >
                            Sign In (Coming Soon)
                        </button>
                    </div>

                    <div className="mt-6 text-center">
                        <Link href="/provider/claim" className="text-sm font-semibold text-primary hover:text-slate-800">
                            Don't have a listing yet? Claim yours now →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
