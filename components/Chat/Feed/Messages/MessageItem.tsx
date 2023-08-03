import React from 'react';
import { Message } from 'lib/types';
import { formatRelative } from 'date-fns';
import fr from 'date-fns/locale/fr';

const formatRelativeLocale = {
  lastWeek: "eeee 'at' p",
  yesterday: "'Yersterday at' p",
  today: 'p',
  other: "MM/dd/yy 'at' p",
};

export default function MessageItem({ message, sentByMe, isGroup }: { message: Message & { loading?: boolean }; sentByMe: boolean; isGroup: boolean }) {
  return (
    <div className={`flex flex-row items-center space-x-2 break-words p-4 ${sentByMe ? 'justify-end' : 'justify-start'} `}>
      {isGroup && !sentByMe && <div className="flex-end avatar flex"></div>}
      <div className="flex w-full flex-col space-y-1">
        {!sentByMe && (
          <div className="flex flex-row items-center justify-start space-x-2">
            <div className="text-left font-medium">{message.sender.username}</div>
            <div className="text-sm text-zinc-400">
              {formatRelative(new Date(message.updatedAt), new Date(), {
                locale: {
                  ...fr,
                  formatRelative: (token) => formatRelativeLocale[token as keyof typeof formatRelativeLocale],
                },
              })}
            </div>
          </div>
        )}
        <div className={`flex ${sentByMe ? 'justify-end' : 'justify-start'}`}>
          <div
            className={`${sentByMe ? (message.loading ? 'bg-blue-8' : 'bg-primary') : 'bg-gray-4'} ${
              message.loading ? 'text-zinc-400' : 'text-white'
            } max-w-[65%] rounded-xl px-2 py-1`}
          >
            {message.body}
          </div>
        </div>
        {sentByMe && (
          <div className="flex items-center justify-end">
            <div className="text-sm text-zinc-400">
              {message.loading
                ? 'Sending...'
                : formatRelative(new Date(message.updatedAt), new Date(), {
                    locale: {
                      ...fr,
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
