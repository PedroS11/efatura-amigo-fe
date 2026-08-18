import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Login from "./Login.tsx";
import "./index.css";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Dashboard from "./Dashboard.tsx";
import { Toaster } from "@/components/ui/sonner"

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <GoogleOAuthProvider clientId={clientId}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                </Routes>
            </BrowserRouter>
            <Toaster />
        </GoogleOAuthProvider>
    </React.StrictMode>
);