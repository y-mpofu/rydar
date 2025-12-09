import api from "./api";


export type MyLocationPayload = {
    latitude: number;
    longitude: number;
    currRouteName: string;
    customComments: string;
};

export async function updateLocation(payload: MyLocationPayload) {
    return api.post("/api/v1/drivers/me/location", payload);
}
