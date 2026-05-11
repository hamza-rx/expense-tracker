import { auth } from "@/auth";

export default auth((req) => {
  const { nextUrl } = req;
  const isAuthenticated = !!req.auth;

  const isDashboard = nextUrl.pathname.startsWith('/dashboard');
  const isAuthPage = nextUrl.pathname.startsWith('/login') || nextUrl.pathname.startsWith('/signup');

  if (isAuthPage && isAuthenticated) {
    return Response.redirect(new URL("/dashboard", nextUrl.origin));
  }

  if (isDashboard && !isAuthenticated) {
    return Response.redirect(new URL("/login", nextUrl.origin));
  }
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};