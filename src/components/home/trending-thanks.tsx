'use client';

import { useState, useRef, useEffect } from 'react';
import Image from '@/components/ui/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Company {
  id: string;
  name: string;
  logo?: string;
  logoUrl?: string;
}

interface User {
  id: string;
  name?: string;
  image?: string;
}

interface Thanks {
  id: string;
  title: string;
  content: string;
  thumbnail?: string;
  createdAt: Date;
  likes: number;
  commentCount: number;
  company?: Company;
  user?: User;
}

interface TrendingThanksProps {
  thanks: Thanks[];
}

export default function TrendingThanks({ thanks }: TrendingThanksProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  
  // Ensure thanks is an array
  const thanksArray = Array.isArray(thanks) ? thanks : [];
  
  // Duplicate items for seamless infinite scroll
  const duplicatedItems = [...thanksArray, ...thanksArray, ...thanksArray];

  // Auto-scroll animation
  useEffect(() => {
    let animationFrameId: number;
    
    const autoScroll = () => {
      if (!isHovering && scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        
        // Scroll by 0.5 pixels per frame (smooth animation)
        container.scrollLeft += 0.5;
        
        // Reset to start when reaching the duplicated section
        // This creates seamless infinite scroll
        const maxScroll = container.scrollWidth / 3;
        if (container.scrollLeft >= maxScroll) {
          container.scrollLeft = 0;
        }
      }
      
      animationFrameId = requestAnimationFrame(autoScroll);
    };
    
    // Start animation
    animationFrameId = requestAnimationFrame(autoScroll);
    
    // Cleanup
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isHovering]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      const newScrollLeft =
        scrollContainerRef.current.scrollLeft +
        (direction === 'left' ? -scrollAmount : scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth',
      });
    }
  };

  // Don't render if no thanks
  if (thanksArray.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-white relative overflow-hidden">
      <div className="w-full px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-8 bg-gradient-to-b from-pink-500 to-purple-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-gray-900">
                Gündemdeki Teşekkürler
              </h2>
            </div>
            <p className="text-gray-600 ml-5">
              🔥 En çok konuşulan teşekkürler
            </p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 shadow transition-all"
              aria-label="Sola kaydır"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 shadow transition-all"
              aria-label="Sağa kaydır"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>

        <div 
          ref={scrollContainerRef}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          className="overflow-x-auto hide-scrollbar"
        >
          <div className="flex gap-6 pb-4">
            {duplicatedItems.map((thanks, index) => (
              <Link
                href={`/tesekkur/${thanks.id}`}
                key={`${thanks.id}-${index}`}
                className="flex-shrink-0 w-[650px] bg-white rounded-xl shadow hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-purple-300 overflow-hidden group flex gap-4 p-4"
              >
                {/* Thumbnail Image - Small */}
                {thanks.thumbnail && (
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                    <Image
                      src={thanks.thumbnail}
                      alt={thanks.title}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  {/* Header */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                        <Image
                          src={thanks.user?.image || 'https://i.pravatar.cc/150?img=1'}
                          alt={thanks.user?.name || 'Kullanıcı'}
                          fill
                          className="object-cover"
                          sizes="32px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {thanks.user?.name || 'Anonim Kullanıcı'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(thanks.createdAt).toLocaleDateString('tr-TR')}
                        </p>
                      </div>
                      {thanks.company && (
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-purple-50 rounded-full flex-shrink-0">
                          {thanks.company.logoUrl && (
                            <div className="relative w-3 h-3">
                              <Image
                                src={thanks.company.logoUrl}
                                alt={thanks.company.name}
                                fill
                                className="object-contain"
                                sizes="12px"
                              />
                            </div>
                          )}
                          <span className="text-xs font-medium text-purple-700 truncate max-w-[120px]">
                            {thanks.company.name}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 text-base group-hover:text-purple-600 transition-colors">
                      {thanks.title}
                    </h3>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-green-600">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                      </svg>
                      <span className="font-medium">{thanks.likes}</span>
                    </div>
                    <div className="flex items-center gap-1 text-blue-600">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                      <span className="font-medium">{thanks.commentCount}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* CSS to hide scrollbar */}
        <style jsx>{`
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    </section>
  );
}
