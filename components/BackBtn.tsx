import Link from 'next/link';
import React from 'react';

export default function BackBtn({ url, className }: { url?: string; className?: string }) {
  return (
    <Link href={url || '/'} className={'btn absolute left-0 top-0 ml-10 mt-10 ' + className}>
      <i className="fas fa-arrow-left mr-2" /> Back to homepage
    </Link>
  );
}
