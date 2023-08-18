import React from 'react';
import { Button } from './ui/button';
import { useRouter } from 'next/router';

export default function BackBtn({ url, className }: { url?: string; className?: string }) {
  const router = useRouter();

  return (
    <Button variant="link" className={'absolute left-0 top-0 ml-10 mt-10 ' + className} onClick={() => (url ? router.push(url) : router.back())}>
      <i className="fas fa-chevron-left pr-2" /> Back to homepage
    </Button>
  );
}
