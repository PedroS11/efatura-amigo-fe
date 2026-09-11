import type { User } from "@/lib/api/auth/types.ts";
import { apiFetchJson } from "../apiFetch.ts";

export const getMe = () => apiFetchJson<User>("GET", "/api/auth/me");
