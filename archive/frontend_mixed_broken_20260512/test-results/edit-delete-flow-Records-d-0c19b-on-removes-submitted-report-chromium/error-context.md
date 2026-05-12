# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: edit-delete-flow.spec.ts >> Records delete button removes submitted report
- Location: tests/e2e/edit-delete-flow.spec.ts:36:5

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByPlaceholder(/Example:/i)

```

# Page snapshot

```yaml
- main [ref=e3]:
  - paragraph [ref=e4]:
    - generic [ref=e5]:
      - strong [ref=e6]: "404"
      - text: ": NOT_FOUND"
    - generic [ref=e7]:
      - text: "Code:"
      - code [ref=e8]: "`NOT_FOUND`"
    - generic [ref=e9]:
      - text: "ID:"
      - code [ref=e10]: "`iad1::5pzsm-1778558949825-7abedff61aa3`"
  - link "Read our documentation to learn more about this error." [ref=e11] [cursor=pointer]:
    - /url: https://vercel.com/docs/errors/NOT_FOUND
    - generic [ref=e12]: Read our documentation to learn more about this error.
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test('Inspect finding edit and delete buttons work', async ({ page }) => {
  4  |   const unique = `unguarded edge edit delete ${Date.now()}`;
  5  | 
  6  |   await page.goto('/tabs/camera');
  7  | 
  8  |   await page.getByPlaceholder(/Example:/i).fill(unique);
  9  | 
  10 |   await page.getByTestId('hazard-category-dropdown').click();
  11 |   await page.getByText('Machine Guarding').click();
  12 | 
  13 |   await page.getByText(/Check Standards/i).click();
  14 | 
  15 |   await expect(page.getByText(/Risk Assessment/i)).toBeVisible();
  16 | 
  17 |   await page.getByText(/Add New/i).click();
  18 | 
  19 |   await expect(page.getByText(/Finding 1/i)).toBeVisible();
  20 | 
  21 |   const editButton = page.locator('[data-testid^="finding-edit-"]').first();
  22 |   await editButton.click();
  23 | 
  24 |   await expect(page.getByPlaceholder(/Example:/i)).toHaveValue(unique);
  25 | 
  26 |   await page.getByText(/Add New/i).click();
  27 | 
  28 |   await expect(page.getByText(/Finding 1/i)).toBeVisible();
  29 | 
  30 |   const deleteButton = page.locator('[data-testid^="finding-delete-"]').first();
  31 |   await deleteButton.click();
  32 | 
  33 |   await expect(page.getByText(/Finding 1/i)).toHaveCount(0);
  34 | });
  35 | 
  36 | test('Records delete button removes submitted report', async ({ page }) => {
  37 |   const unique = `fire extinguisher blocked ${Date.now()}`;
  38 | 
  39 |   await page.goto('/tabs/camera');
  40 | 
> 41 |   await page.getByPlaceholder(/Example:/i).fill(unique);
     |                                            ^ Error: locator.fill: Test timeout of 30000ms exceeded.
  42 | 
  43 |   await page.getByTestId('hazard-category-dropdown').click();
  44 |   await page.getByText('Fire / Hot Work').click();
  45 | 
  46 |   await page.getByText(/Check Standards/i).click();
  47 | 
  48 |   await expect(page.getByText(/Risk Assessment/i)).toBeVisible();
  49 | 
  50 |   await page.getByText(/Add New/i).click();
  51 | 
  52 |   page.on('dialog', async dialog => {
  53 |     await dialog.accept();
  54 |   });
  55 | 
  56 |   await page.getByText(/Submit Report/i).click();
  57 | 
  58 |   await page.waitForTimeout(1500);
  59 | 
  60 |   await page.goto('/tabs/history');
  61 | 
  62 |   await expect(page.getByText(/Inspection Report/i).first()).toBeVisible();
  63 | 
  64 |   await page.getByText('Delete').first().click();
  65 | 
  66 |   await page.waitForTimeout(1000);
  67 | 
  68 |   await expect(page.getByText(/Records Center/i)).toBeVisible();
  69 | });
  70 | 
```