// hooks/useAuth.ts

import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

export const useAuth = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== 'loading' && !session) {
       void router.push('/');
    }
  }, [status, session, router]);
};
