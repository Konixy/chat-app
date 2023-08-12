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
      <div className="navbar navbar-no-boxShadow m-6">
        <div className="navbar-start">
          <Link href="/" className="flex flex-row items-center">
            <Image src={`/icons/white-logo.svg`} alt="" width={30} height={30} />
            <div className="font-metana ml-2 items-center text-3xl font-bold">Lyna</div>
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
                <div className="btn btn-ghost" tabIndex={0}>
                  <div className="mr-2">{session.user.name}</div>
                  <div className="avatar avatar-ring avatar-sm">
                    <Image src={session.user.image || defaultAvatar} alt="avatar" className="" width={45} height={45} />
                  </div>
                </div>
                <div className="dropdown-menu dropdown-menu-bottom-left gap-2">
                  <Link href="/app/me" className="dropdown-item text-sm">
                    Profile
                  </Link>
                  <div className="dropdown-divider" role="separator"></div>
                  <Link href="/app/settings" className="dropdown-item text-sm">
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
                    <i className="fas fa-right-from-bracket mr-2 translate-y-[1px]" />
                    <div> Log out</div>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <Link href="/login" className="btn btn-primary">
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
