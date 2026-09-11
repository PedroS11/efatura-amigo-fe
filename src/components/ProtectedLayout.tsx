import { useCallback, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Footer from "@/components/Footer.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";
import Login from "@/Login.tsx";
import { getMe } from "@/lib/api/auth/getMe.ts";
import { login } from "@/lib/api/auth/login.ts";
import { logout } from "@/lib/api/auth/logout.ts";
import { useAuth } from "@/store";
import Header from "./Header";

export default function ProtectedLayout() {
  const user = useAuth(state => state.user);
  const isLoading = useAuth(state => state.isLoading);
  const setUser = useAuth(state => state.setUser);
  const setIsLoading = useAuth(state => state.setIsLoading);

  const [logoutLoading, setLogoutLoading] = useState(false);

  const validateSession = useCallback(async () => {
    try {
      const me = await getMe();
      setUser(me);

      setIsLoading(false);
    } catch (error) {
      console.log("Authentication failed", error);
      setUser(undefined);
      setIsLoading(false);
    }
  }, [setUser, setIsLoading]);

  useEffect(() => {
    validateSession();
  }, [validateSession]);

  const handleLogin = useCallback(
    async (credential: string) => {
      setIsLoading(true);
      try {
        await login(credential);
        await validateSession();
      } catch (error) {
        console.log("Login failed", error);
        setUser(undefined);

        setIsLoading(false);
      }
    },
    [validateSession, setUser, setIsLoading]
  );

  const handleLogout = useCallback(async () => {
    setLogoutLoading(true);
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setLogoutLoading(false);
      setUser(undefined);

      setIsLoading(false);
    }
  }, [setUser, setIsLoading]);

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Spinner />
      </main>
    );
  }

  // If not logged in, redirect them to the login page
  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  // If logged in, render the Header, then the specific page content
  return (
    <div className="min-h-screen flex flex-col">
      <Header onLogout={handleLogout} logoutLoading={logoutLoading} name={user!.name} />
      <main className="flex-1 flex">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
