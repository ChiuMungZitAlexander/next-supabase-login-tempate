import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { Center } from "@/components/layout/center";

import { LoginPanel } from "./components/login-panel";

export const metadata: Metadata = {
  title: "Next Supabase Login Template | Login",
};

export default async function Login() {
  const cookieStore = await cookies();

  const token = cookieStore.get("auth")?.value;

  if (token) {
    return redirect("/dashboard");
  }

  return (
    <div className="min-h-screen h-screen">
      <Center>
        <LoginPanel />
      </Center>
    </div>
  );
}
