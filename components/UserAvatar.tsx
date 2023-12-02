import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { shortenName } from '@/lib/utils';

export const defaultAvatar = '/icons/defaultAvatar.jpg';

export default function UserAvatar(
  Props: {
    literralName?: boolean;
    user: {
      name?: string | null;
      image?: string | null;
      username?: string | null;
    };
  } & { className?: string },
) {
  const { user } = Props;
  return (
    <Avatar {...Props}>
      <AvatarImage src={user.image || (user.name ? undefined : defaultAvatar)} alt={user.name || user.username || 'avatar'} />
      {user.name && <AvatarFallback>{Props.literralName ? user.name : shortenName(user.name)}</AvatarFallback>}
    </Avatar>
  );
}
