/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { FormEvent, useState } from 'react';
import fetchQl from 'graphql/fetch';
import UserOperations from 'graphql/operations/user';
import Loader from 'components/Loader';
import SearchUsersList from './SearchUsersList';
import { toast } from 'react-hot-toast';
import { User } from '@prisma/client';

export type Data = Pick<User, 'id' | 'username' | 'name'>;

export default function Modal({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (state: boolean) => void }) {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Data[] | undefined>();

  function onSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    fetchQl<{ searchUsers: Data[] }>(UserOperations.Queries.searchUsers, { variables: { query: value } })
      .then((r) => {
        const data = r.data.data.searchUsers;
        console.log(data);
        setData(data);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
        toast.error(e.message);
      });
  }

  return (
    <>
      <input type="checkbox" className="display-none modal-state" checked={isOpen} id="conversation-modal" readOnly />
      <div className="modal">
        <span className="modal-overlay" onClick={() => setIsOpen(false)} />
        <div className="modal-content flex w-96 flex-col gap-5">
          <button className="btn-sm btn-circle btn-ghost btn absolute right-2 top-2" onClick={() => setIsOpen(false)}>
            ✕
          </button>
          <div className="text-xl">Search</div>
          <form className="flex flex-col gap-4" onSubmit={onSearch}>
            <div className="relative w-full">
              <span className="absolute inset-y-0 left-3 inline-flex items-center text-content3">
                <i className="fas fa-magnifying-glass" />
              </span>
              <input
                className="input pl-10"
                type="search"
                name="search"
                placeholder="Search for a user or a group"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                autoComplete="off"
                disabled={loading}
              />
            </div>
            {data && (data.length > 0 ? <SearchUsersList users={data} /> : <>Aucun résultat</>)}

            <button className="btn-primary btn-block btn" type="submit" disabled={!value || loading}>
              <Loader loading={loading}>Go</Loader>
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
