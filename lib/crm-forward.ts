// Server-side helper for forwarding form submissions to the Sober CRM
// lead-capture endpoints. CRM forwarding is best-effort: callers should treat
// a "failed" result as non-fatal (the notification email is the fallback record).

const CRM_TIMEOUT_MS = 5000;

export type CrmForwardResult =
  | { ok: true; status: number; body: unknown }
  | { ok: false; error: string };

/**
 * Forward a JSON payload to a CRM public endpoint.
 *
 * @param path - CRM endpoint path, e.g. "/api/public/intake" or "/api/public/contact"
 * @param payload - JSON-serializable body to POST
 */
export async function forwardToCrm(path: string, payload: unknown): Promise<CrmForwardResult> {
  const baseUrl = process.env.CRM_FORMS_URL;
  const secret = process.env.CRM_FORMS_SECRET;

  if (!baseUrl || !secret) {
    return { ok: false, error: 'CRM forwarding is not configured (missing CRM_FORMS_URL or CRM_FORMS_SECRET)' };
  }

  const url = `${baseUrl.replace(/\/+$/, '')}${path}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forms-secret': secret,
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(CRM_TIMEOUT_MS),
    });

    if (!response.ok) {
      // Don't include response body details beyond status; never log the secret.
      return { ok: false, error: `CRM responded with status ${response.status}` };
    }

    let body: unknown = null;
    try {
      body = await response.json();
    } catch {
      // 2xx with non-JSON body; still a success.
    }

    return { ok: true, status: response.status, body };
  } catch (err) {
    if (err instanceof Error && (err.name === 'TimeoutError' || err.name === 'AbortError')) {
      return { ok: false, error: `CRM request timed out after ${CRM_TIMEOUT_MS}ms` };
    }
    return { ok: false, error: err instanceof Error ? err.message : 'Unknown error contacting CRM' };
  }
}
