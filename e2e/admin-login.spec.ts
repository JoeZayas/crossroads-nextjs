import { test, expect } from "@playwright/test";

test.describe("Admin auth gate", () => {
  test("redirects to /admin/login when unauthenticated", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("login page renders password form", async ({ page }) => {
    await page.goto("/admin/login");
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /sign in|log in/i })).toBeVisible();
  });

  test("rejects an obviously bad password", async ({ page }) => {
    await page.goto("/admin/login");
    await page.getByLabel(/email/i).fill("not-a-real-admin@example.com");
    await page.getByLabel(/password/i).fill("definitely-not-the-password-xyz123");
    await page.getByRole("button", { name: /sign in|log in/i }).click();
    await expect(page.locator("body")).toContainText(/invalid|incorrect|wrong|failed/i, {
      timeout: 5000,
    });
  });
});
