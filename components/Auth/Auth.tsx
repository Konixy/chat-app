import React, { FormEvent, useEffect, useState } from 'react';
import UserOperations from 'graphql/operations/user';
import BackBtn from '../BackBtn';
import { toast } from 'react-hot-toast';
import { useMutation } from '@apollo/client';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { AtSign } from 'lucide-react';

export default function Auth({ reloadSession }: { reloadSession: () => void }) {
  const [username, setUsername] = useState('');
  const [isValid, validate] = useState(false);
  const [createUsernameMutation, { loading }] = useMutation<{ createUsername: { success?: boolean; error?: string } }, { username: string }>(
    UserOperations.Mutations.createUsername,
  );

  useEffect(() => {
    if (username.match(/^(?=.{4,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/)) validate(true);
    else validate(false);
  }, [username]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isValid) return;
    createUsernameMutation({ variables: { username } })
      .then((r) => {
        if (r.errors) {
          toast.error(r.errors[0].message);
          console.log(r.errors);
        } else if (r.data) {
          const data = r.data.createUsername;
          if (data.success) {
            toast.success('Username created successfully!');
            reloadSession();
          } else {
            toast.error(data.error as string);
          }
        }
      })
      .catch((e) => {
        console.log(e);
        toast.error(e);
      });
  }

  return (
    <>
      <BackBtn url="/" />
      <div className="h-[100vh]">
        <form
          className="absolute right-1/2 top-1/2 flex -translate-y-1/2 translate-x-1/2 flex-col items-center justify-center gap-14 text-center"
          onSubmit={onSubmit}
        >
          <div className="text-2xl">Please enter a username</div>
          {/* <div className="text-sm">The username must be unique</div> */}
          <div className="relative w-full">
            <Input
              type="text"
              name="username"
              placeholder="johndoe"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
              disabled={loading}
              className={`input pl-9 ${!isValid && username !== '' ? 'border-destructive focus-visible:ring-destructive' : ''}`}
            />
            <span className="absolute inset-y-0 left-3 inline-flex items-center text-muted-foreground">
              <AtSign className="size-4" />
            </span>
          </div>
          {/* {!isValid && <div className="form-label-alt text-red-500 text-sm text-left ml-1">Invalid username</div>} */}
          <Button type="submit" className="w-36" disabled={loading || !isValid} isLoading={loading}>
            Submit
          </Button>
        </form>
      </div>
    </>
  );
}
