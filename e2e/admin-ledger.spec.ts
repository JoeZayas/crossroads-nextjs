import { test, expect } from "@playwright/test";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "";

test.describe("Admin ledger — financial accuracy", () => {
  test.skip(!ADMIN_PASSWORD, "ADMIN_PASSWORD not set — skipping authed flows");

  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/login");
    await page.getByLabel(/password/i).fill(ADMIN_PASSWORD);
    await page.getByRole("button", { name: /sign in|log in/i }).click();
    await expect(page).toHaveURL(/\/admin(\/.*)?$/, { timeout: 10_000 });
  });

  test("dashboard renders KPIs", async ({ page }) => {
    await page.goto("/admin");
    await expect(page.getByText(/active|total owed|payments/i).first()).toBeVisible();
  });

  test("residents list links to detail pages", async ({ page }) => {
    await page.goto("/admin/residents");
    const firstLink = page.locator('a[href^="/admin/residents/"]').first();
    await expect(firstLink).toBeVisible();
    await firstLink.click();
    await expect(page).toHaveURL(/\/admin\/residents\/[0-9a-f-]+/);
    await expect(page.getByRole("heading", { name: /ledger/i })).toBeVisible();
  });

  test("Weekly resident charges never exceed weekly rate × 1.05", async ({ page, request }) => {
    const apiResponse = await request.get("/api/admin/dashboard");
    expect(apiResponse.ok()).toBeTruthy();
    const dashboard = await apiResponse.json();
    const overdue: Array<{ resident_id: string; full_name: string }> = dashboard.overdue ?? [];

    const WEEKLY_MAX = 165 * 1.05;
    const MONTHLY_MAX = 700 * 1.05;
    const RENT_DUE_PATTERN = /Rent due (\d{1,2}\/\d{1,2}\/\d{4}) to (\d{1,2}\/\d{1,2}\/\d{4})/i;
    const ONE_DAY_MS = 24 * 60 * 60 * 1000;

    for (const resident of overdue.slice(0, 10)) {
      const ledgerRes = await request.get(`/api/admin/residents/${resident.resident_id}/ledger`);
      expect(ledgerRes.ok()).toBeTruthy();
      const entries: Array<{ entry_type: string; description: string; amount: number }> =
        await ledgerRes.json();

      for (const entry of entries) {
        if (entry.entry_type !== "charge") continue;
        const match = entry.description.match(RENT_DUE_PATTERN);
        if (!match) continue;

        const [, startStr, endStr] = match;
        const [sm, sd, sy] = startStr.split("/").map(Number);
        const [em, ed, ey] = endStr.split("/").map(Number);
        const span = (Date.UTC(ey, em - 1, ed) - Date.UTC(sy, sm - 1, sd)) / ONE_DAY_MS + 1;

        const isWeekly = span <= 8;
        const cap = isWeekly ? WEEKLY_MAX : MONTHLY_MAX;
        expect(
          Math.abs(Number(entry.amount)),
          `${resident.full_name}: charge "${entry.description}" = $${entry.amount} exceeds cap $${cap.toFixed(2)} for ${span}-day period`,
        ).toBeLessThanOrEqual(cap);
      }
    }
  });
});
