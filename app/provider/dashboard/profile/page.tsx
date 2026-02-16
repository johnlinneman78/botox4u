import { getProviderDashboardData } from '@/lib/actions/providers'
import { ProfileForm } from '@/components/providers/ProfileForm'
import { redirect } from 'next/navigation'

export default async function ProviderProfileSettingsPage() {
    const data = await getProviderDashboardData()

    if (!data || !data.provider) {
        redirect('/provider/dashboard')
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-display font-bold text-primary">Edit Clinic Profile</h1>
                <p className="text-gray-500 text-sm mt-1">
                    Update your public listing details to attract more patients.
                </p>
            </div>

            <ProfileForm provider={data.provider} />
        </div>
    )
}
