import { Button, Link as NextLink, Navbar, Switch } from '@nextui-org/react';
import React from 'react';
import { useTheme as useNextTheme } from 'next-themes';
import { useTheme } from '@nextui-org/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import User from 'components/User';

export default function Header() {
  const { setTheme } = useNextTheme();
  const { isDark } = useTheme();
  const router = useRouter();
  const { data } = useSession();

  const items = [
    { name: 'Home', url: '/', active: router.pathname === '/' },
    {
      name: 'My chat',
      url: '/app',
    },
    {
      name: 'Terms Of Uses',
      url: '/tos',
      active: router.pathname === '/tos',
    },
  ];

  return (
    <Navbar isBordered variant="sticky">
      <Navbar.Toggle showIn="xs" />
      <Navbar.Brand>
        <Link href="/" className="flex flex-row items-center">
          <Image src={`/icons/${isDark ? 'white' : 'black'}-logo.svg`} alt="" width={30} height={30} />
          <div className="ml-2 items-center font-metana text-3xl font-bold text-black dark:text-white">Lyna</div>
        </Link>
      </Navbar.Brand>
      <Navbar.Content hideIn="xs">
        {items.map((e, i) => (
          <Navbar.Link key={i} as={Link} href={e.url} isActive={e.active} activeColor="default">
            {e.name}
          </Navbar.Link>
        ))}
      </Navbar.Content>
      <Navbar.Content>
        <Navbar.Item>
          <Switch
            checked={isDark}
            onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
            // iconOn={<i className="fa-solid fa-moon text-white" />}
            // iconOff={<i className="fa-solid fa-sun text-black" />}
          />
        </Navbar.Item>
        <Navbar.Item>
          <User />
        </Navbar.Item>
      </Navbar.Content>
      <Navbar.Collapse showIn="xs">
        {items.map((e, i) => (
          <Navbar.CollapseItem key={i} activeColor="default" isActive={e.active}>
            <NextLink as={Link} color="inherit" className="min-w-full" href={e.url}>
              {e.name}
            </NextLink>
          </Navbar.CollapseItem>
        ))}
      </Navbar.Collapse>
    </Navbar>
  );
}
