import { useCallback, useEffect, useState } from "react";
import Login from "./Login";
import Dashboard from "./Dashboard";
import { Spinner } from "@/components/ui/spinner";
import { getMe } from "@/lib/api/auth/getMe.ts";
import { login } from "@/lib/api/auth/login.ts";
import { logout } from "@/lib/api/auth/logout.ts";
import type { User } from "@/lib/api/auth/types.ts";

type AuthState = "loading" | "authenticated" | "unauthenticated";

export default function AuthGate() {
    const [authState, setAuthState] = useState<AuthState>("loading");
    const [user, setUser] = useState<User | null>(null);
    const [logoutLoading, setLogoutLoading] = useState(false);

    const validateSession = useCallback(async () => {
        try {
            const me = await getMe();
            setUser(me);
            setAuthState("authenticated");
        } catch (error) {
            console.log("Authentication failed", error);
            setUser(null);
            setAuthState("unauthenticated");
        }
    }, []);

    useEffect(() => {
        validateSession();
    }, [validateSession]);

    const handleLogin = useCallback(
        async (credential: string) => {
            setAuthState("loading");
            try {
                await login(credential);
                await validateSession();
            } catch (error) {
                console.log("Login failed", error);
                setUser(null);
                setAuthState("unauthenticated");
            }
        },
        [validateSession]
    );

    const handleSessionExpired = useCallback(() => {
        setUser(null);
        setAuthState("unauthenticated");
    }, []);

    const handleLogout = useCallback(async () => {
        setLogoutLoading(true);
        try {
            await logout();
        } catch (error) {
            console.error("Logout failed", error);
        } finally {
            setLogoutLoading(false);
            setUser(null);
            setAuthState("unauthenticated");
        }
    }, []);

    if (authState === "loading") {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <Spinner />
            </main>
        );
    }

    if (authState === "authenticated" && user) {
        return (
            <Dashboard
                user={user}
                onLogout={handleLogout}
                logoutLoading={logoutLoading}
                onSessionExpired={handleSessionExpired}
            />
        );
    }

    return <Login onLogin={handleLogin} />;
}
