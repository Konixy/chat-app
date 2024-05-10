import { Input } from '@/components/ui/input';
import React from 'react';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

export default function SearchConversation({
  isSmall,
  collapse,
  searchQuery,
  setSearchQuery,
}: {
  isSmall: boolean;
  collapse: (state?: boolean) => void;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}) {
  return isSmall ? (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button onClick={() => collapse(false)} className="mb-4 flex size-9 flex-row items-center justify-center rounded-full">
            <ChevronRight className="text-card-foreground transition-colors hover:text-foreground" />
          </button>
        </TooltipTrigger>
        <TooltipContent className="bg-secondary text-foreground dark:bg-secondary-foreground">Open sidebar</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : (
    <div className="mb-4 ml-6 flex items-center">
      <MagnifyingGlassIcon className="-mr-6 ml-2 size-4 shrink-0 opacity-50" />
      <Input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search for conversation..."
        className="pl-8"
        type="search"
        autoComplete="off"
      />
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button onClick={() => collapse(true)} className="ml-2 flex size-6 flex-row items-center justify-center">
              <ChevronLeft className="text-card-foreground transition-colors hover:text-foreground" />
            </button>
          </TooltipTrigger>
          <TooltipContent className="bg-secondary text-foreground dark:bg-secondary-foreground">Minimize sidebar</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
