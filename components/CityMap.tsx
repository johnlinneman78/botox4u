'use client'

import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'
import { MapPin } from 'lucide-react'
import { CITY_COORDS } from '@/lib/cityCoords'

interface Provider {
    id: string
    name: string
    lat?: number
    lng?: number
    address?: string
}

interface CityMapProps {
    providers: Provider[]
    citySlug: string // Now uses citySlug for fallback coords
}

const mapContainerStyle = {
    width: '100%',
    height: '500px'
}

export default function CityMap({ providers, citySlug }: CityMapProps) {
    // Optimized: Use fallback coords from lib/cityCoords.ts (Zero API cost for geocoding city)
    const center = {
        lat: CITY_COORDS[citySlug as keyof typeof CITY_COORDS]?.lat || providers.find(p => p.lat)?.lat || 40.7128,
        lng: CITY_COORDS[citySlug as keyof typeof CITY_COORDS]?.lng || providers.find(p => p.lng)?.lng || -74.0060
    }

    const markers = providers
        .filter(p => p.lat && p.lng) // Only show geocoded providers
        .map(provider => ({
            id: provider.id,
            position: { lat: provider.lat!, lng: provider.lng! },
            title: provider.name
        }))

    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 border border-gray-100">
            <div className="bg-[#1a2332] p-6 text-white bg-gradient-to-r from-[#1a2332] to-[#1e2b3e]">
                <div className="flex items-center">
                    <MapPin className="w-8 h-8 mr-3 text-[#d4af37]" />
                    <div>
                        <h3 className="text-xl font-bold font-display">Providers Near You</h3>
                        <p className="text-gray-300 text-sm">{markers.length} verified clinics mapped in this area</p>
                    </div>
                </div>
            </div>

            <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
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
                            icon={{
                                url: '/pin-gold.svg', // Use the custom SVG gold pin
                                scaledSize: new google.maps.Size(40, 50),
                                anchor: new google.maps.Point(20, 50)
                            }}
                        />
                    ))}
                </GoogleMap>
            </LoadScript>
        </div>
    )
}
