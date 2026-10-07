import { test, expect } from '@playwright/test';

/*
  * Remember to run `npx playwright install`!
  * I removed the puzzle tests to focus on login etc. in this specific example.
     (TODO: re-add the puzzle tests from the livecode repo.)
*/

// This port number needs to be the same as in playwright.config.ts
// Use "localhost" here rather than "127.0.0.1" to avoid some issues on Windows
const url = 'http://localhost:8000'

test('renders instructions', async ({ page }) => {
  await page.goto(url);
  // The "i" modifier means a case-insensitive match
  const instructionElement = page.getByText(/I'm thinking of a function/i);
  await expect(instructionElement).toBeVisible();
});
