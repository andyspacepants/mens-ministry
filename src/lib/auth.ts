// Simple PIN authentication middleware
export function checkAdminPin(req: Request): boolean {
  const pin = req.headers.get("x-admin-pin");
  return pin === process.env.ADMIN_PIN;
}

export function requireAdminPin(req: Request): Response | null {
  if (!checkAdminPin(req)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
