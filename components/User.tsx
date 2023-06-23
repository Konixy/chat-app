import React from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { User as UserType } from 'next-auth/core/types';

export default function Index() {
  const { data } = useSession();
  return data && data.user ? (
    <UserDropdown user={data.user} />
  ) : data === undefined ? (
    <>Loading...</>
  ) : (
    <button onClick={() => signIn('google')}>Sign in with Google</button>
  );
}

function UserDropdown({ user }: { user: UserType }) {
  return (
    <>{user.name}</>
    // <Dropdown placement="bottom-left">
    //   <Dropdown.Trigger>
    //     <User as="button" size="lg" color="primary" name={user.username} description={user.username as string} src={user.image as string} />
    //   </Dropdown.Trigger>
    //   <Dropdown.Menu color="primary" aria-label="User Actions">
    //     <Dropdown.Section title={`Signed in as ${user.email}`}>
    //       <Dropdown.Item>My profile</Dropdown.Item>
    //       <Dropdown.Item>My conversations</Dropdown.Item>
    //     </Dropdown.Section>
    //     <Dropdown.Section>
    //       <Dropdown.Item>test</Dropdown.Item>
    //       <Dropdown.Item key="settings">Settings</Dropdown.Item>
    //       <Dropdown.Item key="logout" color="error">
    //         Log Out
    //       </Dropdown.Item>
    //     </Dropdown.Section>
    //   </Dropdown.Menu>
    // </Dropdown>
  );
}
