import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const isAuthenticated = !!token

  // Paths that require authentication
  const authPaths = ["/dashboard"]

  // Check if the current path requires authentication
  const isAuthPath = authPaths.some(
    (path) => request.nextUrl.pathname === path || request.nextUrl.pathname.startsWith(`${path}/`),
  )

  // Redirect unauthenticated users trying to access protected routes
  if (isAuthPath && !isAuthenticated) {
    const redirectUrl = new URL("/", request.url)
    redirectUrl.searchParams.set("callbackUrl", request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return NextResponse.next()
}

// Only run middleware on matching paths
export const config = {
  matcher: ["/dashboard/:path*"],
}
