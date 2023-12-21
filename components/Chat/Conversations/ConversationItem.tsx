/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import { formatDistance } from 'date-fns';
import { formatUsernames } from 'lib/utils';
import { Conversation } from 'lib/types';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from 'components/ui/context-menu';
import UserAvatar from '@/components/UserAvatar';

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
}: {
  userId: string;
  conversation: Conversation;
  onViewConversation: (convId: string, hasSeenAllMessages?: boolean) => void;
  onEditConversation: () => void;
  onAddParticipant: (conv: Conversation) => void;
  hasSeenAllMessages?: boolean;
  selectedConversationId?: string;
  onDeleteConversation: (conversationId: string) => void;
  onLeaveConversation: (conversationId: string) => void;
  isSmall: boolean;
}) {
  // const [menuOpen, toggleMenu] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setHover] = useState(false);
  // const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });

  const handleClick = () => {
    onViewConversation(conversation.id, hasSeenAllMessages);
  };

  const className = 'cursor-pointer transition active:scale-[.97]';

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          className={`relative flex h-20 cursor-pointer flex-row items-center rounded-md transition ${
            conversation.id === selectedConversationId ? 'bg-secondary text-foreground' : 'text-foreground/60 hover:bg-secondary/50'
          } ${isSmall ? 'w-20 justify-center' : 'justify-between p-4'}`}
          onClick={handleClick}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          {isSmall ? (
            <div
              className={`avatar avatar-lg transition ${
                !hasSeenAllMessages && `bg-transparent before:absolute before:right-0 before:h-4 before:w-4 before:rounded-full before:bg-primary`
              }`}
            >
              <UserAvatar user={conversation.participants.filter((p) => p.user.id !== userId)[0]?.user} className="h-12 w-12" />
            </div>
          ) : (
            <div className="relative mr-3 flex flex-row items-center">
              <div className={`ml-[-6px] mr-1 h-3 w-3 rounded-full bg-primary ${hasSeenAllMessages && 'opacity-0'}`}></div>

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
                  {formatUsernames(conversation.participants, userId)}
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
        <ContextMenuItem
          onClick={(event) => {
            event.stopPropagation();
            onAddParticipant(conversation);
          }}
          className={className}
        >
          <i className="fas fa-user-plus mr-3" />
          Add members
        </ContextMenuItem>
        <ContextMenuItem
          onClick={(event) => {
            event.stopPropagation();
            onEditConversation();
          }}
          className={className}
        >
          <i className="fas fa-pen mr-4" />
          Edit
        </ContextMenuItem>
        {conversation.participants.length > 2 ? (
          <ContextMenuItem
            onClick={(event) => {
              event.stopPropagation();
              onLeaveConversation(conversation.id);
            }}
            className={className}
          >
            <i className="fas fa-right-from-bracket mr-4" /> Leave
          </ContextMenuItem>
        ) : (
          <ContextMenuItem
            onClick={(event) => {
              event.stopPropagation();
              onDeleteConversation(conversation.id);
            }}
            className={className}
          >
            <i className="fas fa-trash mr-4" /> Delete
          </ContextMenuItem>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
}
