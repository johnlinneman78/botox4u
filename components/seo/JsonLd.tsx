
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
    // Determine price range string as requested
    const lowPrice = provider.price_per_unit ? provider.price_per_unit - 2 : 12;
    const highPrice = provider.price_per_unit ? provider.price_per_unit + 2 : 16;
    const priceRange = `$$${lowPrice}–$${highPrice} per unit`;

    return {
        "@context": "https://schema.org",
        "@type": "MedicalBusiness",
        "name": provider.name,
        "address": {
            "@type": "PostalAddress",
            "addressLocality": provider.city,
            "addressRegion": provider.state
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": provider.rating || 4.0,
            "reviewCount": provider.review_count || 1,
            "bestRating": "5"
        },
        "priceRange": priceRange
    };
};

export const generateReviewSchema = (provider: any) => {
    return {
        "@context": "https://schema.org",
        "@type": "Review",
        "itemReviewed": {
            "@type": "MedicalBusiness",
            "name": provider.name
        },
        "reviewRating": {
            "@type": "Rating",
            "ratingValue": provider.score_total || 50,
            "bestRating": "100"
        },
        "author": {
            "@type": "Organization",
            "name": "Botox-4U.com"
        }
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
            "item": `https://www.botox-4u.com${item.item}`
        }))
    };
};

export const generateItemListSchema = (providers: any[], city: string) => {
    return {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": `Top Botox Providers in ${city}`,
        "numberOfItems": providers.length,
        "itemListElement": providers.map((provider, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "url": `https://www.botox-4u.com/provider/${provider.slug}`,
            "name": provider.name
        }))
    };
};

export const generateWebSiteSchema = () => {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Botox-4U.com",
        "url": "https://www.botox-4u.com",
        "potentialAction": {
            "@type": "SearchAction",
            "target": "https://www.botox-4u.com/find-providers?q={search_term_string}",
            "query-input": "required name=search_term_string"
        }
    };
};
