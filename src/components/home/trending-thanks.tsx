'use client';

import { useState, useRef, useEffect } from 'react';
import Image from '@/components/ui/image';
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
    <section className="py-16  elative overflow-hidden">
      {/* Decorative Elements */}
     
      <div className="w-full px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-8 bg-gradient-to-b from-pink-500 to-purple-500 rounded-full"></div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
                Gündemdeki Teşekkürler
              </h2>
            </div>
            <p className="text-gray-700 font-medium ml-5">
              🔥 En çok konuşulan teşekkürler
            </p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              className="p-3 rounded-full bg-white/90 hover:bg-white shadow-lg hover:shadow-xl transition-all hover:scale-110 backdrop-blur-sm border border-purple-200"
              aria-label="Sola kaydır"
            >
              <ChevronLeft className="w-6 h-6 text-purple-600" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-3 rounded-full bg-white/90 hover:bg-white shadow-lg hover:shadow-xl transition-all hover:scale-110 backdrop-blur-sm border border-pink-200"
              aria-label="Sağa kaydır"
            >
              <ChevronRight className="w-6 h-6 text-pink-600" />
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
                className="flex-shrink-0 w-[420px] bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-pink-300 overflow-hidden group hover:scale-105"
              >
                {/* Card Header - User Info */}
                <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-purple-50/50 to-pink-50/50">
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
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full flex-shrink-0 border border-pink-200">
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
                        <span className="text-xs font-semibold bg-gradient-to-r from-pink-700 to-purple-700 bg-clip-text text-transparent truncate max-w-[100px]">
                          {thanks.company.name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-3 line-clamp-2 group-hover:bg-gradient-to-r group-hover:from-pink-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300 text-lg">
                    {thanks.title}
                  </h3>
                

                  {/* Thumbnail Image */}
                  {thanks.thumbnail && (
                    <div className="relative w-full h-48 rounded-xl overflow-hidden mb-4 ring-2 ring-purple-100">
                      <Image
                        src={thanks.thumbnail}
                        alt={thanks.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 350px"
                      />
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-full border border-green-200">
                      <svg
                        className="w-4 h-4 text-green-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                      </svg>
                      <span className="font-semibold text-green-700">{thanks.likes}</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-full border border-blue-200">
                      <svg
                        className="w-4 h-4 text-blue-600"
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
                      <span className="font-semibold text-blue-700">{thanks.commentCount}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* CSS to hide scrollbar and add animations */}
        <style jsx>{`
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          @keyframes blob {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
        `}</style>
      </div>
    </section>
  );
}
