import { cookies } from "next/headers";
import { adminCookieName } from "@/lib/supabase";

export async function getAdminAccessToken() {
  const cookieStore = await cookies();
  return cookieStore.get(adminCookieName)?.value;
}
