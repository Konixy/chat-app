import Link from 'next/link';
import React from 'react';

export default function NotFound() {
  return (
    <section className="dark:text-neutral-100 flex h-full items-center p-16">
      <div className="container mx-auto my-8 flex flex-col items-center justify-center px-5">
        <div className="max-w-md text-center">
          <h2 className="dark:text-neutral-600 mb-8 text-9xl font-extrabold">
            <span className="sr-only">Error</span>404
          </h2>
          <p className="text-2xl font-semibold md:text-3xl">Sorry, we couldn&apos;t find this page.</p>
          <div className="my-10 flex justify-center">
            <Link href="/" className="btn-primary btn p-6 text-lg">
              Back to homepage
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
