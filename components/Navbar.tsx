import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { defaultAvatar } from './Chat/Conversations/Modal/SearchUsersList';

export default function Navbar() {
  const router = useRouter();
  const { data: session } = useSession();

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
    <div>
      <div className="navbar-no-boxShadow navbar m-6">
        <div className="navbar-start">
          <Link href="/" className="flex flex-row items-center">
            <Image src={`/icons/white-logo.svg`} alt="" width={30} height={30} />
            <div className="ml-2 items-center font-metana text-3xl font-bold">Lyna</div>
          </Link>
        </div>
        <div className="navbar-center">
          {items.map((e, i) => (
            <Link key={i} className="navbar-item" href={e.url}>
              {e.name}
            </Link>
          ))}
        </div>
        <div className="navbar-end mr-10">
          {session?.user ? (
            <div className="dropdown-container">
              <div className="dropdown">
                <div className="btn-ghost btn" tabIndex={0}>
                  <div className="mr-2">{session.user.name}</div>
                    <div className="avatar-ring avatar avatar-sm">
                      <Image src={session.user.image || defaultAvatar} alt="avatar" className="" width={45} height={45} />
                    </div>
                </div>
                <div className="dropdown-menu-bottom-left dropdown-menu gap-2">
                  <Link href="/app/me" className="dropdown-item text-sm">
                    Profile
                  </Link>
                  <div className="dropdown-divider" role="separator"></div>
                  <Link href="/account/settings" className="dropdown-item text-sm">
                    Account settings
                  </Link>
                  <button
                    className="dropdown-item flex flex-row items-center bg-error/25 px-3 text-sm font-semibold transition-all hover:bg-error/50"
                    onClick={() => {
                      signOut({ redirect: true, callbackUrl: '/login' }).then(() => {
                        toast.success('Successfully logged out.');
                      });
                    }}
                  >
                    <i className="fas fa-right-from-bracket mr-2" /> Log out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <Link href="/login" className="btn-primary btn">
                Sign up
              </Link>
            </div>
          )}
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
