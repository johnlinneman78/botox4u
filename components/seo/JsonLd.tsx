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
    return {
        "@context": "https://schema.org",
        "@type": "MedicalBusiness",
        "name": provider.name,
        "description": provider.bio || `Top-rated aesthetic provider specializing in ${NICHE.name} treatments in ${provider.city}.`,
        "image": provider.hero_image_url || provider.imageUrl,
        "telephone": provider.phone,
        "url": `https://www.injectorindex.com/provider/${provider.slug}`,
        "address": {
            "@type": "PostalAddress",
            "streetAddress": provider.address,
            "addressLocality": provider.city,
            "addressRegion": provider.state,
            "addressCountry": "US"
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": (provider.score_total / 10).toFixed(1),
            "bestRating": "10",
            "ratingCount": provider.review_count || 1
        },
        "priceRange": provider.price_per_unit ? `$${provider.price_per_unit}` : "$$",
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
        "name": "InjectorIndex",
        "url": "https://www.injectorindex.com",
        "description": "Find and compare the best Botox injectors near you. Ranked by TrueScore™ — credentials, injection quality, and patient outcomes.",
        "potentialAction": {
            "@type": "SearchAction",
            "target": "https://www.injectorindex.com/find-providers?q={search_term_string}",
            "query-input": "required name=search_term_string"
        }
    };
};

export const generateFAQPageSchema = (city: string, state: string, botoxLow: number, botoxHigh: number, providerCount: number) => {
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": `How much does Botox cost in ${city}, ${state}?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `Botox in ${city} typically costs $${botoxLow}-$${botoxHigh} per unit based on ${providerCount} indexed providers on InjectorIndex.`
                }
            },
            {
                "@type": "Question",
                "name": `Who are the top-rated Botox providers in ${city}?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `InjectorIndex ranks ${providerCount} Botox providers in ${city} using TrueScore™, a data-driven algorithm based on credentials, injection quality, and patient outcomes.`
                }
            }
        ]
    };
};
