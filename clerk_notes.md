# Notes on Clerk etc. 

To experiment with authentication "in anger", I added Clerk authentication to this app in October, 2024. This markdown file contains my notes on the process: what I did, problems I encountered, and so on. 

## Step 1: Initial Clerk Integration

I logged into Clerk using my Brown email, and created a new (free tier) app name called `reactNYT`. Clicking on the "React" tab gave me a series of steps to follow. 

The workflow shown in the documentation starts a _new_ application, and I already have an application! So how do I integrate Clerk without recreating my app and copying over everything? Let's just improvise around their guide and read docs as we go. To start, I ran: `npm install @clerk/clerk-react`. Then I added a `ClerkProvider` to the `App.tsx` component, a login button for `SignedOut` and wrapped the `Puzzle` component in `SignedIn`. These required some imports, but matched their guide almost exactly. 

Now I need to put my publishable key into the provider as a prop. The error message I get without one (via the console) says to get one at: `https://dashboard.clerk.com/apps/`. That page says that the publishable key is meant to be included in the front-end code, and does not need to be kept secret. 

Rather than use an envfile, I just added a `public_keys.ts` source file, exporting the key, and added it to Git. Now I have a login button showing up. Clicking it takes me to a login page. I used my Brown email address to log in. 

**Potential problem:** Safari gave me a big error in the console about possible XSS attacks at first, but Firefox is OK.

**Potential problem:** This is a "dev key"; Clerk says: `[Warning] Clerk: Clerk has been loaded with development keys. Development instances have strict usage limits and should not be used when deploying your application to production. Learn more: https://clerk.com/docs/deployments/overview`. But Clerk should be usable locally, which serves the purpose of the example.

**Problem:** After login, I got a message: 

> The server is configured with a public base URL of /reactNYT/ - did you mean to visit /reactNYT/reactNYT?__clerk_db_jwt=dvb_2nX8DemLH9P8EDeahWyWS6POoIv instead?

Weird! So I'm being redirected to a different URL than I expected. There must be some base URL configuration issue with Clerk. Because clicking that link _works_!  But then, after I restarted the dev server, I no longer got this error and redirection went to the proper URL. I can't reproduce this issue. 

Overall, getting this working with a dev server wasn't hard at all. 

## Step 2: Testing with Playwright

Clerk has bot detection to prevent bots from probing its users' authentication. Unfortunately, this means that testing is complicated: Playwright is very likely to trigger this bot detection, because Playwright _is_ a bot! 

To mitigate this problem, Clerk provides "test tokens" that can be used for testing (via dev servers only). And it has [framework support for Playwright](https://clerk.com/docs/testing/playwright). So let's try using the Playwright stuff that Clerk gives us. They even have a [demo repo](https://github.com/clerk/clerk-playwright-nextjs) (although it uses next.js).

`npm i @clerk/testing --save-dev`

We need to provide both public and private keys in the test runner, via the variables `CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`. So this means I may need to switch to an envfile. It also means we finally need to worry about security for the private key, since it's used in generating test tokens.

I'll add an envfile for this, but since it's for development only, and contains the secret key as well, I won't commit it to Git. The shape is:

```
# CLERK DEV INSTANCE KEYS
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_XXXX
CLERK_SECRET_KEY=sk_test_XXXX

# E2E CLERK TEST USER
E2E_CLERK_USER_USERNAME=username
E2E_CLERK_USER_PASSWORD=password
```

**Question**: Do we really need the username/password in the envfile, or can we script the login? I think we could, but let's follow their guide here.

I followed the instructions to augment the test script: calling `clerkSetup()` before everything, and `await setupClerkTestingToken({ page })` per test. But I still got this error: 

> Error: The Clerk Frontend API URL is required to bypass bot protection. Make sure the clerkSetup function is called during your global setup before setupClerkTestingToken is called.

Ah, but I forgot to put this in the "global setup file". Following the Playwright docs example, I added a project to the Playwright config file:

```
{
    name: 'setup Clerk',
    testMatch: /global\.setup\.ts/,
},
```

and made it a dependency for the others, e.g., 

```
{
    name: 'chromium',
    use: { ...devices['Desktop Chrome'] },
    dependencies: ['setup Clerk'],
},
```

I also didn't `await` Clerk loading:

`await clerk.loaded({ page })`

Now the tests pass in `npx playwright test --ui` when I manually run each. Weirdly, they fail in `npx playwright test`. E.g., 

```
Error: expect(locator).toBeVisible()

    Locator: getByText(/I'm thinking of a function/i)
    Expected: visible
    Received: hidden
    Call log:
      - expect.toBeVisible with timeout 5000ms
      - waiting for getByText(/I'm thinking of a function/i)
```

Embarrassingly, I had forgotten to `await` the locator's visibility. It should have been:

```
await expect(instructionElement).toBeVisible();
```

Now they all pass. Let's add some actual logging in, though. I'll make a user in the Clerk dashboard specifically for testing. This won't go through Google, but only to Clerk. I'll then put their username and password in the envfile. 

## Deployment to Github Pages

I stopped the Clerk integration here due to time limitations, which means I can't actually deploy the version with authentication for next semester's class. But that's a problem for winter break.

[Clerk's guide](https://clerk.com/docs/deployments/overview) will be helpful. But without a production instance, Clerk won't load in the deployed app.

