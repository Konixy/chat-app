import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import User from 'components/User';

export default function Header() {
  const router = useRouter();
  const { data } = useSession();
  const isDark = true;

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
    <div className="navbar">
      <div className="navbar-start">
        <Link href="/" className="flex flex-row items-center">
          <Image src={`/icons/${isDark ? 'white' : 'black'}-logo.svg`} alt="" width={30} height={30} />
          <div className="ml-2 items-center font-metana text-3xl font-bold text-black dark:text-white">Lyna</div>
        </Link>
      </div>
      <div className="navbar-center">
        {items.map((e, i) => (
          <Link key={i} className="navbar-item" href={e.url}>
            {e.name}
          </Link>
        ))}
      </div>
      <div className="navbar-end">
        <div className="avatar-ring avatar avatar-md">
          <div className="dropdown-container">
            <div className="dropdown">
              <label className="btn-ghost btn flex cursor-pointer px-0" tabIndex="0" htmlFor="usr-drop">
                <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="avatar" />
              </label>
              <div id="usr-drop" className="dropdown-menu-bottom-left dropdown-menu">
                <a className="dropdown-item text-sm">Profile</a>
                <a tabIndex="-1" className="dropdown-item text-sm">
                  Account settings
                </a>
                <a tabIndex="-1" className="dropdown-item text-sm">
                  Log out
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    // <Navbar isBordered variant="sticky">
    //   <Navbar.Toggle showIn="xs" />
    //   <Navbar.Brand>
    //     <Link href="/" className="flex flex-row items-center">
    //       <Image src={`/icons/${isDark ? 'white' : 'black'}-logo.svg`} alt="" width={30} height={30} />
    //       <div className="ml-2 items-center font-metana text-3xl font-bold text-black dark:text-white">Lyna</div>
    //     </Link>
    //   </Navbar.Brand>
    //   <Navbar.Content hideIn="xs">
    // {items.map((e, i) => (
    //   <Navbar.Link key={i} as={Link} href={e.url} isActive={e.active} activeColor="default">
    //     {e.name}
    //   </Navbar.Link>
    // ))}
    //   </Navbar.Content>
    //   <Navbar.Content>
    //     <Navbar.Item>
    //       <Switch
    //         checked={isDark}
    //         onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
    //         // iconOn={<i className="fa-solid fa-moon text-white" />}
    //         // iconOff={<i className="fa-solid fa-sun text-black" />}
    //       />
    //     </Navbar.Item>
    //     <Navbar.Item>
    //       <User />
    //     </Navbar.Item>
    //   </Navbar.Content>
    //   <Navbar.Collapse showIn="xs">
    //     {items.map((e, i) => (
    //       <Navbar.CollapseItem key={i} activeColor="default" isActive={e.active}>
    //         <NextLink as={Link} color="inherit" className="min-w-full" href={e.url}>
    //           {e.name}
    //         </NextLink>
    //       </Navbar.CollapseItem>
    //     ))}
    //   </Navbar.Collapse>
    // </Navbar>
  );
}
