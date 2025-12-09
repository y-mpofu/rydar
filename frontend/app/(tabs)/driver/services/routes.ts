import api from "./api";

export type Route = {
    routeName: string
}


export type RoutePayload = {
    routeName: string;
};

// routes.ts
export async function getAllRoutes(): Promise<string[]> {
    const res = await api.get<string[]>("/api/v1/drivers/me/routes");
    console.log("routes response:", res.data);
    return res.data;
}



export async function addNewRoute(
    routeName: string,
    destinationLat: number,
    destinationLong: number,
    customComments: string
) {
    const res = await api.post(
        "/api/v1/drivers/me/routes",
        {
            routeName,
            destinationLat,
            destinationLong,
            customComments,
        }
    );

    return res.data;
}

export async function deleteRoute(routeName: string) {
    const res = await api.delete(
        `/api/v1/drivers/me/routes/${routeName}`,
        {
            data: { routeName }
        }
    );

    return res.data;
}

export type UserProfile = {
    username: string;
    firstname: string;
    lastname: string;
    email: string;
};



export async function getProfile(): Promise<UserProfile> {
    const res = await api.get("/api/v1/user/me/profile");

    return res.data as UserProfile;
}