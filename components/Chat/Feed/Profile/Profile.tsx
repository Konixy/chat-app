import React from 'react';

export default function Profile({ profileUserId, userId }: { profileUserId: string; userId: string }) {
  return (
    <div>
      Profile of: {profileUserId}
      <br />
      {userId}
    </div>
  );
}
