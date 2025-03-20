import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "./lib/auth"

// Paths that require authentication
const protectedPaths = ["/settings", "/products/sell", "/api/products", "/api/user"]

// Paths that are accessible only for non-authenticated users
const authPaths = ["/auth"]

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value
  const isAuthenticated = token && (await verifyToken(token))
  const path = request.nextUrl.pathname

  // Check if the path is protected and user is not authenticated
  const isProtectedPath = protectedPaths.some(
    (protectedPath) => path === protectedPath || path.startsWith(`${protectedPath}/`),
  )

  if (isProtectedPath && !isAuthenticated) {
    const url = new URL("/auth", request.url)
    url.searchParams.set("callbackUrl", encodeURI(request.nextUrl.pathname))
    return NextResponse.redirect(url)
  }

  // Check if the path is for non-authenticated users and user is authenticated
  const isAuthPath = authPaths.some((authPath) => path === authPath || path.startsWith(`${authPath}/`))

  if (isAuthPath && isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/settings/:path*", "/products/sell/:path*", "/auth/:path*", "/api/products/:path*", "/api/user/:path*"],
}

