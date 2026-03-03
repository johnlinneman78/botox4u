import { Sparkles } from 'lucide-react'

export default function Loading() {
    return (
        <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-6 text-center">
            <div className="relative mb-12 animate-pulse">
                <div className="w-24 h-24 rounded-3xl bg-[#C9A96E]/5 border border-[#C9A96E]/15 flex items-center justify-center text-[#C9A96E] shadow-3xl">
                    <Sparkles className="w-12 h-12" />
                </div>
                <div className="absolute inset-0 bg-[#C9A96E] opacity-10 blur-[50px] rounded-full" />
            </div>

            <div className="space-y-4 max-w-sm mx-auto">
                <h2 className="text-2xl font-display font-bold text-[#3D2B1F] uppercase tracking-widest">Hydrating Clinical Data...</h2>
                <div className="w-full h-1 bg-[#3D2B1F]/5 rounded-full overflow-hidden">
                    <div className="h-full bg-[#C9A96E]/40 w-1/3 animate-[loading-bar_1.5s_infinite]" />
                </div>
                <p className="text-[10px] text-[#3D2B1F]/60 font-black uppercase tracking-widest leading-relaxed">
                    Fetching the latest Clarity Score™ and performance analytics.
                </p>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}} />
        </div>
    )
}
