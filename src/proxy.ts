import { NextResponse } from "next/server";
import { auth } from "@/auth";

export const proxy = auth((req) => {
  const { pathname } = req.nextUrl;
  const isAuthPage = pathname === "/login" || pathname === "/register";

  if (req.auth && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl.origin));
  }
  if (!req.auth && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", req.nextUrl.origin));
  }
});

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};