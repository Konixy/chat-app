import React from 'react';
import { Button } from './ui/button';
import { useRouter } from 'next/router';
import { ChevronLeft } from 'lucide-react';

export default function BackBtn({ url, className }: { url?: string; className?: string }) {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      className={`absolute left-0 top-0 ml-10 mt-10 pl-2 ${className ? className : ''}`}
      childrenClassName="flex flex-row items-center"
      onClick={() => (url ? router.push(url) : router.back())}
    >
      <ChevronLeft className="mr-1 size-6" />
      Back to homepage
    </Button>
  );
}
