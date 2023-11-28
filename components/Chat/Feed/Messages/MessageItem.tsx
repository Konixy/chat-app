import React from 'react';
import { formatRelative } from 'date-fns';
import enUs from 'date-fns/locale/en-US';
import { MessageWithLoading } from 'lib/types';
import { defaultAvatar } from '../../Conversations/CreateConversationModal/SearchUsersList';
import { Avatar, AvatarImage } from '@/components/ui/avatar';

const formatRelativeLocale = {
  lastWeek: "eeee 'at' p",
  yesterday: "'Yersterday at' p",
  today: 'p',
  other: "MM/dd/yy 'at' p",
};

export default function MessageItem({ message, sentByMe, isGroup }: { message: MessageWithLoading; sentByMe: boolean; isGroup: boolean }) {
  return (
    <div className={`flex flex-row items-center space-x-2 break-words p-4 ${sentByMe ? 'justify-end' : 'justify-start'}`}>
      {isGroup && !sentByMe && (
        <div className="mt-6 flex h-full min-w-[40px] justify-start">
          <Avatar>
            <AvatarImage src={message.sender.image || defaultAvatar} alt={message.sender.username} width={40} height={40} />
          </Avatar>
        </div>
      )}
      <div className="flex w-full flex-col space-y-1">
        {!sentByMe && (
          <div className="flex flex-row items-center justify-start space-x-2">
            <div className="text-left font-medium">{message.sender.username}</div>
            <div className="text-sm text-zinc-400">
              {formatRelative(new Date(message.updatedAt), new Date(), {
                locale: {
                  ...enUs,
                  formatRelative: (token) => formatRelativeLocale[token as keyof typeof formatRelativeLocale],
                },
              })}
            </div>
          </div>
        )}
        <div className={`flex ${sentByMe ? 'justify-end' : 'justify-start'}`}>
          <div className={`flex w-[65%] ${sentByMe ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`${sentByMe ? `text-primary-foreground ${message.loading ? 'bg-primary/70' : 'bg-primary'}` : 'bg-muted'} ${
                message.loading && 'text-muted-foreground'
              } max-w-full rounded-lg px-2 py-1`}
            >
              {message.body}
            </div>
          </div>
        </div>
        {sentByMe && (
          <div className="flex items-center justify-end">
            <div className="text-sm text-zinc-400">
              {message.loading
                ? 'Sending...'
                : formatRelative(new Date(message.updatedAt), new Date(), {
                    locale: {
                      ...enUs,
                      formatRelative: (token) => formatRelativeLocale[token as keyof typeof formatRelativeLocale],
                    },
                  })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
