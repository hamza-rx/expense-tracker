import { auth } from "@/auth";

export default auth((req) => {
  const isDashboard = req.nextUrl.pathname.startsWith('/dashboard');
  if (isDashboard && !req.auth) {
    const newUrl = new URL("/login", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};