import type { User } from "@/lib/api/auth/types.ts";
import { apiFetchJson } from "../apiFetch.ts";

export const login = (token: string) =>
  apiFetchJson<User>("POST", "/api/auth/login", {
    credential: token
  });
