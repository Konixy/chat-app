/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import { formatDistance } from 'date-fns';
import { formatUsernames } from 'lib/utils';
import { Conversation } from 'lib/types';
import Image from 'next/image';
import { defaultAvatar } from './Modal/SearchUsersList';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from 'components/ui/context-menu';

export default function ConversationItem({
  userId,
  conversation,
  selectedConversationId,
  hasSeenAllMessages,
  onViewConversation,
  onEditConversation,
  onDeleteConversation,
  onLeaveConversation,
  isSmall,
}: {
  userId: string;
  conversation: Conversation;
  onViewConversation: (convId: string, hasSeenAllMessages?: boolean) => void;
  onEditConversation: () => void;
  hasSeenAllMessages?: boolean;
  selectedConversationId?: string;
  onDeleteConversation: (conversationId: string) => void;
  onLeaveConversation: (conversation: Conversation) => void;
  isSmall: boolean;
}) {
  // const [menuOpen, toggleMenu] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setHover] = useState(false);
  // const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });

  const handleClick = () => {
    onViewConversation(conversation.id, hasSeenAllMessages);
  };

  const className = 'flex w-full cursor-pointer flex-row items-center rounded-md p-2 transition hover:bg-gray-5 active:scale-[.97] active:bg-gray-5';

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          className={`relative flex h-20 cursor-pointer flex-row items-center rounded-md transition ${
            conversation.id === selectedConversationId ? 'bg-primary text-blue-200' : 'hover:bg-gray-3 text-zinc-300'
          } ${isSmall ? 'w-20 justify-center' : 'justify-between p-4'}`}
          onClick={handleClick}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          {isSmall ? (
            <div
              className={`avatar avatar-lg transition ${
                !hasSeenAllMessages &&
                `bg-transparent before:absolute before:right-0 before:h-4 before:w-4 before:rounded-full before:bg-primary ${
                  selectedConversationId === conversation.id && 'before:opacity-0'
                }`
              }`}
            >
              <Image src={conversation.participants.filter((p) => p.user.id !== userId)[0]?.user.image || defaultAvatar} alt="avatar" width={48} height={48} />
            </div>
          ) : (
            <div className="relative mr-3 flex flex-row items-center">
              <div className={`dot dot-primary ml-[-6px] ${hasSeenAllMessages && 'opacity-0'}`}></div>

              {conversation.participants.length > 2 ? (
                <div className="avatar-group">
                  <div className="avatar ml-2 ring-0">
                    <Image
                      src={conversation.participants.filter((p) => p.user.id !== userId)[0]?.user.image || defaultAvatar}
                      alt="avatar"
                      width={48}
                      height={48}
                    />
                  </div>
                  <div className={`${conversation.participants.length > 4 ? '-ml-8' : '-ml-6'} avatar ring-0`}>
                    <Image
                      src={conversation.participants.filter((p) => p.user.id !== userId)[1]?.user.image || defaultAvatar}
                      alt="avatar"
                      width={48}
                      height={48}
                    />
                  </div>
                  {conversation.participants.length > 4 && (
                    <div className="avatar -ml-8 ring-0">
                      <div className="text-lg font-semibold">+{conversation.participants.length - 3}</div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="avatar avatar-lg ml-2">
                  <Image
                    src={conversation.participants.filter((p) => p.user.id !== userId)[0]?.user.image || defaultAvatar}
                    alt="avatar"
                    width={48}
                    height={48}
                  />
                </div>
              )}
            </div>
          )}

          {!isSmall && (
            <div className="flex h-full w-[72%] justify-between">
              <div className="flex h-full w-[50%] flex-col">
                <div className="overflow-hidden truncate whitespace-nowrap font-semibold text-white">{formatUsernames(conversation.participants, userId)}</div>

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
            onEditConversation();
          }}
          className={className}
        >
          <i className="fas fa-pen mr-2" />
          Edit
        </ContextMenuItem>
        {conversation.participants.length > 2 ? (
          <ContextMenuItem
            onClick={(event) => {
              event.stopPropagation();
              onLeaveConversation(conversation);
            }}
            className={className}
          >
            <i className="fas fa-right-from-bracket mr-2" /> Leave
          </ContextMenuItem>
        ) : (
          <ContextMenuItem
            onClick={(event) => {
              event.stopPropagation();
              onDeleteConversation(conversation.id);
            }}
            className={className}
          >
            <i className="fas fa-trash mr-2" /> Delete
          </ContextMenuItem>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
}
