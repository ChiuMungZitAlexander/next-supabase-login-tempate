import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";

import { validateAndRefreshToken } from "@/utils/jwt";

export async function middleware(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const newToken = await validateAndRefreshToken(token);
    cookieStore.set("auth", newToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return NextResponse.next();
  } catch (error) {
    console.error("Invalid token", error);

    cookieStore.delete("auth");

    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
