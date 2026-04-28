import { test, expect } from '@playwright/test';

const APP_URL = process.env.APP_URL || 'https://safescope-frontend.vercel.app';

test('copy report package button appears after saving hazard', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: APP_URL });

  await page.goto(`${APP_URL}/tabs/camera`);

  await page.getByTestId('hazard-category-dropdown').click();
  await page.getByTestId('hazard-category-option-Access / Walking Surfaces').click();
  await page.getByPlaceholder(/Example:/i).fill('Damaged ladder with bent side rail at crusher platform.');

  const responsePromise = page.waitForResponse(
    (res) => res.url().includes('/standards/suggest') && res.status() >= 200 && res.status() < 300,
    { timeout: 30000 }
  );

  await page.getByText(/Check Possible Standards|Check Standards & Risk/i).first().click();
  await responsePromise;

  await expect(page.getByText(/30 CFR 56.11003|Construction and maintenance of ladders/i).first()).toBeVisible({ timeout: 10000 });

  await page.getByPlaceholder('Location').fill('Crusher platform');
  await page.getByPlaceholder('Equipment / Area').fill('Access ladder');
  await page.getByPlaceholder('Required corrective action').fill('Remove ladder from service and repair or replace.');
  await page.getByPlaceholder('Assigned To').fill('Maintenance');
  await page.getByPlaceholder('Due Date').fill('2026-04-30');

  await page.getByText('Save & Review Report').first().click();

  await expect(page.getByText('Completed Hazards').first()).toBeVisible({ timeout: 10000 });
  await expect(page.getByText('Copy Report Package').first()).toBeVisible();
});

test('priority queue action buttons work', async ({ page }) => {
  await page.goto(APP_URL);

  await expect(page.getByText(/Priority Work Queue|Top Risks|Overdue Actions/i).first()).toBeVisible({ timeout: 20000 });

  await page.getByText(/Accept \/ Start Review|Accepted/i).first().click();

  await expect(page.getByText('Accepted').first()).toBeVisible({ timeout: 10000 });
});
