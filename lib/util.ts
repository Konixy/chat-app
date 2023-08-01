import React, { useEffect, useState } from 'react';
import { User } from 'lib/types';

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
