/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import { formatDistance } from 'date-fns';
import { formatUsernames } from 'lib/utils';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from 'components/ui/context-menu';
import UserAvatar from '@/components/UserAvatar';
import { LogOut, Pencil, Trash2, User, UserPlus } from 'lucide-react';
import { useRouter } from 'next/router';
import { ConversationOrFilteredConversation } from './ConversationList';
import Highlighter from 'react-highlight-words';

export default function ConversationItem({
  userId,
  conversation,
  selectedConversationId,
  hasSeenAllMessages,
  onViewConversation,
  onEditConversation,
  onAddParticipant,
  onDeleteConversation,
  onLeaveConversation,
  isSmall,
  searchQuery,
}: {
  userId: string;
  conversation: ConversationOrFilteredConversation;
  onViewConversation: (convId: string, hasSeenAllMessages?: boolean) => void;
  onEditConversation: () => void;
  onAddParticipant: (conv: ConversationOrFilteredConversation) => void;
  hasSeenAllMessages?: boolean;
  selectedConversationId?: string;
  onDeleteConversation: (conversationId: string) => void;
  onLeaveConversation: (conversationId: string) => void;
  isSmall: boolean;
  searchQuery: string;
}) {
  // const [menuOpen, toggleMenu] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setHover] = useState(false);
  // const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });
  const router = useRouter();

  const handleClick = () => {
    onViewConversation(conversation.id, hasSeenAllMessages);
  };

  const className = 'cursor-pointer transition active:scale-[.97]';

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          className={`relative flex h-20 cursor-pointer flex-row items-center transition ${
            conversation.id === selectedConversationId ? 'bg-muted text-foreground' : 'text-foreground/60 hover:bg-muted/50'
          } ${isSmall ? 'w-20 justify-center rounded-2xl' : 'justify-between rounded-md p-4'}`}
          onClick={handleClick}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          {isSmall ? (
            <div
              className={`avatar avatar-lg transition ${
                !hasSeenAllMessages && `bg-transparent before:absolute before:right-0 before:size-4 before:rounded-full before:bg-primary`
              }`}
            >
              <UserAvatar user={conversation.participants.filter((p) => p.user.id !== userId)[0]?.user} className="size-12" />
            </div>
          ) : (
            <div className="relative mr-3 flex flex-row items-center">
              <div className={`ml-[-6px] mr-1 size-3 rounded-full bg-primary ${hasSeenAllMessages && 'opacity-0'}`}></div>

              <UserAvatar
                user={
                  conversation.latestMessage && conversation.latestMessage.sender.id !== userId
                    ? conversation.latestMessage.sender
                    : conversation.participants.filter((p) => p.user.id !== userId)[0]?.user
                }
              />
            </div>
          )}

          {!isSmall && (
            <div className="flex h-full w-[85%] justify-between">
              <div className="flex h-full w-[50%] flex-col">
                <div className="overflow-hidden truncate whitespace-nowrap font-semibold text-foreground">
                  <Highlighter searchWords={[searchQuery]} textToHighlight={formatUsernames(conversation.participants, userId)} />
                </div>

                <div className="w-[140%] overflow-hidden whitespace-nowrap">
                  <div className="text-ellipsis">{conversation.latestMessage ? conversation.latestMessage.body : 'Conversation created'}</div>
                </div>
              </div>
              <div className="float-right w-full text-right text-sm">
                {formatDistance(new Date(conversation.updatedAt), new Date(), {
                  addSuffix: true,
                })}
              </div>
            </div>
          )}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        {conversation.participants.length > 2 ? (
          <ContextMenuItem
            onClick={(event) => {
              event.stopPropagation();
              onAddParticipant(conversation);
            }}
            className={className}
          >
            <UserPlus className="mr-2 size-4" />
            Add members
          </ContextMenuItem>
        ) : (
          <>
            <ContextMenuItem
              onClick={(event) => {
                event.stopPropagation();
                router.push(`/app/profile/${conversation.participants.filter((p) => p.user.id !== userId)[0]?.user.id}`);
              }}
              className={className}
            >
              <User className="mr-2 size-4" /> View profile
            </ContextMenuItem>
            <ContextMenuSeparator />
          </>
        )}
        <ContextMenuItem
          onClick={(event) => {
            event.stopPropagation();
            onEditConversation();
          }}
          className={className}
        >
          <Pencil className="mr-2 size-4" />
          Edit conversation
        </ContextMenuItem>
        {conversation.participants.length > 2 ? (
          <ContextMenuItem
            onClick={(event) => {
              event.stopPropagation();
              onLeaveConversation(conversation.id);
            }}
            className={className}
          >
            <LogOut className="mr-2 size-4" /> Leave conversation
          </ContextMenuItem>
        ) : (
          <ContextMenuItem
            onClick={(event) => {
              event.stopPropagation();
              onDeleteConversation(conversation.id);
            }}
            className={className}
          >
            <Trash2 className="mr-2 size-4" /> Delete conversation
          </ContextMenuItem>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
}
