import { Button } from '@nextui-org/react';
import { Session } from 'next-auth';
import { getSession, signIn } from 'next-auth/react';
import { NextPageContext } from 'next/types';

interface IAuthProps {
  session: Session | null;
  reloadSession: () => void;
}

const Auth: React.FC<IAuthProps> = ({ session, reloadSession }) => {
  return (
    <div className="h-[100vh] border border-red-500">
      <div className="absolute top-1/2 -translate-y-1/2">
        <Button icon={<i className="fab fa-google" />} as="button" onClick={() => signIn('google')} color="primary" auto>
          Sign in with Google
        </Button>
      </div>
    </div>
    // <div className="h-full min-h-full w-full min-w-full">
    //   <div className="absolute left-1/2 top-1/2 flex -translate-y-1/2 -translate-x-1/2 flex-col justify-center">

    //   </div>
    // </div>
  );
};

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
}

export default Auth;
