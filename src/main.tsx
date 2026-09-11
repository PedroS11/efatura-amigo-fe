import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import ProtectedLayout from "@/components/ProtectedLayout.tsx";
import Dashboard from "@/Dashboard.tsx";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <GoogleOAuthProvider clientId={clientId}>
            <BrowserRouter>
                <Routes>
                    <Route element={<ProtectedLayout />}>
                        <Route path="/" element={<Dashboard />} />
                        {/* Header applies here automatically! */}
                    </Route>
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
            <Toaster />
        </GoogleOAuthProvider>
    </React.StrictMode>
);
