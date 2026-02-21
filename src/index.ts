import { serve } from "bun";
import { existsSync, statSync } from "fs";
import path from "path";
import { checkAdminPin } from "./lib/auth";
import {
  generateSingleEventICS,
  generateRemainingEventsICS,
  generateAllEventsICS,
  getFilename,
} from "./lib/ics";
import { schedule } from "./data/schedule";

const isProduction = process.env.NODE_ENV === "production";

// In development, use HMR-processed HTML bundle
// In production, we serve pre-built files from dist/
const devIndex = isProduction ? null : (await import("./index.html")).default;

// Helper to create ICS response
function icsResponse(content: string, filename: string): Response {
  return new Response(content, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}

// API route handlers
function handleApiRoute(request: Request): Response | null {
  const url = new URL(request.url);

  // POST /api/admin/verify - Verify admin PIN
  if (url.pathname === "/api/admin/verify" && request.method === "POST") {
    if (checkAdminPin(request)) {
      return Response.json({ success: true });
    }
    return Response.json({ error: "Invalid PIN" }, { status: 401 });
  }

  // GET /api/calendar/all - Download all events
  if (url.pathname === "/api/calendar/all" && request.method === "GET") {
    const ics = generateAllEventsICS();
    return icsResponse(ics, getFilename("all"));
  }

  // GET /api/calendar/remaining - Download remaining events from today
  if (url.pathname === "/api/calendar/remaining" && request.method === "GET") {
    const ics = generateRemainingEventsICS();
    return icsResponse(ics, getFilename("remaining"));
  }

  // GET /api/calendar/:index - Download single event
  const singleMatch = url.pathname.match(/^\/api\/calendar\/(\d+)$/);
  if (singleMatch && request.method === "GET") {
    const index = parseInt(singleMatch[1], 10);
    if (index >= 0 && index < schedule.length) {
      const ics = generateSingleEventICS(index);
      if (ics) {
        return icsResponse(ics, getFilename("single", index));
      }
    }
    return Response.json({ error: "Event not found" }, { status: 404 });
  }

  return null; // Not an API route
}

async function startServer(startPort = parseInt(process.env.PORT || "4008"), maxAttempts = 10) {
  for (let port = startPort; port < startPort + maxAttempts; port++) {
    try {
      const server = serve({
        port,
        routes: {
    // API routes
    "/api/admin/verify": {
      POST: (req: Request) => {
        if (checkAdminPin(req)) {
          return Response.json({ success: true });
        }
        return Response.json({ error: "Invalid PIN" }, { status: 401 });
      },
    },

    "/api/calendar/all": {
      GET: () => icsResponse(generateAllEventsICS(), getFilename("all")),
    },

    "/api/calendar/remaining": {
      GET: () => icsResponse(generateRemainingEventsICS(), getFilename("remaining")),
    },

    "/api/calendar/:index": {
      GET: (req: Request) => {
        const url = new URL(req.url);
        const match = url.pathname.match(/\/api\/calendar\/(\d+)/);
        if (match) {
          const index = parseInt(match[1], 10);
          if (index >= 0 && index < schedule.length) {
            const ics = generateSingleEventICS(index);
            if (ics) {
              return icsResponse(ics, getFilename("single", index));
            }
          }
        }
        return Response.json({ error: "Event not found" }, { status: 404 });
      },
    },

    // Static assets
    "/og-image.svg": new Response(Bun.file("public/og-image.svg"), {
      headers: { "Content-Type": "image/svg+xml" },
    }),
    "/og-image.png": new Response(Bun.file("public/og-image.png"), {
      headers: { "Content-Type": "image/png" },
    }),
    "/favicon.svg": new Response(Bun.file("public/favicon.svg"), {
      headers: { "Content-Type": "image/svg+xml" },
    }),
    "/favicon-option-a.svg": new Response(Bun.file("public/favicon-option-a.svg"), {
      headers: { "Content-Type": "image/svg+xml" },
    }),
    "/favicon-option-b.svg": new Response(Bun.file("public/favicon-option-b.svg"), {
      headers: { "Content-Type": "image/svg+xml" },
    }),
    "/favicon-option-c.svg": new Response(Bun.file("public/favicon-option-c.svg"), {
      headers: { "Content-Type": "image/svg+xml" },
    }),
    "/favicon-option-d.svg": new Response(Bun.file("public/favicon-option-d.svg"), {
      headers: { "Content-Type": "image/svg+xml" },
    }),
    "/favicon-option-e.svg": new Response(Bun.file("public/favicon-option-e.svg"), {
      headers: { "Content-Type": "image/svg+xml" },
    }),
    "/favicon-option-f.svg": new Response(Bun.file("public/favicon-option-f.svg"), {
      headers: { "Content-Type": "image/svg+xml" },
    }),
    "/favicon-option-g.svg": new Response(Bun.file("public/favicon-option-g.svg"), {
      headers: { "Content-Type": "image/svg+xml" },
    }),
    "/favicon-option-h.svg": new Response(Bun.file("public/favicon-option-h.svg"), {
      headers: { "Content-Type": "image/svg+xml" },
    }),

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

      // Handle API routes first
      const apiResponse = handleApiRoute(request);
      if (apiResponse) return apiResponse;

      // Serve static assets from public folder
      if (pathname === "/og-image.svg") {
        return new Response(Bun.file("public/og-image.svg"), {
          headers: { "Content-Type": "image/svg+xml" },
        });
      }
      if (pathname === "/og-image.png") {
        return new Response(Bun.file("public/og-image.png"), {
          headers: { "Content-Type": "image/png" },
        });
      }
      if (pathname === "/favicon.svg" || pathname.startsWith("/favicon-option")) {
        const filename = pathname.slice(1); // Remove leading slash
        return new Response(Bun.file(`public/${filename}`), {
          headers: { "Content-Type": "image/svg+xml" },
        });
      }

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
      return server;
    } catch (error: any) {
      if (error?.code === "EADDRINUSE") {
        console.log(`Port ${port} is in use, trying ${port + 1}...`);
        continue;
      }
      throw error;
    }
  }
  throw new Error(`Failed to start server after ${maxAttempts} attempts`);
}

startServer();
