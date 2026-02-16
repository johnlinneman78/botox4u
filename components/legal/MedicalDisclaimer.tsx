import { AlertTriangle } from 'lucide-react'

export function MedicalDisclaimer({ variant = 'default' }: { variant?: 'default' | 'compact' | 'inline' }) {
    if (variant === 'inline') {
        return (
            <p className="text-xs text-gray-500 italic">
                *Not medical advice. Educational only. Verify pricing and credentials independently.
            </p>
        )
    }

    if (variant === 'compact') {
        return (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-gray-700">
                <p className="font-semibold text-amber-900 mb-1">⚠️ Important Disclaimer</p>
                <p>This information is educational only and not medical advice. Prices are estimates - verify with providers. Always verify credentials independently.</p>
            </div>
        )
    }

    return (
        <div className="bg-amber-50 border-l-4 border-amber-400 p-6 rounded-r-lg my-8">
            <div className="flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                <div className="space-y-3 text-sm text-gray-700">
                    <h3 className="font-bold text-amber-900 text-base">Medical Disclaimer</h3>

                    <p>
                        <strong>Not Medical Advice:</strong> The information on this website is for educational and informational purposes only.
                        It does not constitute medical advice and should not be relied upon as a substitute for professional medical consultation,
                        diagnosis, or treatment.
                    </p>

                    <p>
                        <strong>Pricing Estimates:</strong> All pricing information is estimated and provided for general reference only.
                        Actual costs may vary significantly based on provider, location, treatment complexity, and individual patient needs.
                        We do not guarantee pricing accuracy or treatment outcomes.
                    </p>

                    <p>
                        <strong>Provider Information:</strong> While we strive to list qualified providers, we do not endorse, recommend,
                        or guarantee any specific provider or treatment. Always verify provider credentials, licenses, and certifications
                        independently through your state medical board or relevant licensing authority.
                    </p>

                    <p>
                        <strong>Consult a Professional:</strong> Before undergoing any cosmetic procedure, consult with a board-certified
                        dermatologist, plastic surgeon, or qualified medical professional to discuss your specific needs, risks, and expected outcomes.
                    </p>

                    <p className="text-xs text-gray-500 pt-2 border-t border-amber-200">
                        By using this website, you acknowledge that you have read and understood this disclaimer.
                    </p>
                </div>
            </div>
        </div>
    )
}
