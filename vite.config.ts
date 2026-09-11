import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");

    return {
        plugins: [react(), tailwindcss(), basicSsl()],
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "./src"),
            },
        },
        server: {
            proxy: env.VITE_API_PROXY_TARGET
                ? {
                      "/api": {
                          target: env.VITE_API_PROXY_TARGET,
                          changeOrigin: true,
                          secure: true,
                          // configure: (proxy) => {
                          //     proxy.on("proxyRes", (proxyRes) => {
                          //         const cookies = proxyRes.headers["set-cookie"];
                          //         if (!cookies) return;
                          //
                          //         // __Host-session requires Secure — do not strip it.
                          //         proxyRes.headers["set-cookie"] = cookies.map(
                          //             (cookie) =>
                          //                 cookie.replace(
                          //                     /;\s*Domain=[^;]+/gi,
                          //                     ""
                          //                 )
                          //         );
                          //     });
                          // },
                      },
                  }
                : undefined,
        },
    };
});
