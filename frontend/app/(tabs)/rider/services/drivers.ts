import api from "./api"

export type NearbyDriver = {
    userId: string;
    latitude: number;
    longitude: number;
    currRouteName: string;
    customComments: string;
};

export type DriversNearbyResponse = {
    nearbyDrivers: NearbyDriver[];
};

export async function driversNearby(
    latitude: number,
    longitude: number,
    radiusMeters: number = 1000,
    limit: number = 20,
    destinationName?: string
): Promise<DriversNearbyResponse> {
    const params: Record<string, any> = {
        latitude,
        longitude,
        radiusMeters,
        limit,
    };

    if (destinationName) {
        params.destinationName = destinationName;
    }

    const res = await api.get("/api/v1/drivers/nearby", { params });

    return res.data as DriversNearbyResponse;
}
