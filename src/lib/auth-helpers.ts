import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from './auth';

/**
 * Server-side helper to require authentication
 * Redirects to sign-in page if user is not authenticated
 */
export async function requireUser() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/auth/signin');
  }

  return session.user;
}

/**
 * Server-side helper to get current user session
 * Returns null if not authenticated
 */
export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user ?? null;
}
