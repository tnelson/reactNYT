import React, { useEffect, useRef } from 'react';

/*
 * Library to simplify App.tsx for in-class example.  
 * I don't want to use a 3rd-party library at this stage, 
 * and we haven't yet covered useRef. 
 * 
 * This module contains AI-generated code.
 * - Tim
 */

export interface GoogleUser {
  id: string;
  name?: string;
  email?: string;
}

export function decodeGoogleCredential(credential: string): GoogleUser {
  const payload = credential.split('.')[1];
  const json = decodeURIComponent(
    atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
      .split('')
      .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
      .join('')
  );
  const data = JSON.parse(json);
  return { id: data.sub, name: data.name, email: data.email };
}

interface GoogleSignInButtonProps {
  clientId: string;
  onSignIn: (user: GoogleUser) => void;
}

export function GoogleSignInButton({ clientId, onSignIn }: GoogleSignInButtonProps) {
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.google!.accounts.id.initialize({
      client_id: clientId,
      callback: (response) => onSignIn(decodeGoogleCredential(response.credential)),
    });
    window.google!.accounts.id.renderButton(divRef.current!, { theme: 'outline', size: 'medium' });
  }, [clientId, onSignIn]);

  return <div ref={divRef}></div>;
}

export function signOutOfGoogle() {
  window.google!.accounts.id.disableAutoSelect();
}
