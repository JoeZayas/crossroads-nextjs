import { NextResponse, type NextRequest } from "next/server";
import { adminCookieName } from "@/lib/supabase";

const isPublicAdminPath = (pathname: string) => pathname === "/admin/login";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminPath = pathname.startsWith("/admin");
  const isAdminApiPath = pathname.startsWith("/api/admin");

  if (!isAdminPath && !isAdminApiPath) {
    return NextResponse.next();
  }

  if (pathname === "/api/admin/login" || pathname === "/api/admin/logout" || isPublicAdminPath(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(adminCookieName)?.value;
  if (token) {
    return NextResponse.next();
  }

  if (isAdminApiPath) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
