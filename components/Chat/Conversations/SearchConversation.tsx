import { Input } from '@/components/ui/input';
import React, { useState } from 'react';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';

export default function SearchConversation({ isSmall, collapse }: { isSmall: boolean; collapse: () => void }) {
  const [value, setValue] = useState('');

  return isSmall ? (
    <button onClick={collapse} className="mb-4 h-9 w-9 rounded-full">
      <i className="fas fa-chevron-right" />
    </button>
  ) : (
    <div className="mb-4 flex items-center">
      <MagnifyingGlassIcon className="-mr-6 ml-2 h-4 w-4 shrink-0 opacity-50" />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search for conversation..."
        className="pl-8"
        type="search"
        autoComplete="off"
      />
    </div>
  );
}
