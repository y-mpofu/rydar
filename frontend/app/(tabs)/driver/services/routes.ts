import api from "./api";
import * as SecureStore from 'expo-secure-store';

// Full route object with all fields
export type DriverRoute = {
    routeName: string;
    destinationLat: number;
    destinationLong: number;
    customComments?: string;
};

const ROUTES_METADATA_KEY = "driver_routes_metadata";
const SELECTED_ROUTE_KEY = "driver_selected_route";

// Helper: Get selected/active route
export async function getSelectedRoute(): Promise<string | null> {
    try {
        return await SecureStore.getItemAsync(SELECTED_ROUTE_KEY);
    } catch (err) {
        console.error("Failed to get selected route:", err);
        return null;
    }
}

// Helper: Set selected/active route
export async function setSelectedRoute(routeName: string | null): Promise<void> {
    try {
        if (routeName === null) {
            await SecureStore.deleteItemAsync(SELECTED_ROUTE_KEY);
        } else {
            await SecureStore.setItemAsync(SELECTED_ROUTE_KEY, routeName);
        }
    } catch (err) {
        console.error("Failed to set selected route:", err);
    }
}

// Helper: Store route metadata locally (comments + coordinates)
async function saveRouteMetadata(route: DriverRoute) {
    try {
        const existing = await getRoutesMetadata();
        existing[route.routeName] = {
            destinationLat: route.destinationLat,
            destinationLong: route.destinationLong,
            customComments: route.customComments
        };
        await SecureStore.setItemAsync(ROUTES_METADATA_KEY, JSON.stringify(existing));
    } catch (err) {
        console.error("Failed to save route metadata:", err);
    }
}

// Helper: Get all stored route metadata
async function getRoutesMetadata(): Promise<Record<string, Partial<DriverRoute>>> {
    try {
        const data = await SecureStore.getItemAsync(ROUTES_METADATA_KEY);
        return data ? JSON.parse(data) : {};
    } catch (err) {
        console.error("Failed to get route metadata:", err);
        return {};
    }
}

// Helper: Delete route metadata locally
async function deleteRouteMetadata(routeName: string) {
    try {
        const existing = await getRoutesMetadata();
        delete existing[routeName];
        await SecureStore.setItemAsync(ROUTES_METADATA_KEY, JSON.stringify(existing));
    } catch (err) {
        console.error("Failed to delete route metadata:", err);
    }
}

// Helper: Update route metadata locally
async function updateRouteMetadata(oldName: string, newRoute: DriverRoute) {
    try {
        const existing = await getRoutesMetadata();
        delete existing[oldName]; // Remove old key
        existing[newRoute.routeName] = {
            destinationLat: newRoute.destinationLat,
            destinationLong: newRoute.destinationLong,
            customComments: newRoute.customComments
        };
        await SecureStore.setItemAsync(ROUTES_METADATA_KEY, JSON.stringify(existing));
    } catch (err) {
        console.error("Failed to update route metadata:", err);
    }
}

// Get all routes with full metadata
export async function getAllRoutes(): Promise<DriverRoute[]> {
    const res = await api.get<string[]>("/api/v1/drivers/me/routes");
    const routeNames = res.data;
    console.log("routes response:", routeNames);
    
    // Get metadata for each route
    const metadata = await getRoutesMetadata();
    
    return routeNames.map(name => ({
        routeName: name,
        destinationLat: metadata[name]?.destinationLat || 0,
        destinationLong: metadata[name]?.destinationLong || 0,
        customComments: metadata[name]?.customComments
    }));
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

    // Save metadata locally
    await saveRouteMetadata({ routeName, destinationLat, destinationLong, customComments });

    return res.data;
}

export async function deleteRoute(routeName: string) {
    const res = await api.delete(
        `/api/v1/drivers/me/routes/${routeName}`,
        {
            data: { routeName }
        }
    );

    // Delete metadata locally
    await deleteRouteMetadata(routeName);

    return res.data;
}

// Update route function
export async function updateRoute(
    oldRouteName: string,
    newRouteName: string,
    destinationLat: number,
    destinationLong: number,
    customComments: string
) {
    const res = await api.put(
        `/api/v1/drivers/me/routes/${oldRouteName}`,
        {
            routeName: newRouteName,
            destinationLat,
            destinationLong,
            customComments,
        }
    );

    // Update metadata locally
    await updateRouteMetadata(oldRouteName, { 
        routeName: newRouteName, 
        destinationLat, 
        destinationLong, 
        customComments 
    });

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

// 👇 DEFAULT EXPORT to fix warning
export default {
    getAllRoutes,
    addNewRoute,
    deleteRoute,
    updateRoute,
    getProfile,
    getSelectedRoute,
    setSelectedRoute,
};