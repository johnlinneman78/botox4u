import Image from 'next/image'

// Ambiance divider photo: one wide image per section break, never one
// per card, never repeated. Matches the redesign preview (Nov 6, 2026):
// the photo represents the section that follows it.
export function DividerPhoto({
    src,
    alt,
    caption,
}: {
    src: string
    alt: string
    caption?: string
}) {
    return (
        <figure className="my-10 md:my-14">
            <div className="relative w-full overflow-hidden rounded-[20px] aspect-[16/9] md:aspect-[21/8]">
                <Image
                    src={src}
                    alt={alt}
                    fill
                    sizes="(max-width: 860px) 100vw, 1180px"
                    className="object-cover"
                    loading="lazy"
                />
            </div>
            {caption && (
                <figcaption className="mt-2.5 text-[13px]" style={{ color: 'var(--color-stone)' }}>
                    {caption}
                </figcaption>
            )}
        </figure>
    )
}
