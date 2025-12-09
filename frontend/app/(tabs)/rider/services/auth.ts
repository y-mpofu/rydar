// src/services/auth.ts
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";

// Response shape from backend
export type RiderLoginResponse = {
    token: string;
};

const BASE_URL =
    process.env.EXPO_PUBLIC_API_URL || "https://rydar.onrender.com";

// ---- Keys ----
const TOKEN_KEY = "auth.rider_token";

// ---- SecureStore Helpers ----
async function setItem(key: string, value: string) {
    await SecureStore.setItemAsync(key, value);
}
async function getItem(key: string) {
    return await SecureStore.getItemAsync(key);
}
async function deleteItem(key: string) {
    await SecureStore.deleteItemAsync(key);
}

// ---- Public Helpers ----
export async function getRiderToken() {
    return await getItem(TOKEN_KEY);
}

// export async function getDriverId() {
//     return await getItem(DRIVER_ID_KEY);
// }

export async function isAuthenticated() {
    return !!(await getRiderToken());
}

export async function clearAuth() {
    await deleteItem(TOKEN_KEY);
    // await deleteItem(DRIVER_ID_KEY);
}

// ---- Login Driver ----
export async function loginRider(
    email: string,
    password: string
): Promise<RiderLoginResponse> {
    const res = await fetch(`${BASE_URL}/api/v1/auth/login/rider`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email,
            password,
        }),
    });

    if (!res.ok) {
        let msg = `Login failed (${res.status})`;
        try {
            const data = await res.json();
            msg = data?.detail || data?.message || msg;
        } catch { }
        throw new Error(msg);
    }

    const data: RiderLoginResponse = await res.json();

    if (!data.token) {
        throw new Error("No access_token returned from server");
    }

    // Save
    await setItem(TOKEN_KEY, data.token);

    return data;
}


export async function signupRider(first_name: string, lastname: string, email: string, password: string) {
    const res = await fetch(`${BASE_URL}/api/v1/auth/register/rider`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            firstname: first_name,
            lastname,
            email,
            password,
        }),
    });

    if (!res.ok) {
        let msg = `Login failed (${res.status})`;
        try {
            const data = await res.json();
            msg = data?.detail || data?.message || msg;
        } catch { }
        throw new Error(msg);
    }

    const data: RiderLoginResponse = await res.json();

    if (!data.token) {
        throw new Error("No access_token returned from server");
    }

    // Save
    await setItem(TOKEN_KEY, data.token);

    return data;
}
// ---- Logout ----
export async function logoutRider() {
    await clearAuth();
    router.push("/rider");
}

// ---- Authenticated Fetch Wrapper ----
export async function authFetch(
    input: RequestInfo | URL,
    init: RequestInit = {}
) {
    const headers = new Headers(init.headers || {});
    const token = await getRiderToken();

    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
    }

    const res = await fetch(input, {
        ...init,
        headers,
    });

    if (!res.ok) {
        let msg = `Request failed (${res.status})`;

        try {
            const data = await res.json();
            msg = data?.detail || data?.message || msg;
        } catch { }

        // If unauthorized → force logout
        if (res.status === 401 || res.status === 403) {
            await logoutRider();
        }

        throw new Error(msg);
    }

    const ct = res.headers.get("content-type") || "";
    return ct.includes("application/json") ? res.json() : res.text();
}
