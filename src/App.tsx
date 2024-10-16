import React from 'react';
import Puzzle from './Puzzle'
import './App.css';

import { SignedIn, SignedOut, SignInButton, SignOutButton, UserButton, ClerkProvider } from "@clerk/clerk-react";

/////////////////////////////////////////////////////////////////////

import { publishable_key } from './public_keys';

//////////////////////////////////////////////////////////////////

function App() {
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
        and a unique session identifier created when the page is loaded. No other data is logged. 
      </p>
      <p>
        Optionally, you may log into this puzzle. If you do so, your login is <strong>not</strong> saved in the logs.
        However, because logging in and out changes the page that your browser is on, your progress in the puzzle will be deleted when your login status changes.
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
    </ClerkProvider>
  );
}

export default App;
