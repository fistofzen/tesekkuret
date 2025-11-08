'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Company {
  id: string;
  name: string;
  logo?: string;
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
    
    const scroll = () => {
      if (!isHovering && scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        
        // Scroll left by 0.2 pixels per frame (slower, smoother animation)
        container.scrollLeft += 0.2;
        
        // Reset to start when reaching the duplicated section
        // This creates seamless infinite scroll
        const maxScroll = container.scrollWidth / 3;
        if (container.scrollLeft >= maxScroll) {
          container.scrollLeft = 0;
        }
      }
      
      animationFrameId = requestAnimationFrame(scroll);
    };
    
    // Start animation
    animationFrameId = requestAnimationFrame(scroll);
    
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
    <section className="py-16 bg-gradient-to-br from-pink-50 to-white">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Gündemdeki Teşekkürler
            </h2>
            <p className="text-gray-600">
              En çok konuşulan teşekkürler
            </p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              className="p-2 rounded-full bg-white hover:bg-gray-50 shadow-md transition-colors"
              aria-label="Sola kaydır"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2 rounded-full bg-white hover:bg-gray-50 shadow-md transition-colors"
              aria-label="Sağa kaydır"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </div>

        <div 
          ref={scrollContainerRef}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          className="overflow-x-auto hide-scrollbar"
        >
          <div className="flex gap-4 pb-4">
            {duplicatedItems.map((thanks, index) => (
              <Link
                href={`/tesekkur/${thanks.id}`}
                key={`${thanks.id}-${index}`}
                className="flex-shrink-0 w-[420px] bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 overflow-hidden group"
              >
                {/* Card Header - User Info */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={thanks.user?.image || 'https://i.pravatar.cc/150?img=1'}
                        alt={thanks.user?.name || 'Kullanıcı'}
                        fill
                        className="object-cover"
                        sizes="40px"
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
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-pink-50 rounded-full flex-shrink-0">
                        {thanks.company.logo && (
                          <div className="relative w-4 h-4">
                            <Image
                              src={thanks.company.logo}
                              alt={thanks.company.name}
                              fill
                              className="object-contain"
                              sizes="16px"
                            />
                          </div>
                        )}
                        <span className="text-xs font-medium text-pink-700 truncate max-w-[100px]">
                          {thanks.company.name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-pink-600 transition-colors">
                    {thanks.title}
                  </h3>
                

                  {/* Thumbnail Image */}
                  {thanks.thumbnail && (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden mb-4">
                      <Image
                        src={thanks.thumbnail}
                        alt={thanks.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, 350px"
                      />
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                      </svg>
                      <span>{thanks.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
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
                      <span>{thanks.commentCount}</span>
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
