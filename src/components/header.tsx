'use client';

import { useState } from 'react';
import { useUser } from '@/hooks/use-user';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import AuthModal from '@/components/auth/auth-modal';

export function Header() {
  const { user, isAuthenticated, isLoading } = useUser();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-blue-600">💙</span>
            <span className="text-xl font-bold text-gray-900">Teşekkürvar</span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-4">
            {isLoading ? (
              <div className="h-8 w-24 animate-pulse rounded bg-gray-200" />
            ) : isAuthenticated && user ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/tesekkurler"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Teşekkürler
                </Link>
                <Link
                  href="/sirketler"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Şirketler
                </Link>
                
                {/* User Menu */}
                <div className="flex items-center space-x-3">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || 'User'}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">
                      {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-700">
                    {user.name || user.email}
                  </span>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                  >
                    Çıkış Yap
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    setAuthModalTab('login');
                    setIsAuthModalOpen(true);
                  }}
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Giriş Yap
                </button>
                <button
                  onClick={() => {
                    setAuthModalTab('register');
                    setIsAuthModalOpen(true);
                  }}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Kayıt Ol
                </button>
              </div>
            )}
          </nav>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultTab={authModalTab}
      />
    </header>
  );
}
