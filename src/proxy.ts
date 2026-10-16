import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ROUTES } from '@/constants/routes';

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = pathname.startsWith(ROUTES.PROJECTS) || pathname.startsWith(ROUTES.DASHBOARD);

  if (isProtected) {
    const authCookie = request.cookies.get('vowify_auth');
    if (!authCookie || !authCookie.value) {
      const loginUrl = new URL(ROUTES.buildLoginUrl(pathname), request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/projects/:path*', '/dashboard/:path*', '/projects', '/dashboard'],
};
