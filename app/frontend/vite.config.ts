import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

let port: number | undefined;
if (process.env["PORT"]) {
  port = Number(process.env["PORT"]);
  if (isNaN(port)) {
    console.warn(`Invalid PORT environment variable: ${process.env["PORT"]}`);
    port = undefined;
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // Please make sure that '@tanstack/router-plugin' is passed before '@vitejs/plugin-react'
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5173,
    allowedHosts: ["localhost"],
    host: "0.0.0.0",
    // Prevent stale connections in dev containers / port forwarding.
    // Browsers reuse HTTP/2 connections across reloads; if the tunnel
    // drops, requests queue on a dead socket. These headers tell the
    // browser to close idle connections sooner.
    headers: {
      Connection: "close",
    },
  },
  preview: {
    port: port ?? 4173,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
