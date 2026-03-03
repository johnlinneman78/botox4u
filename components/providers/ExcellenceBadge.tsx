
import React from 'react';
import { Award } from 'lucide-react';

interface ExcellenceBadgeProps {
    year: number;
    city: string;
    rank?: number;
}

export const ExcellenceBadge: React.FC<ExcellenceBadgeProps> = ({ year, city, rank }) => {
    return (
        <div className="inline-flex flex-col items-center justify-center p-4 bg-white border-2 border-[#C9A96E] rounded-full w-32 h-32 shadow-xl text-center">
            <Award className="w-6 h-6 text-[#C9A96E] mb-1" />
            <div className="text-[10px] font-black uppercase tracking-tighter text-[#3D2B1F]/70">Injector Index Choice</div>
            <div className="text-sm font-black text-gray-900 leading-tight">
                {rank ? `Top ${rank}` : 'Excellence'}
            </div>
            <div className="text-[10px] font-bold text-[#C9A96E] uppercase">{city}</div>
            <div className="text-[10px] font-black text-gray-900 mt-1">{year}</div>
        </div>
    );
};
