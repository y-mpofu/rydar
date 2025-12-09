// src/services/auth.ts
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";

// Response shape from backend
export type DriverLoginResponse = {
    token: string;
};

const BASE_URL =
    process.env.EXPO_PUBLIC_API_URL || "https://rydar.onrender.com";

// ---- Keys ----
const TOKEN_KEY = "auth._driver_token";

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
export async function getToken() {
    return await getItem(TOKEN_KEY);
}

// export async function getDriverId() {
//     return await getItem(DRIVER_ID_KEY);
// }

export async function isAuthenticated() {
    return !!(await getToken());
}

export async function clearAuth() {
    await deleteItem(TOKEN_KEY);
    // await deleteItem(DRIVER_ID_KEY);
}

// ---- Login Driver ----
export async function loginDriver(
    email: string,
    password: string
): Promise<DriverLoginResponse> {
    const res = await fetch(`${BASE_URL}/api/v1/auth/login/driver`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: email,
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

    const data: DriverLoginResponse = await res.json();

    if (!data.token) {
        throw new Error("No access_token returned from server");
    }

    // Save
    await setItem(TOKEN_KEY, data.token);
    // await setItem(DRIVER_ID_KEY, data.driver_id);

    return data;
}



export async function signupDriver(first_name: string, lastname: string, email: string, password: string) {
    const res = await fetch(`${BASE_URL}/api/v1/auth/register/driver`, {
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
        let msg = `Signup failed (${res.status})`;
        try {
            const data = await res.json();
            msg = data?.detail || data?.message || msg;
        } catch { }
        throw new Error(msg);
    }

    const data: DriverLoginResponse = await res.json();

    if (!data.token) {
        throw new Error("No access_token returned from server");
    }

    // Save
    await setItem(TOKEN_KEY, data.token);

    console.log(res);

    return data;
}

// ---- Logout ----
export async function logout() {
    await clearAuth();
    router.push("/driver");
}

// ---- Authenticated Fetch Wrapper ----
export async function authFetch(
    input: RequestInfo | URL,
    init: RequestInit = {}
) {
    const headers = new Headers(init.headers || {});
    const token = await getToken();

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
            await logout();
        }

        throw new Error(msg);
    }

    const ct = res.headers.get("content-type") || "";
    return ct.includes("application/json") ? res.json() : res.text();
}
