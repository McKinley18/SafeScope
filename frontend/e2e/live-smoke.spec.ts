import { test, expect } from '@playwright/test';

const APP_URL = process.env.APP_URL || 'https://safescope-frontend.vercel.app';

test('live app loads command center', async ({ page }) => {
  await page.goto(APP_URL);

  await expect(page.getByText(/Safety Command Center|Executive Command Center/i).first()).toBeVisible({
    timeout: 20000,
  });
  await expect(page.getByText(/Immediate Attention Required|Overdue Actions|Critical Exposure|Completion Rate|Top Risks|Executive Summary/i).first()).toBeVisible();
});

test('inspect page buttons are visible', async ({ page }) => {
  await page.goto(`${APP_URL}/tabs/camera`);

  await expect(page.getByText('Inspect').first()).toBeVisible({ timeout: 20000 });
  await expect(page.getByText(/Check Possible Standards|Check Standards & Risk/i).first()).toBeVisible();
  await expect(page.getByText('Save & Add New Hazard').first()).toBeVisible();
  await expect(page.getByText('Save & Review Report').first()).toBeVisible();
  await expect(page.getByText('Save & Quit').first()).toBeVisible();
});
