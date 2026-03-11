export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const trimTrailingSlash = (value: string) => value.replace(/\/$/, "");

const getSupabaseConfig = () => {
  if (!supabaseUrl) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable");
  }
  if (!supabaseAnonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable");
  }

  return {
    url: trimTrailingSlash(supabaseUrl),
    anonKey: supabaseAnonKey,
  };
};

export const adminCookieName = "cr_admin_access_token";

export type SupabaseMethod = "GET" | "POST" | "PATCH" | "DELETE";

export async function supabaseRest<T>(
  path: string,
  method: SupabaseMethod,
  accessToken: string,
  body?: unknown,
  preferHeader?: string,
): Promise<T> {
  const config = getSupabaseConfig();
  const headers: Record<string, string> = {
    apikey: config.anonKey,
    Authorization: `Bearer ${accessToken}`,
  };

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (preferHeader) {
    headers.Prefer = preferHeader;
  }

  const response = await fetch(`${config.url}/rest/v1/${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Supabase REST error (${response.status}): ${text}`);
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return [] as T;
  }

  return (await response.json()) as T;
}

export async function supabaseAuthSignIn(email: string, password: string) {
  const config = getSupabaseConfig();
  const response = await fetch(`${config.url}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: config.anonKey,
    },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });

  const data = (await response.json()) as {
    access_token?: string;
    expires_in?: number;
    refresh_token?: string;
    user?: { id: string; email?: string };
    error_description?: string;
    msg?: string;
  };

  if (!response.ok || !data.access_token || !data.expires_in) {
    const message = data.error_description ?? data.msg ?? "Invalid credentials";
    throw new Error(message);
  }

  return data;
}
