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

const server = serve({
  port: parseInt(process.env.PORT || "5003"),
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
