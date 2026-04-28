import { test, expect } from '@playwright/test';

const APP_URL = process.env.APP_URL || 'https://safescope-frontend.vercel.app';

test('inspect workflow suggests standards and saves report package', async ({ page }) => {
  await page.goto(`${APP_URL}/tabs/camera`);

  await page.getByPlaceholder(/Example:/i).fill('Conveyor tail pulley missing guard near feed hopper.');

  const responsePromise = page.waitForResponse(
    (res) => res.url().includes('/standards/suggest') && res.status() >= 200 && res.status() < 300,
    { timeout: 30000 }
  );

  await page.getByText('Check Possible Standards').first().click();
  await responsePromise;

  await expect(page.getByText('30 CFR 56.14107').first()).toBeVisible({ timeout: 10000 });
  await expect(page.getByText(/Moving machine parts|Unguarded conveyors/i).first()).toBeVisible();

  await page.getByPlaceholder('Location').fill('Plant feed area');
  await page.getByPlaceholder('Equipment / Area').fill('Conveyor tail pulley');
  await page.getByPlaceholder('Required corrective action').fill('Install and verify proper guarding before operation.');
  await page.getByPlaceholder('Assigned To').fill('Maintenance');
  await page.getByPlaceholder('Due Date').fill('2026-04-30');

  await page.getByText('Save & Review Report').first().click();

  await expect(page.getByText('Completed Hazards').first()).toBeVisible({ timeout: 10000 });
  await expect(page.getByText(/Observation:/i).first()).toBeVisible();
  await expect(page.getByText(/Possible Standard \/ Review Area:/i).first()).toBeVisible();
});
