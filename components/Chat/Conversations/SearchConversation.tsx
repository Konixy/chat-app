import { Input } from '@/components/ui/input';
import React, { useState } from 'react';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { ChevronRight } from 'lucide-react';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

export default function SearchConversation({ isSmall, collapse }: { isSmall: boolean; collapse: () => void }) {
  const [value, setValue] = useState('');

  return isSmall ? (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button onClick={collapse} className="mb-4 flex size-9 flex-row items-center justify-center rounded-full">
            <ChevronRight />
          </button>
        </TooltipTrigger>
        <TooltipContent className="bg-secondary-foreground text-foreground">Open sidebar</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : (
    <div className="mb-4 flex items-center">
      <MagnifyingGlassIcon className="-mr-6 ml-2 size-4 shrink-0 opacity-50" />
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
