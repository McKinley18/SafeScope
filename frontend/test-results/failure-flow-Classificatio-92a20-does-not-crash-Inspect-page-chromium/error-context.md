# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: failure-flow.spec.ts >> Classification API failure does not crash Inspect page
- Location: tests/e2e/failure-flow.spec.ts:3:5

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
      - code [ref=e10]: "`iad1::hvwgj-1778558919551-be035719e0c6`"
  - link "Read our documentation to learn more about this error." [ref=e11] [cursor=pointer]:
    - /url: https://vercel.com/docs/errors/NOT_FOUND
    - generic [ref=e12]: Read our documentation to learn more about this error.
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test('Classification API failure does not crash Inspect page', async ({ page }) => {
  4  |   await page.route('**/reports/**/classify', route => route.abort());
  5  | 
  6  |   await page.goto('/tabs/camera');
  7  | 
> 8  |   await page.getByPlaceholder(/Example:/i).fill('unguarded edge failure test');
     |                                            ^ Error: locator.fill: Test timeout of 30000ms exceeded.
  9  | 
  10 |   await page.getByTestId('hazard-category-dropdown').click();
  11 |   await page.getByText('Machine Guarding').click();
  12 | 
  13 |   await page.getByText(/Check Standards/i).click();
  14 | 
  15 |   await page.waitForTimeout(1000);
  16 | 
  17 |   await expect(page.getByText('Inspect').first()).toBeVisible();
  18 |   await expect(page.getByText(/Check Standards/i)).toBeVisible();
  19 | });
  20 | 
  21 | test('Incomplete hazard does not create a finding card', async ({ page }) => {
  22 |   await page.goto('/tabs/camera');
  23 | 
  24 |   await page.getByText(/Add New/i).click();
  25 | 
  26 |   await page.waitForTimeout(1000);
  27 | 
  28 |   await expect(page.getByText(/Finding 1/i)).toHaveCount(0);
  29 | });
  30 | 
```