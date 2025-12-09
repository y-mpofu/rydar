import api from "./api";

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