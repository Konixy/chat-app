import React from 'react';
import { Button } from '@nextui-org/react';
import { signIn } from 'next-auth/react';

export default function Login() {
  return (
    <Button className="bg-blue-500" icon={<i className="fab fa-google" />} as="button" onClick={() => signIn('google')} color="primary" auto>
      Sign in with Google
    </Button>
  );
}
