import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "node:crypto";
import * as jose from "jose";

import { createClient } from "@/libs/supabase/server";

function hashPassword(password: string, salt: string) {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, "sha256").toString("hex");
}

export async function POST(request: Request) {
  const { username, password } = await request.json();

  const supabase = await createClient();

  const { data } = await supabase
    .from("users")
    .select()
    .eq("username", username);
  const user = data?.[0];

  if (!user) {
    return NextResponse.json(
      { error: "User is not existed." },
      { status: 401 }
    );
  }

  const isPasswordValid =
    hashPassword(password, user.salt) === user.password_hash;
  if (!isPasswordValid) {
    return NextResponse.json(
      { error: "Password is not correct" },
      { status: 401 }
    );
  }

  const token = await new jose.SignJWT({
    username,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("30d")
    .sign(new TextEncoder().encode(process.env.JWT_SECRET_KEY!));

  const cookieStore = await cookies();
  cookieStore.set("auth", token, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return NextResponse.json({ success: true });
}
