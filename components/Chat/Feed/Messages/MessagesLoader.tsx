import { Skeleton } from '@/components/ui/skeleton';
import { randomBoolean, randomNumber } from 'lib/utils';
import React, { useEffect, useState } from 'react';

type LoaderItem = {
  firstFieldWidth: number;
  bodyWidth: number;
  bodyLines: number;
  left: boolean;
};

export default function MessagesLoader({ isGroup }: { isGroup: boolean }) {
  const [items, setItems] = useState<LoaderItem[]>([]);
  const [maxWidth, setMaxWidth] = useState<number>(((document.querySelector('#loader-container') as HTMLDivElement | undefined)?.offsetWidth || 400) * 0.65);

  function addItem(item: LoaderItem) {
    setItems((prev) => [...prev, item]);
  }

  useEffect(() => {
    for (let i = 0; i < 20; i++) {
      const isLeft = randomBoolean();
      const bodyLines = randomBoolean() ? randomNumber(2, 5) : 1;
      addItem({
        left: isLeft,
        firstFieldWidth: randomNumber(40, isLeft ? 100 : 100),
        bodyWidth: bodyLines > 1 ? maxWidth : randomNumber(40, maxWidth),
        bodyLines,
      });
    }
    return () => {
      setItems([]);
    };
  }, [maxWidth]);

  useEffect(() => {
    setMaxWidth(((document.querySelector('#loader-container') as HTMLDivElement | undefined)?.offsetWidth || 400) * 0.65);
  }, [window.innerWidth]);

  return (
    <div id="loader-container" className="mx-4 flex h-full flex-col-reverse space-y-4 space-y-reverse overflow-y-hidden">
      {items.map((e, i) => (
        <div key={i} className={`flex w-full space-x-2 ${e.left ? 'justify-start' : 'justify-end'}`}>
          {isGroup && e.left && <Skeleton className="h-10 w-10 rounded-full"></Skeleton>}
          <div className={`flex ${e.left ? 'flex-col items-start' : 'flex-col-reverse items-end space-y-reverse'} space-y-2`}>
            <Skeleton className="h-5 rounded-lg" style={{ width: `${e.firstFieldWidth}px` }}></Skeleton>
            <Skeleton className="rounded-lg" style={{ height: `${e.bodyLines * 24}px`, width: `${e.bodyWidth}px` }}></Skeleton>
          </div>
        </div>
      ))}
    </div>
  );
}
