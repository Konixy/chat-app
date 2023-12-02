import { Input } from '@/components/ui/input';
import React, { useState } from 'react';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';

export default function SearchConversation() {
  const [value, setValue] = useState('');
  return (
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
