'use client';

import { useSession } from 'next-auth/react';

/**
 * Client-side hook to get current user
 * Returns user data and loading state
 */
export function useUser() {
  const { data: session, status } = useSession();

  return {
    user: session?.user ?? null,
    isLoading: status === 'loading',
    isAuthenticated: !!session?.user,
  };
}

/**
 * Client-side hook that requires authentication
 * Redirects to sign-in page if user is not authenticated
 */
export function useRequireAuth() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      window.location.href = '/auth/signin';
    },
  });

  return {
    user: session?.user ?? null,
    isLoading: status === 'loading',
  };
}
