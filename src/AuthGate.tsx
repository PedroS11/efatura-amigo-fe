import { useCallback, useEffect, useState } from "react";
import Login from "./Login";
import Dashboard from "./Dashboard";
import { Spinner } from "@/components/ui/spinner";
import { getMe } from "@/lib/api/getMe";
import { ApiAuthError } from "@/lib/api/apiFetch";

type AuthState = "loading" | "authenticated" | "unauthenticated";

function clearSession() {
    localStorage.removeItem("idToken");
}

export default function AuthGate() {
    const [authState, setAuthState] = useState<AuthState>("loading");

    const validateSession = useCallback(async () => {
        const token = localStorage.getItem("idToken");

        if (!token) {
            setAuthState("unauthenticated");
            return;
        }

        try {
            await getMe();
            setAuthState("authenticated");
        } catch (error) {
            if (error instanceof ApiAuthError) {
                clearSession();
            }
            setAuthState("unauthenticated");
        }
    }, []);

    useEffect(() => {
        validateSession();
    }, [validateSession]);

    const handleLogin = useCallback(async () => {
        setAuthState("loading");
        await validateSession();
    }, [validateSession]);

    const handleSessionExpired = useCallback(() => {
        clearSession();
        setAuthState("unauthenticated");
    }, []);

    if (authState === "loading") {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <Spinner />
            </main>
        );
    }

    if (authState === "authenticated") {
        return <Dashboard onSessionExpired={handleSessionExpired} />;
    }

    return <Login onLogin={handleLogin} />;
}
