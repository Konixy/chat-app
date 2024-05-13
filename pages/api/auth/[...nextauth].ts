import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import prisma from 'lib/prismadb';
import { CustomPrismaAdapter } from '@/lib/CustomPrismaAdapter';
import { Adapter } from 'next-auth/adapters';

export default NextAuth({
  adapter: CustomPrismaAdapter(prisma) as unknown as Adapter,
  theme: { colorScheme: 'dark' },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    session: ({ session, user }) => {
      return { ...session, user: { ...session.user, ...user } };
    },
  },
});
