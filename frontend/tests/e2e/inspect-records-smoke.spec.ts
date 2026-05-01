import { test, expect } from '@playwright/test';

test('Inspect flow loads and core buttons are visible', async ({ page }) => {
  await page.goto('http://localhost:8081/tabs/camera');

  await expect(page.getByText('Inspect').first()).toBeVisible();
  await expect(page.getByText(/Take Photo/i)).toBeVisible();
  await expect(page.getByText(/Upload Photo/i)).toBeVisible();
  await expect(page.getByText(/Check Standards & Risk/i)).toBeVisible();
  await expect(page.getByText(/Add New/i)).toBeVisible();
  await expect(page.getByText(/Review/i)).toBeVisible();
  await expect(page.getByText(/Quit/i)).toBeVisible();
  await expect(page.getByText(/Submit Report/i)).toBeVisible();
});

test('Records page loads', async ({ page }) => {
  await page.goto('http://localhost:8081/tabs/history');

  await expect(page.getByText(/Records Center/i)).toBeVisible();
  await expect(page.getByPlaceholder(/Search area/i)).toBeVisible();
});
