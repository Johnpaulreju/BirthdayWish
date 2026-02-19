import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { BIRTHDAY_DATE } from "@/app/config";

const PROTECTED_PATHS = ["/celebrate", "/memories"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PATHS.some((path) => pathname.startsWith(path));

  if (isProtected) {
    const now = Date.now();
    const target = new Date(BIRTHDAY_DATE).getTime();

    if (now < target) {
      // Not time yet — redirect back to home
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/celebrate/:path*", "/memories/:path*"],
};
