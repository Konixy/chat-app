import React from 'react';

export default function SkeletonLoader({ count, height, width }: { count: number; height: number | string; width: number | string }) {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <div key={i} className={`h-${height} w-${width} skeleton rounded-md`}></div>
      ))}
    </>
  );
}
