import React from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { User as UserType } from 'lib/types';
import { Dropdown, Loading, StyledLink, User } from '@nextui-org/react';
import Link from 'next/link';

export default function Index() {
  const { data } = useSession();
  return data && data.user ? (
    <>{data.user?.name}</>
  ) : data === undefined ? (
    <Loading />
  ) : (
    <StyledLink onClick={() => signIn('google')}>Sign in with Google</StyledLink>
  );
}

function UserDropdown({ user }: { user: UserType }) {
  return (
    <Dropdown placement="bottom-left">
      <Dropdown.Trigger>
        <User
          bordered
          as="button"
          size="lg"
          color="primary"
          name={user.name}
          description={user.email as string}
          {...(user.image ? { src: user.image } : { text: user.name as string })}
        />
      </Dropdown.Trigger>
      <Dropdown.Menu color="primary" aria-label="User Actions">
        <Dropdown.Section title={`Signed in as ${user.email}`}>
          <Dropdown.Button as={Link} href="/me">
            My profile
          </Dropdown.Button>
          <Dropdown.Button as={Link} href="/app">
            My conversations
          </Dropdown.Button>
        </Dropdown.Section>
        <Dropdown.Section>
          <Dropdown.Item key="settings">Settings</Dropdown.Item>
          <Dropdown.Button as="button" key="logout" color="error" onClick={() => signOut()}>
            Log Out
          </Dropdown.Button>
        </Dropdown.Section>
      </Dropdown.Menu>
    </Dropdown>
  );
}
