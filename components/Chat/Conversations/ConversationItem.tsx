/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import { formatDistance } from 'date-fns';
import { formatUsernames } from 'lib/util';
import { Conversation } from 'lib/types';
import { ControlledMenu, MenuItem } from '@szhsin/react-menu';
import Image from 'next/image';
import { defaultAvatar } from './Modal/SearchUsersList';
// import '@szhsin/react-menu/dist/index.css';

export default function ConversationItem({
  userId,
  conversation,
  selectedConversationId,
  hasSeenAllMessages,
  onClick,
  onEditConversation,
  onDeleteConversation,
  onLeaveConversation,
  isSmall,
}: {
  userId: string;
  conversation: Conversation;
  onClick: (convId: string) => void;
  onEditConversation?: () => void;
  hasSeenAllMessages?: boolean;
  selectedConversationId?: string;
  onDeleteConversation?: (conversationId: string) => void;
  onLeaveConversation?: (conversation: Conversation) => void;
  isSmall: boolean;
}) {
  const [menuOpen, toggleMenu] = useState(false);
  const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });

  const handleClick = (event: React.MouseEvent) => {
    if (event.type === 'click') {
      onClick(conversation.id);
    } else if (event.type === 'contextmenu') {
      event.preventDefault();
      setAnchorPoint({ x: event.clientX, y: event.clientY });
      toggleMenu(true);
    }
  };

  const showMenu = onEditConversation && onDeleteConversation && onLeaveConversation;

  const className = 'flex w-full cursor-pointer flex-row items-center rounded-md p-2 transition hover:bg-gray-5 active:scale-[.97] active:bg-gray-5';

  return (
    <>
      {showMenu && (
        <ControlledMenu
          anchorPoint={anchorPoint}
          state={menuOpen ? 'open' : 'closed'}
          onClose={() => toggleMenu(false)}
          direction="right"
          onMouseOver={(e) => e.stopPropagation()}
          menuClassName="z-50 box-border min-w-[9rem] select-none rounded-xl bg-gray-4 p-2 text-sm shadow-2xl shadow-[rgba(0,0,0,0.25)] focus:outline-none"
        >
          <MenuItem
            onClick={(event) => {
              event.stopPropagation = true;
              onEditConversation();
            }}
            className={className}
          >
            <i className="fas fa-pen mr-2" />
            Edit
          </MenuItem>
          {conversation.participants.length > 2 ? (
            <MenuItem
              onClick={(event) => {
                event.stopPropagation = true;
                onLeaveConversation(conversation);
              }}
              className={className}
            >
              <i className="fas fa-right-from-bracket mr-2" /> Leave
            </MenuItem>
          ) : (
            <MenuItem
              onClick={(event) => {
                event.stopPropagation = true;
                onDeleteConversation(conversation.id);
              }}
              className={className}
            >
              <i className="fas fa-trash mr-2" /> Delete
            </MenuItem>
          )}
        </ControlledMenu>
      )}
      {/* <div
          className={`flex h-[76px] w-full cursor-pointer flex-row items-center rounded-lg text-center transition ${
            conversation.id === selectedConversationId ? 'bg-primary' : 'hover:bg-gray-3'
          }`}
          onClick={handleClick}
          onContextMenu={handleClick}
        >
          <div className="w-full">
            <div className="avatar">
              <Image src={conversation.participants.filter((p) => p.userId !== userId)[0]?.user.image || defaultAvatar} alt="avatar" width={48} height={48} />
            </div>
          </div>
        </div> */}
      <div
        className={`relative flex h-[80px] cursor-pointer flex-row items-center rounded-md transition ${
          conversation.id === selectedConversationId ? 'bg-primary text-blue-200' : 'text-zinc-300 hover:bg-gray-3'
        } ${isSmall ? 'w-[80px] justify-center' : 'justify-between p-4'}`}
        onClick={handleClick}
        onContextMenu={handleClick}
      >
        {isSmall ? (
          <div
            className={`avatar avatar-lg transition-all ${
              hasSeenAllMessages &&
              `bg-transparent before:absolute before:right-0 before:h-4 before:w-4 before:rounded-full before:bg-primary ${
                selectedConversationId === conversation.id && 'before:opacity-0'
              }`
            }`}
          >
            <Image src={conversation.participants.filter((p) => p.userId !== userId)[0]?.user.image || defaultAvatar} alt="avatar" width={48} height={48} />
          </div>
        ) : (
          <div className="relative mr-3 flex flex-row items-center">
            <div className={`dot dot-primary ml-[-6px] ${hasSeenAllMessages && 'opacity-0'}`}></div>

            {conversation.participants.length > 2 ? (
              <div className="avatar-group">
                <div className="avatar ml-2 ring-0">
                  <Image
                    src={conversation.participants.filter((p) => p.userId !== userId)[0]?.user.image || defaultAvatar}
                    alt="avatar"
                    width={48}
                    height={48}
                  />
                </div>
                <div className={`-ml-${conversation.participants.length > 4 ? '8' : '6'} avatar ring-0`}>
                  <Image
                    src={conversation.participants.filter((p) => p.userId !== userId)[1]?.user.image || defaultAvatar}
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
                <Image src={conversation.participants.filter((p) => p.userId !== userId)[0]?.user.image || defaultAvatar} alt="avatar" width={48} height={48} />
              </div>
            )}
          </div>
        )}

        {!isSmall && (
          <div className="flex h-full w-[72%] justify-between">
            <div className="flex h-full w-[50%] flex-col">
              <div className="overflow-hidden truncate whitespace-nowrap font-semibold text-white">{formatUsernames(conversation.participants, userId)}</div>
              {conversation.latestMessage && (
                <div className="w-[140%] overflow-hidden whitespace-nowrap">
                  <div className="text-ellipsis">{conversation.latestMessage.body}</div>
                </div>
              )}
            </div>
            <div className="float-right w-full text-right text-sm">
              {formatDistance(new Date(conversation.updatedAt), new Date(), {
                addSuffix: true,
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
