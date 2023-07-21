import { User } from 'lib/types';

export function formatUsernames(participants: { user: Omit<User, 'emailVerified'> }[], userId: string) {
  return participants
    .filter((e) => e.user.id !== userId)
    .map((e) => e.user.username)
    .join(', ');
}
