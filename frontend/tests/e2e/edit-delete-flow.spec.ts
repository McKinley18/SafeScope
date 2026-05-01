import { test, expect } from '@playwright/test';

test('Inspect finding edit and delete buttons work', async ({ page }) => {
  await page.goto('/tabs/camera');

  await page.getByPlaceholder(/Example:/i).fill('unguarded edge at crusher');

  await page.getByTestId('hazard-category-dropdown').click();
  await page.getByText('Machine Guarding').click();

  await page.getByText(/Check Standards/i).click();

  await expect(page.getByText(/Risk Assessment/i)).toBeVisible();

  await page.getByText(/Add New/i).click();

  await expect(page.getByText(/Finding 1/i)).toBeVisible();

  await page.getByText('Edit').first().click();

  await expect(page.getByPlaceholder(/Example:/i)).toHaveValue(/unguarded edge at crusher/i);

  await page.getByText(/Add New/i).click();

  await expect(page.getByText(/Finding 1/i)).toBeVisible();

  await page.getByText('Delete').first().click();

  await expect(page.getByText(/Finding 1/i)).not.toBeVisible();
});

test('Records delete button removes submitted report', async ({ page }) => {
  await page.goto('/tabs/camera');

  await page.getByPlaceholder(/Example:/i).fill('fire extinguisher blocked');

  await page.getByTestId('hazard-category-dropdown').click();
  await page.getByText('Fire / Hot Work').click();

  await page.getByText(/Check Standards/i).click();

  await expect(page.getByText(/Risk Assessment/i)).toBeVisible();

  await page.getByText(/Add New/i).click();

  page.on('dialog', async dialog => {
    await dialog.accept();
  });

  await page.getByText(/Submit Report/i).click();

  await page.waitForTimeout(1000);

  await page.goto('/tabs/history');

  await expect(page.getByText(/fire extinguisher blocked|Inspection Report/i).first()).toBeVisible();

  await page.getByText('Delete').first().click();

  await page.waitForTimeout(1000);

  await expect(page.getByText(/fire extinguisher blocked/i)).not.toBeVisible();
});
