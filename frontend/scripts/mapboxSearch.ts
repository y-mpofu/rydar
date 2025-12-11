import Constants from "expo-constants";

// Get API keys from environment
const MAPBOX_KEY =
    (Constants.expoConfig?.extra as any)?.MAPBOX_KEY ??
    (Constants.manifest as any)?.extra?.MAPBOX_KEY ??
    "";

const GOOGLE_PLACES_KEY =
    (Constants.expoConfig?.extra as any)?.GOOGLE_PLACES_KEY ??
    (Constants.manifest as any)?.extra?.GOOGLE_PLACES_KEY ??
    "";

// Use Google Places if available, otherwise fall back to Mapbox
const USE_GOOGLE_PLACES = !!GOOGLE_PLACES_KEY;

type MapboxFeature = {
    id: string;
    text: string;
    place_name: string;
    center: [number, number]; // [lon, lat]
    distance?: number;
};

type GooglePlacePrediction = {
    place_id: string;
    description: string;
    structured_formatting: {
        main_text: string;
        secondary_text: string;
    };
};

type GooglePlaceDetails = {
    geometry: {
        location: {
            lat: number;
            lng: number;
        };
    };
};

export type PlaceResult = {
    id: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
};

// Google Places Autocomplete
async function searchWithGoogle(
    query: string,
    lon?: number,
    lat?: number
): Promise<PlaceResult[]> {
    const params = new URLSearchParams({
        input: query,
        key: GOOGLE_PLACES_KEY,
        components: "country:us",
        types: "establishment|geocode",
    });

    if (lon != null && lat != null) {
        params.append("location", `${lat},${lon}`);
        params.append("radius", "50000"); // 50km radius
    }

    const autocompleteUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?${params.toString()}`;
    const res = await fetch(autocompleteUrl);
    const data = await res.json();

    if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
        console.warn("Google Places error:", data.status, data.error_message);
        return [];
    }

    const predictions: GooglePlacePrediction[] = data.predictions || [];

    // Get details for each place to get coordinates
    const results = await Promise.all(
        predictions.slice(0, 6).map(async (p) => {
            try {
                const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${p.place_id}&fields=geometry&key=${GOOGLE_PLACES_KEY}`;
                const detailsRes = await fetch(detailsUrl);
                const detailsData = await detailsRes.json();

                if (detailsData.status !== "OK") return null;

                const details: GooglePlaceDetails = detailsData.result;
                return {
                    id: p.place_id,
                    name: p.structured_formatting.main_text,
                    address: p.description,
                    latitude: details.geometry.location.lat,
                    longitude: details.geometry.location.lng,
                };
            } catch {
                return null;
            }
        })
    );

    return results.filter((r): r is PlaceResult => r !== null);
}

// Mapbox Geocoding (improved with better local results)
async function searchWithMapbox(
    query: string,
    lon?: number,
    lat?: number
): Promise<PlaceResult[]> {
    if (!MAPBOX_KEY) {
        console.warn("MAPBOX_KEY missing");
        return [];
    }

    const params = new URLSearchParams({
        autocomplete: "true",
        fuzzy_match: "false", // Disable fuzzy matching to avoid "Sudan" for "usdan"
        limit: "10",
        access_token: MAPBOX_KEY,
        language: "en",
        country: "us",
        types: "poi,address,place,locality,neighborhood",
    });

    if (lon != null && lat != null) {
        params.append("proximity", `${lon},${lat}`);
        // Bounding box ~50km around user to prioritize local results
        const delta = 0.5;
        params.append("bbox", `${lon - delta},${lat - delta},${lon + delta},${lat + delta}`);
    }

    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        query
    )}.json?${params.toString()}`;

    const res = await fetch(url);
    const data = await res.json();

    const features: MapboxFeature[] = data.features || [];

    // Filter: only keep results that actually contain the query text
    const q = query.toLowerCase();
    const filtered = features.filter((f) => 
        f.text.toLowerCase().includes(q) || 
        f.place_name.toLowerCase().includes(q)
    );

    // If filtering removes everything, fall back to original results
    const results = filtered.length > 0 ? filtered : features;

    return results.map((f) => ({
        id: f.id,
        name: f.text,
        address: f.place_name,
        latitude: f.center[1],
        longitude: f.center[0],
    }));
}

// Main export - uses Google if available, falls back to Mapbox
export async function searchPlaces(
    query: string,
    lon?: number,
    lat?: number
): Promise<PlaceResult[]> {
    if (!query || query.length < 2) return [];

    if (USE_GOOGLE_PLACES) {
        console.log("🔍 Using Google Places API");
        try {
            const results = await searchWithGoogle(query, lon, lat);
            if (results.length > 0) return results;
            // Fall back to Mapbox if Google returns nothing
            console.log("🔍 Falling back to Mapbox");
            return searchWithMapbox(query, lon, lat);
        } catch (err) {
            console.log("🔍 Google failed, using Mapbox");
            return searchWithMapbox(query, lon, lat);
        }
    } else {
        console.log("🔍 Using Mapbox Geocoding");
        return searchWithMapbox(query, lon, lat);
    }
}

export type DestinationPayload = {
    routeName: string;
    destinationLat: number;
    destinationLong: number;
    customComments: string;
};
