import React from 'react';
import Puzzle from './Puzzle'
import './App.css';

import { SignedIn, SignedOut, SignInButton, SignOutButton, UserButton, ClerkProvider } from "@clerk/clerk-react";

/////////////////////////////////////////////////////////////////////

import { publishable_key } from './public_keys';

//////////////////////////////////////////////////////////////////

function App() {
  /**
   * I installed `cross-env` to avoid multi-platform problems:
   *    https://www.npmjs.com/package/cross-env
   * 
   * Environment variables need to be prefixed with VITE_ for Vite to pass them!
   * Hence the name of this variable: VITE_MOCK_VALUE 
   * 
   * Cross-env will help us pass environment variables to Vite. E.g., 
   *   cross-env VITE_MOCK_VALUE=true npm start
   * will pass `true` in this environment variable, which we can then refer to.
   * 
   * Note that since Playwright's `webserver` config field lets you provide a 
   * command string, we can use the above in place of just `npm start` to make 
   * Playwright automatically configure an environment variable.
   */
  const useMock = import.meta.env.VITE_MOCK_VALUE

  return (
    <ClerkProvider publishableKey={publishable_key} afterSignOutUrl="/">
    <div className="App">
      <p className="App-header">
        I'm thinking of a function that either accepts or rejects sequences of 3 numbers. 
        For example, <b>my function returns true on the sequence: 2, 4, 8.</b>        
        Can you figure out what it is? Try it out and see what it returns on your sequences...        
      </p>
      <p> 
        This app logs all sequences entered, along with the result, a timestamp, 
        and a unique session identifier created when the page is loaded. 
        No other data is logged (unless you are logged in; see below). 
      </p>
      <p>
        Optionally, you may log into this puzzle. If you do so, <strong>your login will be saved in the logs.</strong> This is so the project can serve as an example for basic authentication with Clerk.
        Because logging in and out changes the page that your browser is on, your progress in the puzzle will be deleted when your login status changes.
      </p>
      <SignedOut>
        <Puzzle />
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <Puzzle />
        <hr/>
        <div>You are logged in! <UserButton /> <SignOutButton /></div>
      </SignedIn>      
    </div>
    {`useMock=${useMock}`}
    </ClerkProvider>
  );
}

export default App;
