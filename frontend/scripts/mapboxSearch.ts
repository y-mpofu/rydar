import Constants from "expo-constants";

const MAPBOX_KEY =
    (Constants.expoConfig?.extra as any)?.MAPBOX_KEY ??
    (Constants.manifest as any)?.extra?.MAPBOX_KEY ??
    "";

type MapboxFeature = {
    id: string;
    text: string;
    place_name: string;
    center: [number, number]; // [lon, lat]
    distance?: number;
};

export type PlaceResult = {
    id: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
};

export async function searchPlaces(
    query: string,
    lon?: number,
    lat?: number
): Promise<PlaceResult[]> {
    if (!query || query.length < 2) return [];
    if (!MAPBOX_KEY) {
        console.warn("MAPBOX_KEY missing");
        return [];
    }

    const params = new URLSearchParams({
        autocomplete: "true",
        limit: "8",
        access_token: MAPBOX_KEY,
        language: "en",
        country: "us",
        types: "poi,address,place,locality,neighborhood",
    });

    if (lon != null && lat != null) {
        params.append("proximity", `${lon},${lat}`);
    }

    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        query
    )}.json?${params.toString()}`;

    const res = await fetch(url);
    const data = await res.json();

    const features: MapboxFeature[] = data.features || [];

    // if any features explicitly contain the query text,
    // prefer those over fuzzy stuff like "Sudan"
    const q = query.toLowerCase();
    const prioritized = features.sort((a, b) => {
        const aExact = a.text.toLowerCase().includes(q) ? 1 : 0;
        const bExact = b.text.toLowerCase().includes(q) ? 1 : 0;

        if (aExact !== bExact) return bExact - aExact; // exact-ish matches first

        // then fallback to Mapbox's own score / distance if present
        return 0;
    });

    return prioritized.map((f) => ({
        id: f.id,
        name: f.text,
        address: f.place_name,
        latitude: f.center[1],
        longitude: f.center[0],
    }));
}

export type DestinationPayload = {
    routeName: string;
    destinationLat: number;
    destinationLong: number;
    customComments: string;
};
