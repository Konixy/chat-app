import React from 'react';
import { LoaderCircle, LucideProps } from 'lucide-react';

export default function Spinner(props: LucideProps) {
  return <LoaderCircle className="size-5 animate-spin" {...props} />;
}
