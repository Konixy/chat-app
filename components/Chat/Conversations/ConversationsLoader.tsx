import React, { useEffect, useState } from 'react';
import { randomNumber } from 'lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

type LoaderItem = {
  firstFieldWidth: number;
  secondFieldWidth: number;
};

export default function ConversationsLoader({ isSmall }: { isSmall: boolean }) {
  const [items, setItems] = useState<LoaderItem[]>([]);

  function addItem(item: LoaderItem) {
    setItems((prev) => [...prev, item]);
  }

  useEffect(() => {
    for (let i = 0; i < 6; i++) {
      addItem({
        firstFieldWidth: randomNumber(56, 128),
        secondFieldWidth: randomNumber(72, 120),
      });
    }
    return () => {
      setItems([]);
    };
  }, []);

  return (
    <div className="w-full">
      {isSmall ? (
        <div className="mb-7 flex w-full justify-center">
          <Skeleton className="h-7 w-7 rounded-lg"></Skeleton>
        </div>
      ) : (
        <div className="mb-4 h-10 w-full rounded-xl bg-primary/30"></div>
      )}
      {items.map((e, i) =>
        isSmall ? (
          <div key={i} className="flex h-20 w-20 items-center justify-center">
            <Skeleton className="mx-3 h-12 w-12 rounded-full"></Skeleton>
          </div>
        ) : (
          <div key={i} className="flex w-full flex-row items-center justify-between p-4">
            <Skeleton className="mx-3 h-12 w-12 rounded-full"></Skeleton>
            <div className="flex w-[72%] flex-row items-center justify-between">
              <div className="flex h-full w-[50%] flex-col space-y-2">
                <Skeleton className="h-5 rounded-lg" style={{ width: `${e.firstFieldWidth}px` }}></Skeleton>
                <Skeleton className="h-5 rounded-lg" style={{ width: `${e.secondFieldWidth}px` }}></Skeleton>
              </div>
              <div className="flex h-full items-center">
                <Skeleton className="h-5 w-20 rounded-lg"></Skeleton>
              </div>
            </div>
          </div>
        ),
      )}
    </div>
  );
}
