import React, { useState } from 'react';
import Puzzle from './Puzzle'
import './App.css';

import { google_client_id } from './public_keys';
import { GoogleUser, GoogleSignInButton, signOutOfGoogle } from './google_auth';

function App() {
  const [user, setUser] = useState<GoogleUser | undefined>(undefined);

  function signOut() {
    signOutOfGoogle();
    setUser(undefined);
  }

  return (
    <>
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
        Optionally, you may log into this puzzle. If you do so, <strong>your login will be saved in the logs.</strong> This is so the project can serve as an example for basic authentication with Google Sign-In.
        Logging in or out will reset your progress in the puzzle.
      </p>
      { !user ? (
        <>
          <Puzzle user={user} key="logged-out" />
          <div aria-label='Login Status'>
            You are logged out.{' '}
            <GoogleSignInButton clientId={google_client_id} onSignIn={setUser} />
          </div>
        </>
      ) : (
        <>
          <Puzzle user={user} key={user.id} />
          <hr/>
          <div aria-label='Login Status'>You are logged in as {user.name ?? user.email}! <button onClick={signOut}>Sign out</button></div>
        </>
      )}
    </div>
    {`App version: ${__APP_VERSION}`}
    </>
  );
}

export default App;
