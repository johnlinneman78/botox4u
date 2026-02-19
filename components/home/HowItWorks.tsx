import { NICHE } from '@/config/niche'
import { Target, DollarSign, Users, ShieldCheck, Eye } from 'lucide-react'

export default function HowItWorks() {
    const factors = [
        {
            title: 'Natural Results',
            points: '30 pts',
            description: 'We read the actual review language. Providers whose patients say "natural," "subtle," and "conservative" score highest. Providers whose patients mention "frozen" or "overdone" get flagged automatically.',
            icon: <Target className="w-8 h-8" />,
            color: 'bg-rose-50 text-rose-600'
        },
        {
            title: 'Fair Pricing',
            points: '25 pts',
            description: 'We show real per-unit pricing and compare every provider to the city average. No "call for a consultation." No surprises when you get there.',
            icon: <DollarSign className="w-8 h-8" />,
            color: 'bg-emerald-50 text-emerald-600'
        },
        {
            title: 'Patient Trust',
            points: '20 pts',
            description: 'How many real patients have reviewed this provider and what did they say? More verified reviews means more confidence in the score.',
            icon: <Users className="w-8 h-8" />,
            color: 'bg-blue-50 text-blue-600'
        },
        {
            title: 'Verified Credentials',
            points: '15 pts',
            description: 'Every provider is cross-referenced against the federal NPI database to confirm their medical license and credential type.',
            icon: <ShieldCheck className="w-8 h-8" />,
            color: 'bg-indigo-50 text-indigo-600'
        },
        {
            title: 'Transparency',
            points: '10 pts',
            description: 'Do they show their pricing? Do they have real photos? Do they respond to patient inquiries? Transparency is rewarded.',
            icon: <Eye className="w-8 h-8" />,
            color: 'bg-amber-50 text-amber-600'
        }
    ]

    return (
        <section className="py-24 bg-white border-t border-gray-100">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-primary mb-6">
                        How the {NICHE.name}-4U Score Works
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        We analyzed thousands of real patient reviews to find out what actually goes wrong.
                        Then we built a score that <span className="text-secondary font-bold">rewards providers who get it right.</span>
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {factors.map((factor) => (
                        <div key={factor.title} className="bg-gray-50 rounded-3xl p-8 border border-gray-100 transition-all hover:shadow-xl hover:-translate-y-1 group">
                            <div className={`w-16 h-16 rounded-2xl ${factor.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                {factor.icon}
                            </div>
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-lg font-bold text-primary">{factor.title}</h3>
                                <span className="text-xs font-black text-secondary bg-white px-2 py-1 rounded-lg shadow-sm border border-gray-100">
                                    {factor.points}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                {factor.description}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-16 p-8 bg-[#1a2332] rounded-[3rem] text-center text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 blur-[100px] rounded-full -mr-32 -mt-32"></div>
                    <p className="text-xl font-medium relative z-10">
                        Nobody pays for a higher score. Rankings are pure data.
                    </p>
                </div>
            </div>
        </section>
    )
}
