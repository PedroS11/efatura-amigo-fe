import { apiFetchJson } from "../apiFetch.ts";
import type { User } from "@/lib/api/auth/types.ts";

export const logout = () => apiFetchJson<User>("POST", "/api/auth/logout", {});
