# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: real-flow.spec.ts >> Real inspection workflow
- Location: tests/e2e/real-flow.spec.ts:3:5

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
      - code [ref=e10]: "`iad1::q9sbd-1778558919556-2d8da536423a`"
  - link "Read our documentation to learn more about this error." [ref=e11] [cursor=pointer]:
    - /url: https://vercel.com/docs/errors/NOT_FOUND
    - generic [ref=e12]: Read our documentation to learn more about this error.
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test('Real inspection workflow', async ({ page }) => {
  4  |   const unique = `unguarded edge at crusher ${Date.now()}`;
  5  | 
  6  |   await page.goto('/tabs/camera');
  7  | 
> 8  |   await page.getByPlaceholder(/Example:/i).fill(unique);
     |                                            ^ Error: locator.fill: Test timeout of 30000ms exceeded.
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
  20 |   await expect(page.getByText(unique).first()).toBeVisible();
  21 | 
  22 |   page.on('dialog', async d => await d.accept());
  23 | 
  24 |   await page.getByText(/Submit Report/i).click();
  25 | 
  26 |   await page.waitForTimeout(1500);
  27 | 
  28 |   await page.goto('/tabs/history');
  29 | 
  30 |   await expect(page.getByText(/Inspection Report/i).first()).toBeVisible();
  31 | });
  32 | 
```