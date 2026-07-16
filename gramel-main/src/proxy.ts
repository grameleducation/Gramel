import { type NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function proxy(request: NextRequest) {
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
  if (sessionCookie && restrictedAuthPages.includes(request.nextUrl.pathname)) {
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
  const path = request.nextUrl.pathname;
  const isProtected = protectedPrefixes.some(
    (p) => path === p || path.startsWith(`${p}/`),
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
