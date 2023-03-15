import { useRouter } from 'next/router';
import React from 'react';

export default function Index() {
  const router = useRouter();
  return <div>{router.query.userId}</div>;
}
