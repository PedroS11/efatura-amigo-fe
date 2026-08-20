import { apiFetchJson } from "./apiFetch";

export type Me = {
    email: string;
    sub: string;
    name?: string;
};

export const getMe = () => apiFetchJson<Me>("/api/me");
