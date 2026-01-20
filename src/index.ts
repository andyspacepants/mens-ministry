import { serve } from "bun";
import { existsSync, statSync } from "fs";
import path from "path";

const isProduction = process.env.NODE_ENV === "production";

// In development, use HMR-processed HTML bundle
// In production, we serve pre-built files from dist/
const devIndex = isProduction ? null : (await import("./index.html")).default;

const server = serve({
  port: parseInt(process.env.PORT || "5003"),
  routes: {
    // API routes will go here (ICS calendar, admin, etc.)

    // In development, serve HMR-processed index for all routes
    ...(!isProduction && {
      "/*": devIndex,
    }),
  },

  // Production: serve static files from dist/, fallback to index.html
  ...(isProduction && {
    fetch(request: Request) {
      const url = new URL(request.url);
      const pathname = url.pathname;

      // Try to serve static file from dist/ (skip root path)
      if (pathname !== "/") {
        const filePath = path.join("dist", pathname);
        try {
          if (existsSync(filePath) && statSync(filePath).isFile()) {
            return new Response(Bun.file(filePath));
          }
        } catch {
          // Fall through to index.html
        }
      }

      // Serve index.html for SPA routing
      return new Response(Bun.file("dist/index.html"));
    },
  }),

  development: !isProduction && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
