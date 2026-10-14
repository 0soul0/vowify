import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = pathname.startsWith('/projects') || pathname.startsWith('/dashboard');

  if (isProtected) {
    const authCookie = request.cookies.get('vowify_auth');
    if (!authCookie || !authCookie.value) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/projects/:path*', '/dashboard/:path*', '/projects', '/dashboard'],
};
