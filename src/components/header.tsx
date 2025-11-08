'use client';

import { useState } from 'react';
import { useUser } from '@/hooks/use-user';
import Link from 'next/link';
import AuthModal from '@/components/auth/auth-modal';
import UserMenu from '@/components/user-menu';

export function Header() {
  const { user, isAuthenticated, isLoading } = useUser();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');

  return (
    <header className="border-b border-purple-200/50 bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <img 
              src="/logo.png" 
              alt="Teşekkürvar" 
              width={40} 
              height={40}
              className="rounded-lg object-contain group-hover:scale-110 transition-transform duration-300"
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-orange-500 bg-clip-text text-transparent group-hover:from-pink-700 group-hover:via-purple-700 group-hover:to-orange-600 transition-all">
              Teşekkürvar
            </span>
          </Link>
          
          {/* Navigation */}
          <nav className="flex items-center space-x-4">
            {isLoading ? (
              <div className="h-8 w-24 animate-pulse rounded bg-gray-200" />
            ) : isAuthenticated && user ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/tesekkurler"
                  className="text-sm font-medium text-gray-700 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-pink-600 hover:to-purple-600 transition-all"
                >
                  Teşekkürler
                </Link>
                <Link
                  href="/sirketler"
                  className="text-sm font-medium text-gray-700 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 transition-all"
                >
                  Şirketler
                </Link>
                
                {/* User Menu */}
                <UserMenu user={user} />
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    setAuthModalTab('login');
                    setIsAuthModalOpen(true);
                  }}
                  className="text-sm font-medium text-gray-700 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 transition-all"
                >
                  Giriş Yap
                </button>
                <button
                  onClick={() => {
                    setAuthModalTab('register');
                    setIsAuthModalOpen(true);
                  }}
                  className="rounded-lg bg-gradient-to-r from-pink-600 to-purple-600 px-5 py-2 text-sm font-medium text-white hover:from-pink-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all hover:scale-105"
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
