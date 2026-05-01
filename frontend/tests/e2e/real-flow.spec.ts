import { test, expect } from '@playwright/test';

test('Real inspection workflow', async ({ page }) => {
  const unique = `unguarded edge at crusher ${Date.now()}`;

  await page.goto('/tabs/camera');

  await page.getByPlaceholder(/Example:/i).fill(unique);

  await page.getByTestId('hazard-category-dropdown').click();
  await page.getByText('Machine Guarding').click();

  await page.getByText(/Check Standards/i).click();

  await expect(page.getByText(/Risk Assessment/i)).toBeVisible();

  await page.getByText(/Add New/i).click();

  await expect(page.getByText(/Finding 1/i)).toBeVisible();
  await expect(page.getByText(unique).first()).toBeVisible();

  page.on('dialog', async d => await d.accept());

  await page.getByText(/Submit Report/i).click();

  await page.waitForTimeout(1500);

  await page.goto('/tabs/history');

  await expect(page.getByText(/Inspection Report/i).first()).toBeVisible();
});
