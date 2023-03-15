import { Button } from '@nextui-org/react';
import Link from 'next/link';
import React from 'react';

export default function NotFound() {
  return (
    <section className="flex h-full items-center p-16 dark:text-neutral-100">
      <div className="container mx-auto my-8 flex flex-col items-center justify-center px-5">
        <div className="max-w-md text-center">
          <h2 className="mb-8 text-9xl font-extrabold dark:text-neutral-600">
            <span className="sr-only">Error</span>404
          </h2>
          <p className="text-2xl font-semibold md:text-3xl">Sorry, we couldn&apos;t find this page.</p>
          <Button as={Link} href="/" color="gradient">
            Back to homepage
          </Button>
        </div>
      </div>
    </section>
  );
}
