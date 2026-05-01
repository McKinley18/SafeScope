import { test, expect } from '@playwright/test';

test('Classification API failure does not crash Inspect page', async ({ page }) => {
  await page.route('**/reports/**/classify', route => route.abort());

  await page.goto('/tabs/camera');

  await page.getByPlaceholder(/Example:/i).fill('unguarded edge failure test');

  await page.getByTestId('hazard-category-dropdown').click();
  await page.getByText('Machine Guarding').click();

  await page.getByText(/Check Standards/i).click();

  await page.waitForTimeout(1000);

  await expect(page.getByText('Inspect').first()).toBeVisible();
  await expect(page.getByText(/Check Standards/i)).toBeVisible();
});

test('Incomplete hazard does not create a finding card', async ({ page }) => {
  await page.goto('/tabs/camera');

  await page.getByText(/Add New/i).click();

  await page.waitForTimeout(1000);

  await expect(page.getByText(/Finding 1/i)).toHaveCount(0);
});
