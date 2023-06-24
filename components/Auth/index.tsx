import { useMutation } from '@apollo/client';
import { Session } from 'next-auth';
import { useEffect, useState } from 'react';
import UserOperations from 'graphql/operations/user';
import type { CreateUsernameData, CreateUsernameVariables } from 'lib/types';
import BackBtn from '../BackBtn';

interface IAuthProps {
  session: Session | null;
  reloadSession: () => void;
}

const Auth: React.FunctionComponent<IAuthProps> = ({ session, reloadSession }) => {
  const [username, setUsername] = useState('');
  const [isValid, validate] = useState(false);
  const [createUsername, { data, loading, error }] = useMutation<CreateUsernameData, CreateUsernameVariables>(UserOperations.Mutations.createUsername);

  useEffect(() => {
    if (username.match(/^(?=.{4,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/)) validate(true);
    else validate(false);
  }, [username]);

  async function onSubmit() {
    if (!isValid) return;
    await createUsername({ variables: { username } });
  }

  return (
    <>
      <BackBtn />
      <div className="h-[100vh]">
        <div className="absolute right-1/2 top-1/2 inline-block -translate-y-1/2 translate-x-1/2 flex-col items-center justify-center text-center">
          <div className="mb-10 text-2xl">Please enter a username</div>
          <div className="relative w-full">
            <input type="text" name="username" placeholder="example76" value={username} onChange={(e) => setUsername(e.target.value)} className="input pl-10" />
            <span className="absolute inset-y-0 left-3 inline-flex items-center text-content3">
              <i className="fas fa-at" />
            </span>
          </div>
          {!isValid && <div className="form-label-alt text-red-500">Username don&apos;t match the regex</div>}
          <button type="submit" className="btn-primary btn-block btn mt-6" onClick={onSubmit}>
            Save
          </button>
        </div>
      </div>
    </>
  );
};

export default Auth;
