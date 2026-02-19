
import React from 'react';

interface JsonLdProps {
    data: any;
}

export const JsonLd: React.FC<JsonLdProps> = ({ data }) => {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
};

export const generateMedicalClinicSchema = (provider: any) => {
    return {
        "@context": "https://schema.org",
        "@type": "MedicalClinic",
        "name": provider.name,
        "description": provider.description || `Botox and aesthetic treatments at ${provider.name} in ${provider.city}, ${provider.state}.`,
        "url": `https://botox-4u.com/provider/${provider.slug}`,
        "telephone": provider.phone,
        "address": {
            "@type": "PostalAddress",
            "streetAddress": provider.address,
            "addressLocality": provider.city,
            "addressRegion": provider.state,
            "postalCode": provider.zip,
            "addressCountry": "US"
        },
        "aggregateRating": provider.rating ? {
            "@type": "AggregateRating",
            "ratingValue": provider.rating,
            "reviewCount": provider.review_count || 1
        } : undefined,
        "priceRange": provider.price_per_unit ? `$$` : "$",
        "image": provider.image_url || "https://botox-4u.com/og-image.jpg"
    };
};

export const generateBreadcrumbSchema = (items: { name: string; item: string }[]) => {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": `https://botox-4u.com${item.item}`
        }))
    };
};
