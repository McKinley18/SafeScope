import { test, expect } from '@playwright/test';

test('Real inspection workflow', async ({ page }) => {
  await page.goto('/tabs/camera');

  // Enter hazard
  await page.getByPlaceholder(/Example:/i).fill('unguarded edge at crusher');

  // Select category
  await page.getByTestId('hazard-category-dropdown').click();
  await page.getByText('Machine Guarding').click();

  // Run classification
  await page.getByText(/Check Standards/i).click();

  // Validate classification response
  await expect(page.getByText(/Risk Assessment/i)).toBeVisible();
  await expect(page.getByText(/Score:/i)).toBeVisible();

  // Save hazard
  await page.getByText(/Add New/i).click();

  // Verify summary card
  await expect(page.getByText(/Finding 1/i)).toBeVisible();

  // Submit report
  await page.getByText(/Submit Report/i).click();

  // Dismiss success alert if it appears
  page.on('dialog', async dialog => {
    await dialog.accept();
  });

  await page.waitForTimeout(1000);

  // Navigate to records
  await page.goto('/tabs/history');

  // Verify report exists
  await expect(page.getByText(/Inspection Report|unguarded edge at crusher/i).first()).toBeVisible();
});
