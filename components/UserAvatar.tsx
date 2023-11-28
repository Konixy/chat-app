import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { shortenName } from '@/lib/utils';
import { defaultAvatar } from './Chat/Conversations/CreateConversationModal/SearchUsersList';

export default function UserAvatar(
  Props: {
    literralName?: boolean;
    user: {
      name?: string | null;
      image?: string | null;
      username: string;
    };
  } & { className?: string },
) {
  const { user } = Props;
  return (
    <Avatar {...Props}>
      <AvatarImage src={user.image || (user.name ? undefined : defaultAvatar)} alt={user.name || user.username} />
      {user.name && <AvatarFallback>{Props.literralName ? user.name : shortenName(user.name)}</AvatarFallback>}
    </Avatar>
  );
}
