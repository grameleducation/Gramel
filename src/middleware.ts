import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const pathname = request.nextUrl.pathname;

  // If on assist subdomain, redirect root and paths to /assist equivalents
  if (hostname.includes("assist.grameleducation.com")) {
    // Map requests to /assist paths
    if (pathname === "/" || pathname === "") {
      return NextResponse.rewrite(new URL("/assist", request.url));
    }
    if (pathname.startsWith("/assist")) {
      return NextResponse.next();
    }
    if (pathname.startsWith("/editor")) {
      return NextResponse.next();
    }
    // For other paths on assist subdomain, rewrite to /assist equivalent
    if (!pathname.startsWith("/api") && !pathname.startsWith("/_next")) {
      return NextResponse.rewrite(
        new URL(`/assist${pathname}`, request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
