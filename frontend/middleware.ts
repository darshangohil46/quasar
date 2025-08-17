import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ALLROUTER } from "./lib/utils";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const url = request.nextUrl.clone();

  if (token) {
    try {
      const res = await fetch(
        `${process.env.BACKEND_API_URL}/api/accounts/auth`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (res.ok && data.message) {
        // Allow access to /chat and other protected routes
        if (
          url.pathname === ALLROUTER.LOGIN ||
          url.pathname === ALLROUTER.REGISTER
        ) {
          url.pathname = ALLROUTER.HOME;
          return NextResponse.redirect(url);
        }
        console.log("====================================");
        console.log(url.pathname);
        console.log("====================================");
        return NextResponse.next();
      } else {
        url.pathname = ALLROUTER.LOGIN;
        return NextResponse.redirect(url);
      }
    } catch (error) {
      console.error("Middleware auth error:", error);
      url.pathname = ALLROUTER.LOGIN;
      return NextResponse.redirect(url);
    }
  } else {
    // No token → allow only login/register
    if (
      url.pathname !== ALLROUTER.LOGIN &&
      url.pathname !== ALLROUTER.REGISTER
    ) {
      url.pathname = ALLROUTER.LOGIN;
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/chat/:path*",
    "/dashboard/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/login",
    "/register",
    "/",
  ],
};
