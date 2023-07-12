import React, { FormEvent, useEffect, useState } from 'react';
import UserOperations from 'graphql/operations/user';
import BackBtn from '../BackBtn';
import fetchQl from '@/graphql/fetch';
import Loader from '../Loader';
import { toast } from 'react-hot-toast';

export default function Auth({ reloadSession }: { reloadSession: () => void }) {
  const [username, setUsername] = useState('');
  const [isValid, validate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    if (username.match(/^(?=.{4,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/)) validate(true);
    else validate(false);
  }, [username]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isValid) return;
    setLoading(true);
    setError(undefined);
    fetchQl<{ createUsername: { success?: boolean; error?: string } }>(UserOperations.Mutations.createUsername, { variables: { username } })
      .then((r) => {
        const data = r.data.data.createUsername;
        if (data.success) {
          toast.success('Username created successfully!');
          reloadSession();
        } else {
          setLoading(false);
          toast.error(data.error as string);
        }
      })
      .catch((e) => {
        setLoading(false);
        console.log(e);
        setError(e);
      });
  }

  return (
    <>
      <BackBtn />
      <div className="h-[100vh]">
        <form
          className="absolute right-1/2 top-1/2 inline-block -translate-y-1/2 translate-x-1/2 flex-col items-center justify-center text-center"
          onSubmit={onSubmit}
        >
          <div className="text-2xl">Please enter a username</div>
          {/* <div className="text-sm">The username must be unique</div> */}
          <div className="text-red-500">{error}</div>
          <div className="relative mt-10 w-full">
            <input
              type="text"
              name="username"
              placeholder="example76"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
              className="input pl-10"
            />
            <span className="absolute inset-y-0 left-3 inline-flex items-center text-content3">
              <i className="fas fa-at" />
            </span>
          </div>
          {!isValid && <div className="form-label-alt text-red-500">Username don&apos;t match the regex</div>}
          <button type="submit" className="btn-primary btn-block btn mt-6" disabled={loading || !isValid}>
            <Loader loading={loading}>Save</Loader>
          </button>
        </form>
      </div>
    </>
  );
}
