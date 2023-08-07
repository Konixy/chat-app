import React, { useEffect, useState } from 'react';
import { randomNumber } from 'lib/util';

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
          <div className="skeleton-static h-7 w-7 rounded-lg"></div>
        </div>
      ) : (
        <div className="mb-4 h-10 w-full rounded-xl bg-gray-3"></div>
      )}
      {items.map((e, i) =>
        isSmall ? (
          <div key={i} className="flex h-20 w-20 items-center justify-center">
            <div className="skeleton-static mx-3 h-12 w-12 rounded-full"></div>
          </div>
        ) : (
          <div key={i} className="flex w-full flex-row items-center justify-between p-4">
            <div className="skeleton-static mx-3 h-12 w-12 rounded-full"></div>
            <div className="flex w-[72%] flex-row items-center justify-between">
              <div className="flex h-full w-[50%] flex-col space-y-2">
                <div className="skeleton-static h-5 rounded-lg" style={{ width: `${e.firstFieldWidth}px` }}></div>
                <div className="skeleton-static h-5 rounded-lg" style={{ width: `${e.secondFieldWidth}px` }}></div>
              </div>
              <div className="flex h-full items-center">
                <div className="skeleton-static h-5 w-20 rounded-lg"></div>
              </div>
            </div>
          </div>
        ),
      )}
    </div>
  );
}
