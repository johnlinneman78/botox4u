import React from 'react';
import { NICHE } from '@/config/niche';

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
    const priceRange = `$${lowPrice}-$${highPrice} per unit`;

    return {
        "@context": "https://schema.org",
        "@type": ["MedicalBusiness", "LocalBusiness"],
        "name": provider.name,
        "image": provider.imageUrl || provider.hero_image_url,
        "telephone": provider.phone,
        "url": `https://www.injectorindex.com/provider/${provider.slug}`,
        "address": {
            "@type": "PostalAddress",
            "streetAddress": provider.address,
            "addressLocality": provider.city,
            "addressRegion": provider.state,
            "addressCountry": "US"
        },
        "geo": provider.latitude ? {
            "@type": "GeoCoordinates",
            "latitude": provider.latitude,
            "longitude": provider.longitude
        } : undefined,
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": parseFloat(provider.averageRating || provider.rating || 4.0),
            "reviewCount": parseInt(provider.reviewCount || provider.review_count || 1),
            "bestRating": "5"
        },
        "priceRange": priceRange,
        "medicalSpecialty": "CosmeticDermatology"
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
            "name": "InjectorIndex.com"
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
            "item": `https://www.injectorindex.com${item.item}`
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
            "url": `https://www.injectorindex.com/provider/${provider.slug}`,
            "name": provider.name
        }))
    };
};

export const generatePriceSpecificationSchema = (minPrice: number, maxPrice: number, unit: string = "unit") => {
    return {
        "@context": "https://schema.org",
        "@type": "PriceSpecification",
        "minPrice": minPrice,
        "maxPrice": maxPrice,
        "priceCurrency": "USD",
        "valueAddedTaxIncluded": "false",
        "description": `Estimated ${NICHE.name} cost per ${unit} based on 2026 market data.`
    };
};

export const generateWebSiteSchema = () => {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "InjectorIndex.com",
        "url": "https://www.injectorindex.com",
        "potentialAction": {
            "@type": "SearchAction",
            "target": "https://www.injectorindex.com/find-providers?q={search_term_string}",
            "query-input": "required name=search_term_string"
        }
    };
};
