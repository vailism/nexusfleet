import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next-auth/next";

export default withAuth(
  function middleware(req) {
    // If the user is logged in but tries to access the login page, redirect to dashboard
    if (req.nextUrl.pathname.startsWith("/login")) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // If the path is login, let them through
        if (req.nextUrl.pathname.startsWith("/login")) {
          return true;
        }
        // Require a token for all other paths
        return !!token;
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth endpoints)
     * - api/uploadthing (upload endpoints)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    "/((?!api/auth|api/uploadthing|_next/static|_next/image|favicon.ico|.*\\.svg$).*)",
  ],
};
