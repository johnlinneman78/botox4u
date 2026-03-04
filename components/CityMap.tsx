'use client'

import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'
import { MapPin } from 'lucide-react'
import { CITY_COORDS } from '@/lib/cityCoords'
import { useState, useEffect, useCallback } from 'react'

interface Provider {
    id: string
    name: string
    lat?: number
    lng?: number
    address?: string
}

interface CityMapProps {
    providers: Provider[]
    citySlug: string
    userLat?: number
    userLng?: number
}

const mapContainerStyle = {
    width: '100%',
    height: '500px'
}

export default function CityMap({ providers, citySlug, userLat, userLng }: CityMapProps) {
    const [userPos, setUserPos] = useState<{ lat: number, lng: number } | null>(
        userLat && userLng ? { lat: userLat, lng: userLng } : null
    )
    const [isMounted, setIsMounted] = useState(false)
    const [mapsLoaded, setMapsLoaded] = useState(false)

    useEffect(() => {
        setIsMounted(true)
        if (!userPos && "geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                setUserPos({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                })
            })
        }
    }, [userPos])

    const onLoad = useCallback(() => {
        setMapsLoaded(true)
    }, [])

    if (!isMounted) {
        return (
            <div style={mapContainerStyle} className="bg-surface rounded-2xl animate-pulse flex items-center justify-center border border-border">
                <div className="text-stone font-medium italic">Loading Interactive Map...</div>
            </div>
        )
    }

    // Center on user if available, otherwise city fallback
    const center = {
        lat: userLat || CITY_COORDS[citySlug as keyof typeof CITY_COORDS]?.lat || providers.find(p => !!p.lat)?.lat || 40.7128,
        lng: userLng || CITY_COORDS[citySlug as keyof typeof CITY_COORDS]?.lng || providers.find(p => !!p.lng)?.lng || -74.0060
    }

    const markers = providers
        .filter(p => (p.lat || (p as any).latitude) && (p.lng || (p as any).longitude))
        .map(provider => ({
            id: provider.id,
            position: {
                lat: Number(provider.lat || (provider as any).latitude),
                lng: Number(provider.lng || (provider as any).longitude)
            },
            title: provider.name
        }))

    if (markers.length === 0) return null

    // Build icon objects only after Google Maps is loaded
    const getProviderIcon = () => {
        if (!mapsLoaded || typeof google === 'undefined') return undefined
        return {
            url: 'https://maps.google.com/mapfiles/ms/icons/gold-pushpin.png',
            scaledSize: new google.maps.Size(40, 40)
        }
    }

    const getUserIcon = () => {
        if (!mapsLoaded || typeof google === 'undefined') return undefined
        return {
            url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
            scaledSize: new google.maps.Size(32, 32)
        }
    }

    return (
        <div className="rounded-2xl shadow-md overflow-hidden mb-8 border" style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)' }}>
            <div
                className="p-6"
                style={{ background: 'var(--color-surface)' }}
            >
                <div className="flex items-center">
                    <MapPin className="w-8 h-8 mr-3" style={{ color: 'var(--color-gold)' }} />
                    <div>
                        <h3 className="text-xl font-bold font-display" style={{ color: 'var(--color-espresso)' }}>Providers Near You</h3>
                        <p className="text-sm" style={{ color: 'var(--color-stone)' }}>{markers.length} verified clinics mapped in this area</p>
                    </div>
                </div>
            </div>

            <LoadScript
                googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
                onLoad={onLoad}
            >
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={center}
                    zoom={12}
                    options={{
                        styles: [
                            {
                                featureType: 'poi',
                                elementType: 'labels',
                                stylers: [{ visibility: 'off' }]
                            }
                        ],
                        zoomControl: true,
                        mapTypeControl: false,
                        streetViewControl: true,
                        fullscreenControl: true
                    }}
                >
                    {markers.map(({ id, position, title }) => (
                        <Marker
                            key={id}
                            position={position}
                            title={title}
                            icon={getProviderIcon()}
                        />
                    ))}

                    {userPos && (
                        <Marker
                            position={userPos}
                            title="You are here"
                            icon={getUserIcon()}
                        />
                    )}
                </GoogleMap>
            </LoadScript>
        </div>
    )
}
