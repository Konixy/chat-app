import 'next-auth';
import type User from './types';

declare module 'next-auth' {
  interface Session {
    user: User;
  }
}
