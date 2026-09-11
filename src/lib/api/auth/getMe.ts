import { apiFetchJson } from "../apiFetch.ts";
import type { User } from "@/lib/api/auth/types.ts";

export const getMe = () => apiFetchJson<User>("GET", "/api/auth/me");
