import { test, expect } from '@playwright/test';

test('Inspect finding edit and delete buttons work', async ({ page }) => {
  const unique = `unguarded edge edit delete ${Date.now()}`;

  await page.goto('/tabs/camera');

  await page.getByPlaceholder(/Example:/i).fill(unique);

  await page.getByTestId('hazard-category-dropdown').click();
  await page.getByText('Machine Guarding').click();

  await page.getByText(/Check Standards/i).click();

  await expect(page.getByText(/Risk Assessment/i)).toBeVisible();

  await page.getByText(/Add New/i).click();

  await expect(page.getByText(/Finding 1/i)).toBeVisible();

  const editButton = page.locator('[data-testid^="finding-edit-"]').first();
  await editButton.click();

  await expect(page.getByPlaceholder(/Example:/i)).toHaveValue(unique);

  await page.getByText(/Add New/i).click();

  await expect(page.getByText(/Finding 1/i)).toBeVisible();

  const deleteButton = page.locator('[data-testid^="finding-delete-"]').first();
  await deleteButton.click();

  await expect(page.getByText(/Finding 1/i)).toHaveCount(0);
});

test('Records delete button removes submitted report', async ({ page }) => {
  const unique = `fire extinguisher blocked ${Date.now()}`;

  await page.goto('/tabs/camera');

  await page.getByPlaceholder(/Example:/i).fill(unique);

  await page.getByTestId('hazard-category-dropdown').click();
  await page.getByText('Fire / Hot Work').click();

  await page.getByText(/Check Standards/i).click();

  await expect(page.getByText(/Risk Assessment/i)).toBeVisible();

  await page.getByText(/Add New/i).click();

  page.on('dialog', async dialog => {
    await dialog.accept();
  });

  await page.getByText(/Submit Report/i).click();

  await page.waitForTimeout(1500);

  await page.goto('/tabs/history');

  await expect(page.getByText(/Inspection Report/i).first()).toBeVisible();

  await page.getByText('Delete').first().click();

  await page.waitForTimeout(1000);

  await expect(page.getByText(/Records Center/i)).toBeVisible();
});
