import type { User } from "@/lib/api/auth/types.ts";
import { apiFetchJson } from "../apiFetch.ts";

export const logout = () => apiFetchJson<User>("POST", "/api/auth/logout", {});
