import { test, expect } from "@playwright/test";

test.describe("Public marketing pages", () => {
  test("home page loads and renders the hero", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Crossroads/i);
    await expect(page.locator("body")).toBeVisible();
  });

  test("contact page loads", async ({ page }) => {
    const response = await page.goto("/contact");
    expect(response?.status()).toBeLessThan(400);
  });

  test("contract page loads", async ({ page }) => {
    const response = await page.goto("/contract");
    expect(response?.status()).toBeLessThan(400);
  });
});
