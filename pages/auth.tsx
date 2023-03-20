import GoogleIcon from '@/components/GoogleIcon';
import { Button, Link as StyledLink } from '@nextui-org/react';
import { Session } from 'next-auth';
import { getSession, signIn } from 'next-auth/react';
import Link from 'next/link';
import { NextPageContext } from 'next/types';

interface IAuthProps {
  session: Session | null;
  reloadSession: () => void;
}

const Auth: React.FC<IAuthProps> = ({ session, reloadSession }) => {
  return (
    <div className="h-[100vh]">
      <div className="absolute top-1/2 right-1/2 inline-block translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center text-center">
        <Button icon={<GoogleIcon />} as="button" onClick={() => signIn('google')} color="primary" auto>
          Sign in with Google
        </Button>
        <StyledLink as={Link} href="/" className="mt-4" color="text">
          <i className="fas fa-arrow-left mr-2" /> Back to homepage
        </StyledLink>
      </div>
    </div>
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
