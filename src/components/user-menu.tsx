'use client';

import { useState, useRef, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  User, 
  MessageSquare, 
  ThumbsUp, 
  MessageCircle, 
  Bookmark, 
  LogOut,
  Settings
} from 'lucide-react';

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface UserMenuProps {
  user: User;
}

export default function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const menuItems = [
    {
      icon: User,
      label: 'Profilimi Düzenle',
      href: '/profil/duzenle',
    },
    {
      icon: MessageSquare,
      label: 'Şikayetlerim',
      href: '/profilim/sikayetlerim',
    },
    {
      icon: ThumbsUp,
      label: 'Desteklediklerim',
      href: '/profilim/desteklediklerim',
    },
    {
      icon: MessageCircle,
      label: 'Yorumladıklarım',
      href: '/profilim/yorumladiklarim',
    },
    {
      icon: Bookmark,
      label: 'Kaydedilenler',
      href: '/profilim/kaydedilenler',
    },
  ];

  return (
    <div className="relative" ref={menuRef}>
      {/* User Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 rounded-full hover:bg-gray-50 transition-colors p-1 pr-3"
      >
        {user.image ? (
          <Image
            src={user.image}
            alt={user.name || 'User'}
            width={40}
            height={40}
            className="rounded-full ring-2 ring-gray-200"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white font-semibold ring-2 ring-gray-200">
            {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
          </div>
        )}
        
        <div className="hidden md:flex flex-col items-start">
          <span className="text-sm font-semibold text-gray-900">
            {user.name || 'Kullanıcı'}
          </span>
        </div>

        {/* Dropdown Arrow */}
        <svg
          className={`hidden md:block w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
          {/* User Info Header */}
          <div className="p-6 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 border-b border-gray-100">
            <div className="flex items-center gap-4">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name || 'User'}
                  width={56}
                  height={56}
                  className="rounded-full ring-2 ring-white shadow-md"
                />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold text-xl ring-2 ring-white shadow-md">
                  {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-gray-900 truncate">
                  {user.name || 'Kullanıcı'}
                </h3>
                <p className="text-sm text-gray-600 truncate">
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Icon className="w-5 h-5 text-gray-500" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}

            {/* Settings */}
            <Link
              href="/ayarlar"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-gray-50 transition-colors border-t border-gray-100"
            >
              <Settings className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium">Yardım</span>
            </Link>

            {/* Logout */}
            <button
              onClick={() => {
                setIsOpen(false);
                signOut({ callbackUrl: '/' });
              }}
              className="w-full flex items-center gap-3 px-6 py-3 text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Çıkış Yap</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
