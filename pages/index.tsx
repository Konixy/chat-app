import { useTheme } from 'next-themes';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { ThreeDots } from 'react-loader-spinner';

export default function Home() {
  const router = useRouter();
  const { resolvedTheme: theme } = useTheme();

  useEffect(() => {
    router.replace('/app');
  }, []);
  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <ThreeDots width={50} height={50} color={theme === 'dark' ? 'white' : 'black'} />
    </div>
  );
}
