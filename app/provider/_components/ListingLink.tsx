import Link from 'next/link'
import { ExternalLink } from 'lucide-react'

export default function ListingLink({ slug }: { slug: string }) {
    return (
        <Link
            href={`/provider/${slug}`}
            className="flex items-center justify-center gap-3 w-full border border-[#3D2B1F]/10 hover:bg-[#3D2B1F]/5 text-[#3D2B1F] rounded-2xl py-5 px-6 text-[10px] font-black uppercase tracking-[0.2em] transition-all group"
        >
            View Your Public Listing <ExternalLink className="w-4 h-4 text-[#3D2B1F]/60 group-hover:text-[#3D2B1F]" />
        </Link>
    )
}
