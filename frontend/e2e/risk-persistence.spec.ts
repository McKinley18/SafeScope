import { test, expect } from '@playwright/test';

const APP_URL = process.env.APP_URL || 'https://safescope-frontend.vercel.app';

test('risk assessment appears after checking standards and risk', async ({ page }) => {
  await page.goto(`${APP_URL}/tabs/camera`);

  await page.getByPlaceholder(/Example:/i).fill('Conveyor tail pulley missing guard near feed hopper.');

  await page.getByText(/Check Standards & Risk|Check Possible Standards/i).first().click();

  await expect(page.getByText(/Risk Assessment/i).first()).toBeVisible({ timeout: 15000 });
  await expect(page.getByText(/Score:/i).first()).toBeVisible();
});
