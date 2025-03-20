import { test, expect } from '@playwright/test';
import { setupClerkTestingToken, clerk } from '@clerk/testing/playwright'

/*
  * Remember to run `npx playwright install`! 
  * I removed the puzzle tests to focus on login etc. in this specific example.
     (TODO: re-add the puzzle tests from the livecode repo.)
*/

// This port number needs to be the same as in playwright.config.ts
// Use "localhost" here rather than "127.0.0.1" to avoid some issues on Windows 
const url = 'http://localhost:8000'

test('renders instructions', async ({ page }) => {
  await setupClerkTestingToken({ page })
  await page.goto(url);
  // The "i" modifier means a case-insensitive match
  const instructionElement = page.getByText(/I'm thinking of a function/i);
  await expect(instructionElement).toBeVisible();
});

test('login/logout', async ({ page }) => {
  await setupClerkTestingToken({ page })
  await page.goto(url);
  await clerk.loaded({ page })
  const loginButton = page.getByRole('button', {name: 'Sign in'})
  await expect(loginButton).toBeVisible();

  // This logs in/out via _Clerk_, not via actual component interaction. But that's OK.
  // (Clerk's Playwright guide has an example of filling the login form itself.)
  await clerk.signIn({
    page,
    signInParams: { 
       strategy: 'password', 
       password: process.env.E2E_CLERK_USER_PASSWORD!, 
       identifier: process.env.E2E_CLERK_USER_USERNAME! },
  })

  // Partial match by default
  // But beware: there are 2 possible matches here: one from the header text, and one from 
  //   the actual logged-in text. So we need to be more specific.
  // const loginText = page.getByText('You are logged in')
  // Look for this string inside a "Login Status" aria-labeled component
  const loginText = page.getByLabel('Login Status').getByText('You are logged in')
  await expect(loginText).toBeVisible();
  
  await clerk.signOut({ page })

})
