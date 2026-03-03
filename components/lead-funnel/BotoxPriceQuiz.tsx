'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    HelpCircle,
    Sparkles,
    MapPin,
    Stethoscope,
    Target,
    ArrowRight,
    ArrowLeft,
    CheckCircle2,
    Calendar,
    DollarSign,
    TrendingDown,
    Mail,
    Zap,
    ShieldCheck
} from 'lucide-react'
import { NICHE } from '@/config/niche'
import Link from 'next/link'

// UI Constants from Design System
const COLORS = {
    linen: '#F7F4F0',
    espresso: '#1A1A1A',
    champagne: '#B5936B',
    success: '#5A9E6F',
    border: '#ECE8E2',
    textSecondary: '#666666'
}

const questions = [
    {
        id: 1,
        question: "What's bringing you here today?",
        subtitle: "Let's figure out what matters most to you",
        icon: HelpCircle,
        options: [
            { text: "I want Botox but have no idea what to expect on cost", value: "cost_curious" },
            { text: "I've had Botox before and think I'm overpaying", value: "price_check" },
            { text: "I'm comparing providers and want to make a smart choice", value: "comparing" },
            { text: "I'm nervous about getting a bad result", value: "safety_first" },
        ],
    },
    {
        id: 2,
        question: "Which treatment area are you most interested in?",
        subtitle: "This affects both price and how many units you'll need",
        icon: Sparkles,
        options: [
            { text: "Forehead lines (horizontal lines)", value: "forehead", units: "10-30" },
            { text: "Frown lines (between eyebrows / '11s')", value: "frown", units: "20-40" },
            { text: "Crow's feet (around the eyes)", value: "crows_feet", units: "12-24" },
            { text: "Multiple areas or full face", value: "multiple", units: "40-80" },
        ],
    },
    {
        id: 3,
        question: "What city are you in (or closest to)?",
        subtitle: "Location is one of the biggest price factors",
        icon: MapPin,
        options: [
            { text: "New York / LA / San Francisco / Miami", value: "premium", tier: "premium" },
            { text: "Chicago / Seattle / Boston / Denver / Portland", value: "major", tier: "major" },
            { text: "Dallas / Atlanta / Phoenix / Nashville / Austin", value: "emerging", tier: "emerging" },
            { text: "Somewhere else", value: "other", tier: "major" },
        ],
    },
    {
        id: 4,
        question: "Have you had Botox or other neurotoxin treatments before?",
        subtitle: "Your experience level changes what to look for",
        icon: Stethoscope,
        options: [
            { text: "Never — this would be my first time", value: "first_time" },
            { text: "Once or twice", value: "some_experience" },
            { text: "Regularly (3+ times a year)", value: "experienced" },
        ],
    },
    {
        id: 5,
        question: "What matters most to you in choosing a provider?",
        subtitle: "There's no wrong answer — this shapes your personalized results",
        icon: Target,
        options: [
            { text: "Lowest price for good quality", value: "value" },
            { text: "Best credentials and experience", value: "credentials" },
            { text: "Best patient reviews and results", value: "reviews" },
            { text: "Most natural-looking results", value: "natural" },
        ],
    },
];

const priceData: Record<string, any> = {
    premium: {
        forehead: { low: 250, avg: 375, high: 525 },
        frown: { low: 275, avg: 400, high: 575 },
        crows_feet: { low: 200, avg: 325, high: 475 },
        multiple: { low: 500, avg: 750, high: 1100 },
    },
    major: {
        forehead: { low: 200, avg: 325, high: 450 },
        frown: { low: 225, avg: 350, high: 475 },
        crows_feet: { low: 175, avg: 275, high: 400 },
        multiple: { low: 400, avg: 625, high: 900 },
    },
    emerging: {
        forehead: { low: 175, avg: 285, high: 400 },
        frown: { low: 200, avg: 310, high: 425 },
        crows_feet: { low: 150, avg: 240, high: 360 },
        multiple: { low: 350, avg: 550, high: 800 },
    },
};

const CountingNumber = ({ value }: { value: number }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const end = value;
        if (start === end) return;

        let totalMiliseconds = 1500;
        let incrementTime = (totalMiliseconds / end) * 5;

        let timer = setInterval(() => {
            start += 5;
            setCount(start);
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            }
        }, incrementTime);

        return () => clearInterval(timer);
    }, [value]);

    return <span>{count}</span>;
}

export default function BotoxPriceQuiz() {
    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useState<Record<number, any>>({});
    const [showResults, setShowResults] = useState(false);
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSelect = (option: any) => {
        const newAnswers = { ...answers, [currentQ]: option };
        setAnswers(newAnswers);

        setTimeout(() => {
            if (currentQ < questions.length - 1) {
                setCurrentQ(currentQ + 1);
            } else {
                setShowResults(true);
            }
        }, 400);
    };

    const handleReset = () => {
        setCurrentQ(0);
        setAnswers({});
        setShowResults(false);
        setEmail("");
        setSubmitted(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.includes('@')) return;

        setIsLoading(true);
        try {
            // Save lead to database
            const response = await fetch('/api/quiz-submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    answers,
                    source: 'botox_price_quiz'
                })
            });

            // Always show submitted state
            setSubmitted(true);

            // Fire drip enrollment independently (don't await, don't block UI)
            fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    firstName: email.split('@')[0],
                    source: 'quiz'
                })
            }).catch(err => console.error('Subscribe error:', err));

        } catch (error) {
            console.error('Submission error:', error);
        } finally {
            setIsLoading(false);
        }
    };


    const tier = answers[2]?.tier || "major";
    const area = answers[1]?.value || "forehead";
    const prices = priceData[tier]?.[area] || priceData.major.forehead;
    const experience = answers[3]?.value || "first_time";
    const priority = answers[4]?.value || "value";
    const motivation = answers[0]?.value || "cost_curious";

    const areaNames: Record<string, string> = {
        forehead: "Forehead Lines",
        frown: "Frown Lines ('11s')",
        crows_feet: "Crow's Feet",
        multiple: "Multiple Areas / Full Face",
    };

    const tierNames: Record<string, string> = {
        premium: "Premium Market (NYC, LA, SF, Miami)",
        major: "Major Metro Area",
        emerging: "Emerging Market",
    };

    const tips = [];
    if (experience === "first_time") {
        tips.push("Book a dedicated consultation first. Don't feel pressured to inject on day one.");
        tips.push("Start conservative. You can always add units 2 weeks later, but you can't take them away.");
    }
    if (experience === "experienced") {
        tips.push("Stack reward points. Use Allē + MedSpa loyalty programs for maximum savings.");
        tips.push("Ask about 'Regen' options like PRF to improve skin quality alongside toxin.");
    }
    if (priority === "value") {
        tips.push("The 'sweet spot' is often a provider in the 40th-60th price percentile with 50+ reviews.");
    }
    if (priority === "natural") {
        tips.push("Ask your injector: 'How do you preserve facial movement?'. A good pro has a clear answer.");
    }

    const annualLow = prices.low * 3;
    const annualHigh = prices.high * 4;

    return (
        <div className="max-w-2xl mx-auto px-4 py-12">
            <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-[#B5936B]" />
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#1A1A1A]">
                        {NICHE.siteName} Intelligence
                    </span>
                </div>
                {!showResults && (
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl md:text-4xl font-serif text-[#1A1A1A]"
                    >
                        What Should {NICHE.name} Cost You?
                    </motion.h1>
                )}
            </div>

            <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-[#ECE8E2] overflow-hidden">
                <AnimatePresence mode="wait">
                    {!showResults ? (
                        <motion.div
                            key={`q-${currentQ}`}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="p-8 md:p-12"
                        >
                            <div className="flex justify-between items-end mb-8">
                                <div className="flex flex-col">
                                    <span className="text-[11px] font-bold text-[#B5936B] uppercase tracking-wider mb-2">
                                        Step {currentQ + 1} of {questions.length}
                                    </span>
                                    <div className="flex gap-1">
                                        {questions.map((_, i) => (
                                            <div
                                                key={i}
                                                className={`h-1 rounded-full transition-all duration-300 ${i <= currentQ ? 'w-8 bg-[#B5936B]' : 'w-4 bg-[#ECE8E2]'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className="p-3 bg-[#F7F4F0] rounded-xl text-[#B5936B]">
                                    {(() => {
                                        const Icon = questions[currentQ].icon;
                                        return <Icon size={24} />
                                    })()}
                                </div>
                            </div>

                            <h2 className="text-2xl font-serif text-[#1A1A1A] mb-3 leading-tight">
                                {questions[currentQ].question}
                            </h2>
                            <p className="text-sm text-[#666] mb-8 font-light italic">
                                {questions[currentQ].subtitle}
                            </p>

                            <div className="grid gap-3">
                                {questions[currentQ].options.map((option, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleSelect(option)}
                                        className={`group relative flex items-center justify-between p-5 rounded-xl border text-left transition-all duration-200 ${answers[currentQ]?.value === option.value
                                            ? 'border-[#B5936B] bg-[#F7F4F0] shadow-sm'
                                            : 'border-[#ECE8E2] hover:border-[#B5936B] hover:bg-[#FDFBF9]'
                                            }`}
                                    >
                                        <span className={`text-sm md:text-base font-medium transition-colors ${answers[currentQ]?.value === option.value ? 'text-[#1A1A1A]' : 'text-[#444] group-hover:text-[#1A1A1A]'
                                            }`}>
                                            {option.text}
                                        </span>
                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${answers[currentQ]?.value === option.value
                                            ? 'bg-[#B5936B] border-[#B5936B]'
                                            : 'border-[#CCC] group-hover:border-[#B5936B]'
                                            }`}>
                                            {answers[currentQ]?.value === option.value && <CheckCircle2 size={12} className="text-white" />}
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {currentQ > 0 && (
                                <button
                                    onClick={() => setCurrentQ(currentQ - 1)}
                                    className="mt-8 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#666] hover:text-[#1A1A1A] transition-colors"
                                >
                                    <ArrowLeft size={14} /> Back
                                </button>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="p-8 md:p-12"
                        >
                            <div className="bg-[#1A1A1A] text-white p-8 md:p-10 rounded-xl mb-10 overflow-hidden relative">
                                {/* Decorative Pattern */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#B5936B] to-transparent opacity-10 blur-2xl" />

                                <div className="relative z-10 text-center">
                                    <span className="text-[10px] font-bold text-[#B5936B] uppercase tracking-[0.3em] mb-4 block">
                                        Calculated Estimate
                                    </span>
                                    <h2 className="text-3xl font-serif mb-2">{areaNames[area]}</h2>
                                    <p className="text-xs text-[#999] font-light mb-8">{tierNames[tier]}</p>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                        {[
                                            { label: "Market Low", val: prices.low, sub: "Competitive range", icon: TrendingDown },
                                            { label: "Fair Market", val: prices.avg, sub: "Recommended benchmark", icon: DollarSign, primary: true },
                                            { label: "Market High", val: prices.high, sub: "Premium providers", icon: ShieldCheck }
                                        ].map((item, i) => (
                                            <div key={i} className={`p-6 rounded-xl border transition-all ${item.primary ? 'bg-white/5 border-[#B5936B]' : 'bg-transparent border-white/10'
                                                }`}>
                                                <div className="text-[9px] font-bold uppercase tracking-wider text-[#999] mb-3 flex items-center justify-center gap-2">
                                                    <item.icon size={10} className={item.primary ? 'text-[#B5936B]' : ''} />
                                                    {item.label}
                                                </div>
                                                <div className={`text-4xl font-serif mb-1 ${item.primary ? 'text-[#B5936B]' : 'text-white'}`}>
                                                    $<CountingNumber value={item.val} />
                                                </div>
                                                <div className="text-[10px] text-[#666] font-light">{item.sub}</div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pt-6 border-t border-white/5">
                                        <p className="text-xs text-[#999] font-light italic">
                                            Expected Annual Cost (3-4 visits): <span className="text-[#B5936B] font-medium ml-1">
                                                $<CountingNumber value={annualLow} /> – $<CountingNumber value={annualHigh} />
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-10">
                                <h3 className="text-lg font-serif text-[#1A1A1A] mb-4 flex items-center gap-2">
                                    <Zap size={18} className="text-[#B5936B]" />
                                    Smart Tips for Your Profile
                                </h3>
                                <div className="grid gap-3">
                                    {tips.map((tip, i) => (
                                        <div key={i} className="flex gap-4 p-4 rounded-lg bg-[#F7F4F0] border border-[#ECE8E2]">
                                            <div className="w-5 h-5 rounded-full bg-white border border-[#B5936B] flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <span className="text-[10px] font-bold text-[#B5936B]">{i + 1}</span>
                                            </div>
                                            <p className="text-sm text-[#444] leading-relaxed font-light">{tip}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {!submitted ? (
                                <div className="p-8 bg-[#F7F4F0] border-2 border-[#B5936B] rounded-xl text-center">
                                    <Mail className="mx-auto mb-4 text-[#B5936B]" size={32} />
                                    <h3 className="text-xl font-serif text-[#1A1A1A] mb-2 leading-tight">
                                        Download the Full 2026 Price Guide
                                    </h3>
                                    <p className="text-sm text-[#666] font-light mb-6">
                                        Unlock pricing for all 22 major cities, the Injector Red Flag Checklist, and our 5-day "Smart Patient" email masterclass.
                                    </p>

                                    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3 max-w-md mx-auto">
                                        <input
                                            type="email"
                                            required
                                            placeholder="Email address"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="flex-1 px-4 py-3 rounded-full border border-[#ECE8E2] text-sm focus:outline-none focus:ring-1 focus:ring-[#B5936B] transition-all"
                                        />
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="px-8 py-3 bg-[#1A1A1A] text-white text-[11px] font-bold uppercase tracking-widest rounded-full hover:bg-[#333] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            {isLoading ? 'Sending...' : 'Access Now'}
                                            {!isLoading && <ArrowRight size={14} />}
                                        </button>
                                    </form>
                                    <p className="mt-4 text-[10px] text-[#999] font-light">
                                        Verified Data · No Spam · Independent Clinical Research
                                    </p>
                                </div>
                            ) : (
                                <div className="p-10 bg-[#F7F4F0] border border-[#B5936B] rounded-xl text-center">
                                    <div className="w-16 h-16 bg-[#5A9E6F] rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle2 className="text-white" size={32} />
                                    </div>
                                    <h3 className="text-2xl font-serif text-[#1A1A1A] mb-3">Guide on the way!</h3>
                                    <p className="text-sm text-[#666] font-light mb-8 max-w-sm mx-auto">
                                        We've sent the 2026 Price Guide to <strong className="text-[#1A1A1A] font-medium">{email}</strong>.
                                        Your Day 1 masterclass lesson arrives tomorrow morning.
                                    </p>
                                    <Link
                                        href="/"
                                        className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest bg-[#1A1A1A] text-white px-10 py-4 rounded-full hover:bg-black transition-all"
                                    >
                                        Back to Homepage
                                    </Link>
                                </div>
                            )}

                            <div className="mt-12 pt-8 border-t border-[#ECE8E2] text-center">
                                <button
                                    onClick={handleReset}
                                    className="text-[10px] font-bold uppercase tracking-widest text-[#999] hover:text-[#B5936B] transition-colors"
                                >
                                    Retake Price Quiz
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <p className="mt-8 text-center text-[10px] text-[#999] font-light leading-relaxed">
                Price estimates are based on industry benchmarks for {NICHE.name} treatments.<br />
                Always consult with a qualified medical professional for exact pricing based on your unique anatomy.
            </p>
        </div>
    )
}
