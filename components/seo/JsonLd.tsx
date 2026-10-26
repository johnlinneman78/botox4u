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
    const schema: any = {
        "@context": "https://schema.org",
        "@type": ["MedicalBusiness", "HealthAndBeautyBusiness", "LocalBusiness"],
        "name": provider.name,
        "description": provider.bio || provider.ai_description || `Top-rated aesthetic provider specializing in ${NICHE.name} treatments in ${provider.city}. Ranked by Clarity Score™ independent data.`,
        "image": provider.hero_image_url || provider.imageUrl,
        "telephone": provider.phone,
        "url": `https://www.verifiedaesthetics.com/provider/${provider.slug}`,
        "address": {
            "@type": "PostalAddress",
            "streetAddress": provider.address,
            "addressLocality": provider.city,
            "addressRegion": provider.state,
            "postalCode": provider.zip_code,
            "addressCountry": "US"
        },
        "priceRange": provider.price_per_unit ? `$${provider.price_per_unit}/unit` : "$$",
        "medicalSpecialty": "CosmeticDermatology",
        "currenciesAccepted": "USD",
        "paymentAccepted": "Cash, Credit Card",
    };

    // Geo coordinates for map association + LLM location grounding
    if (provider.lat && provider.lng) {
        schema.geo = {
            "@type": "GeoCoordinates",
            "latitude": provider.lat,
            "longitude": provider.lng
        };
    }

    // Available services as MedicalProcedure — critical for LLM + Google rich snippets
    const services = provider.services_offered || [];
    const serviceMap: Record<string, string> = {
        'Botox': 'Botulinum toxin injection for wrinkle reduction and facial rejuvenation',
        'Dysport': 'Botulinum toxin (abobotulinumtoxinA) for dynamic wrinkle treatment',
        'Xeomin': 'IncobotulinumtoxinA injection for frown lines and facial wrinkles',
        'Daxxify': 'Long-acting neuromodulator (daxibotulinumtoxinA) lasting up to 6 months',
        'Juvederm': 'Hyaluronic acid dermal filler for volume restoration and lip augmentation',
        'Restylane': 'Hyaluronic acid filler for facial contouring and wrinkle treatment',
        'Sculptra': 'Poly-L-lactic acid biostimulator for gradual collagen restoration',
        'Kybella': 'Deoxycholic acid injection for submental fat reduction',
    };
    if (services.length > 0) {
        schema.availableService = services.slice(0, 8).map((svc: string) => ({
            "@type": "MedicalProcedure",
            "name": svc,
            "procedureType": "https://health-lifesci.schema.org/CosmeticProcedure",
            ...(serviceMap[svc] ? { "description": serviceMap[svc] } : {})
        }));
    }

    // sameAs links for knowledge graph — connect provider to external profiles
    const sameAs: string[] = [];
    if (provider.website) sameAs.push(provider.website);
    if (provider.google_maps_url) sameAs.push(provider.google_maps_url);
    if (provider.yelp_url) sameAs.push(provider.yelp_url);
    if (provider.instagram_url) sameAs.push(provider.instagram_url);
    if (provider.booking_url) sameAs.push(provider.booking_url);
    if (sameAs.length > 0) {
        schema.sameAs = sameAs;
    }

    // NPI credential for verified providers
    if (provider.npi_verified && provider.npi_number) {
        schema.hasCredential = {
            "@type": "EducationalOccupationalCredential",
            "credentialCategory": "NPI Registration",
            "recognizedBy": {
                "@type": "GovernmentOrganization",
                "name": "Centers for Medicare & Medicaid Services (CMS)",
                "url": "https://npiregistry.cms.hhs.gov"
            }
        };
    }

    return schema;
};

export const generateReviewSchema = (provider: any) => {
    // Only publish our editorial score when there is one; never a default.
    if (typeof provider.score_total !== 'number') return null
    return {
        "@context": "https://schema.org",
        "@type": "Review",
        "itemReviewed": {
            "@type": "MedicalBusiness",
            "name": provider.name
        },
        "reviewRating": {
            "@type": "Rating",
            "ratingValue": provider.score_total,
            "bestRating": "100"
        },
        "author": {
            "@type": "Organization",
            "name": "VerifiedAesthetics.com"
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
            "item": `https://www.verifiedaesthetics.com${item.item}`
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
            "url": `https://www.verifiedaesthetics.com/provider/${provider.slug}`,
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
        "name": "VerifiedAesthetics",
        "url": "https://www.verifiedaesthetics.com",
        "description": "Find and compare the best Botox injectors near you. Ranked by Clarity Score™ — credentials, injection quality, and patient outcomes.",
        "potentialAction": {
            "@type": "SearchAction",
            "target": "https://www.verifiedaesthetics.com/find-providers?q={search_term_string}",
            "query-input": "required name=search_term_string"
        }
    };
};

export const generateFAQPageSchema = (city: string, state: string, botoxLow: number | null, botoxHigh: number | null, providerCount: number) => {
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": `How much does Botox cost in ${city}, ${state}?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": botoxLow != null && botoxHigh != null
                        ? `Botox in ${city} typically costs $${botoxLow}-$${botoxHigh} per unit based on ${providerCount} indexed providers on VerifiedAesthetics.`
                        : `Botox prices in ${city} are not published yet. Ask clinics for a per-unit quote — clinics set their own prices.`
                }
            },
            {
                "@type": "Question",
                "name": `Who are the top-rated Botox providers in ${city}?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `VerifiedAesthetics ranks ${providerCount} Botox providers in ${city} using Clarity Score™, a data-driven algorithm based on credentials, injection quality, and patient outcomes.`
                }
            }
        ]
    };
};
