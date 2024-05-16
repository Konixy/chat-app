import { Button } from '@/components/ui/button';
import { useRouter } from 'next/router';
import React from 'react';

export default function NotFound() {
  const router = useRouter();
  return (
    <section className="flex h-full items-center p-16">
      <div className="mx-auto my-8 flex flex-col items-center justify-center px-5">
        <div className="max-w-md text-center">
          <h2 className="mb-8 text-9xl font-extrabold text-muted-foreground">
            <span className="sr-only">Error</span>404
          </h2>
          <p className="text-2xl font-semibold md:text-3xl">Sorry, we couldn&apos;t find this page.</p>
          <div className="my-10 flex justify-center">
            <Button className="p-6 text-lg" onClick={() => router.push('/')}>
              Back to homepage
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
