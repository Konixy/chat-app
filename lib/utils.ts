import React, { useState, useCallback } from 'react';
import { User } from 'lib/types';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatUsernames(participants: { user: Omit<User, 'emailVerified'> }[], userId: string) {
  return participants
    .filter((e) => e.user.id !== userId)
    .map((e) => e.user.username)
    .join(', ');
}

export function useLocalStorage<T>(key: string, defaultValue?: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      return defaultValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.log(error);
      return defaultValue;
    }
  });

  const setValue: React.Dispatch<React.SetStateAction<T>> = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
}

export type MapOrEntries<K, V> = Map<K, V> | [K, V][];
export type FunctionOrProperty<V> = ((prev: V | undefined) => V | undefined) | (V | undefined);

export type SetAction<K, V> = (key: K, value: FunctionOrProperty<V>) => void;

export interface Actions<K, V> {
  set: SetAction<K, V>;
  setAll: (entries: MapOrEntries<K, V>) => void;
  remove: (key: K) => void;
  reset: Map<K, V>['clear'];
}

// We hide some setters from the returned map to disable autocompletion
export type Items<K, V> = Omit<Map<K, V>, 'set' | 'clear' | 'delete'>;
export type Return<K, V> = [Items<K, V>, Actions<K, V>];

export function useMap<K, V>(initialState: MapOrEntries<K, V> = new Map()): Return<K, V> {
  const [map, setMap] = useState(new Map(initialState));

  const actions: Actions<K, V> = {
    set: useCallback((key, v) => {
      setMap((prev) => {
        const copy = new Map(prev);
        const value = v instanceof Function ? v(copy.get(key)) : v;
        value && copy.set(key, value);
        return copy;
      });
    }, []),

    setAll: useCallback((entries) => {
      setMap(() => new Map(entries));
    }, []),

    remove: useCallback((key) => {
      setMap((prev) => {
        const copy = new Map(prev);
        copy.delete(key);
        return copy;
      });
    }, []),

    reset: useCallback(() => {
      setMap(() => new Map());
    }, []),
  };

  return [map, actions];
}

export function randomNumber(min: number, max: number): number {
  return Math.round(Math.random() * (max - min) + min);
}

export function randomBoolean(): boolean {
  return Math.random() < 0.5;
}
