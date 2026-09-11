import { apiFetchJson } from "../apiFetch.ts";
import type { User } from "@/lib/api/auth/types.ts";

export const login = (token: string) =>
    apiFetchJson<User>("POST", "/api/auth/login", {
        credential: token,
    });
