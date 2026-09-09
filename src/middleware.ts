import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // Allow seamless access on local development so you can test immediately
  const isLocalhost = req.nextUrl.hostname === 'localhost' || req.nextUrl.hostname === '127.0.0.1';
  if (isLocalhost && process.env.NODE_ENV === 'development') {
    return NextResponse.next();
  }

  const basicAuth = req.headers.get('authorization');

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1];
    if (authValue) {
      try {
        const decoded = atob(authValue);
        const colonIndex = decoded.indexOf(':');
        const user = colonIndex !== -1 ? decoded.substring(0, colonIndex) : decoded;
        const pwd = colonIndex !== -1 ? decoded.substring(colonIndex + 1) : '';

        if (user === 'izzaham' && pwd === 'azrul') {
          return NextResponse.next();
        }
      } catch {
        // invalid base64 encoding
      }
    }
  }

  return new NextResponse('Access Denied. Please provide valid credentials.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="BasKita Secure Access"',
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
