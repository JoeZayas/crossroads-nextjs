import { NextResponse } from "next/server";
import { adminCookieName, supabaseAuthSignIn } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { email, password } = (await request.json()) as { email?: string; password?: string };

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const session = await supabaseAuthSignIn(email, password);

    const response = NextResponse.json({ ok: true, user: session.user });
    response.cookies.set(adminCookieName, session.access_token!, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: session.expires_in!,
    });

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
