import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Paths that require authentication
const protectedPaths = ["/settings", "/products/sell", "/api/products", "/api/user"]

// Paths that are accessible only for non-authenticated users
const authPaths = ["/auth"]

export async function middleware(request: NextRequest) {
  try {
    const token = request.cookies.get("auth_token")?.value
    const path = request.nextUrl.pathname

    // Simple check if token exists (we'll do full verification in the API routes)
    const isAuthenticated = !!token

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
  } catch (error) {
    console.error("Middleware error:", error)
    // In case of error, allow the request to proceed
    // The API routes will handle authentication properly
    return NextResponse.next()
  }
}

export const config = {
  matcher: ["/settings/:path*", "/products/sell/:path*", "/auth/:path*", "/api/products/:path*", "/api/user/:path*"],
}

