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
}: {
  userId: string;
  conversation: Conversation;
  onClick: (convId: string) => void;
  onEditConversation?: () => void;
  hasSeenAllMessages?: boolean;
  selectedConversationId?: string;
  onDeleteConversation?: (conversationId: string) => void;
  onLeaveConversation?: (conversation: Conversation) => void;
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

  const menuItemClassName = 'flex w-full cursor-pointer flex-row items-center rounded-md p-2 transition hover:bg-gray-5 active:scale-[.97] active:bg-gray-5';

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
            className={menuItemClassName}
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
              className={menuItemClassName}
            >
              <i className="fas fa-right-from-bracket mr-2" /> Leave
            </MenuItem>
          ) : (
            <MenuItem
              onClick={(event) => {
                event.stopPropagation = true;
                onDeleteConversation(conversation.id);
              }}
              className={menuItemClassName}
            >
              <i className="fas fa-trash mr-2" /> Delete
            </MenuItem>
          )}
        </ControlledMenu>
      )}
      <div
        className={`flex cursor-pointer flex-row items-center justify-between rounded-md p-4 ${
          conversation.id === selectedConversationId && 'bg-gray-3'
        } relative transition hover:bg-gray-4`}
        onClick={handleClick}
        onContextMenu={handleClick}
      >
        <div className="relative mr-3 flex flex-row items-center">
          <div className={`dot dot-primary ml-[-6px] ${hasSeenAllMessages && 'opacity-0'}`}></div>
          {conversation.participants.length > 2 ? (
            <div className="avatar-group">
              <div className="avatar ml-2">
                <Image src={conversation.participants.filter((p) => p.userId !== userId)[0]?.user.image || defaultAvatar} alt="avatar" width={40} height={40} />
              </div>
              <div className={`-ml-${conversation.participants.length > 4 ? '6' : '4'} avatar`}>
                <Image src={conversation.participants.filter((p) => p.userId !== userId)[1]?.user.image || defaultAvatar} alt="avatar" width={40} height={40} />
              </div>
              {conversation.participants.length > 4 && (
                <div className="avatar -ml-6">
                  <div className="text-lg font-semibold">+{conversation.participants.length - 3}</div>
                </div>
              )}
            </div>
          ) : (
            <div className="avatar-ring avatar ml-2">
              <Image src={conversation.participants.filter((p) => p.userId !== userId)[0]?.user.image || defaultAvatar} alt="avatar" width={40} height={40} />
            </div>
          )}
        </div>

        <div className="flex h-full w-[72%] justify-between">
          <div className="flex h-full w-[50%] flex-col">
            <div className="overflow-hidden truncate whitespace-nowrap font-semibold">{formatUsernames(conversation.participants, userId)}</div>
            {conversation.latestMessage && (
              <div className="w-[140%] overflow-hidden whitespace-nowrap">
                <div className="text-ellipsis text-zinc-300">{conversation.latestMessage.body}</div>
              </div>
            )}
          </div>
          <div className="float-right w-full text-right text-sm text-zinc-300">
            {formatDistance(new Date(conversation.updatedAt), new Date(), {
              addSuffix: true,
              // locale: {
              //   ...enUS,
              //   formatRelative: (token) => formatRelativeLocale[token as keyof typeof formatRelativeLocale],
              // },
            })}
          </div>
        </div>
      </div>
    </>
  );
}

// export default function ConversationItem({ conversation, userId }: { conversation: Conversation; userId: string }) {
//   return (
//     <Link href={`/app/${conversation.id}`} className="relative flex rounded-md p-4 hover:bg-gray-3">
//       {conversation.participants
//         .filter((e) => e.user.id !== userId)
//         .map((e) => e.user.username)
//         .join(', ')}
//     </Link>
//   );
// }
