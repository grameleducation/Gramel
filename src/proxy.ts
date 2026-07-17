import { type NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function proxy(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const pathname = request.nextUrl.pathname;

  // The assist subdomain serves /assist as its own site. This must run in
  // middleware rather than a vercel.json rewrite: "/" is statically
  // prerendered, and Vercel's edge resolves the exact static asset for "/"
  // before evaluating vercel.json rewrites for that same path, so a
  // config-level rewrite of "/" never actually fires. Middleware runs
  // inside the Next.js request pipeline before that static lookup, so it
  // takes effect correctly.
  if (hostname.includes("assist.grameleducation.com")) {
    if (pathname === "/") {
      return NextResponse.rewrite(new URL("/assist", request.url));
    }
    if (
      !pathname.startsWith("/assist") &&
      !pathname.startsWith("/editor") &&
      !pathname.startsWith("/api")
    ) {
      return NextResponse.rewrite(new URL(`/assist${pathname}`, request.url));
    }
    return NextResponse.next({ request });
  }

  // Optimistically redirect users.
  // Not fully secure but fast. Additional auth checks in each page/route
  const sessionCookie = getSessionCookie(request);

  // Already logged-in users should not be able to access these pages
  const restrictedAuthPages = [
    "/login",
    "/signup",
    "/forgot-password",
    "/update-password",
  ];
  if (sessionCookie && restrictedAuthPages.includes(pathname)) {
    const url = new URL("/", request.url);
    const redirectResponse = NextResponse.redirect(url); // redirect to home page
    // Copy all cookies request to the redirect response
    request.cookies.getAll().forEach(({ name, value, ...options }) => {
      redirectResponse.cookies.set(name, value, options);
    });
    return redirectResponse;
  }

  // Only gate paths that are actually login-protected. Everything else
  // (including nonexistent/mistyped URLs) falls through to Next.js, which
  // renders the real 404 page instead of a misleading login redirect.
  const protectedPrefixes = ["/dashboard", "/student-profile", "/programs"];
  const isProtected = protectedPrefixes.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
  if (!sessionCookie && isProtected) {
    const url = new URL("/login", request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next({ request });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|avif|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
