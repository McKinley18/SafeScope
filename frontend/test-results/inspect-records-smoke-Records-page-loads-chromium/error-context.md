# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: inspect-records-smoke.spec.ts >> Records page loads
- Location: tests/e2e/inspect-records-smoke.spec.ts:16:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText(/Records Center/i)
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText(/Records Center/i)

```

```yaml
- heading "Unmatched Route" [level=1]
- heading "Page could not be found." [level=2]
- link "http://localhost:8081/tabs/history":
  - /url: /tabs/history
- text: Go back •
- link "Sitemap":
  - /url: /_sitemap
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test('Inspect flow loads and core buttons are visible', async ({ page }) => {
  4  |   await page.goto('http://localhost:8081/tabs/camera');
  5  | 
  6  |   await expect(page.getByText('Inspect').first()).toBeVisible();
  7  |   await expect(page.getByText(/Take Photo/i)).toBeVisible();
  8  |   await expect(page.getByText(/Upload Photo/i)).toBeVisible();
  9  |   await expect(page.getByText(/Check Standards & Risk/i)).toBeVisible();
  10 |   await expect(page.getByText(/Add New/i)).toBeVisible();
  11 |   await expect(page.getByText(/Review/i)).toBeVisible();
  12 |   await expect(page.getByText(/Quit/i)).toBeVisible();
  13 |   await expect(page.getByText(/Submit Report/i)).toBeVisible();
  14 | });
  15 | 
  16 | test('Records page loads', async ({ page }) => {
  17 |   await page.goto('http://localhost:8081/tabs/history');
  18 | 
> 19 |   await expect(page.getByText(/Records Center/i)).toBeVisible();
     |                                                   ^ Error: expect(locator).toBeVisible() failed
  20 |   await expect(page.getByPlaceholder(/Search area/i)).toBeVisible();
  21 | });
  22 | 
```