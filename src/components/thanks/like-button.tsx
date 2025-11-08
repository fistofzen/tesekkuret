'use client';

import { useState } from 'react';
import { ThumbsUp } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

interface LikeButtonProps {
  thanksId: string;
  initialLikes: number;
}

export default function LikeButton({ thanksId, initialLikes }: LikeButtonProps) {
  const { data: session } = useSession();
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLike = async () => {
    if (!session) {
      toast.error('Beğenmek için giriş yapmalısınız');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/thanks/${thanksId}/like`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Beğeni işlemi başarısız');
      }

      const data = await response.json();
      setLikes(data.likeCount);
      setIsLiked(data.liked);
      
      if (data.liked) {
        toast.success('Teşekkür beğenildi! 👍');
      } else {
        toast.info('Beğeni geri alındı');
      }
    } catch (error) {
      console.error('Like error:', error);
      toast.error('Bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={isLoading}
      className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all disabled:opacity-50 ${
        isLiked
          ? 'bg-gradient-to-r from-green-500 to-emerald-500 border-green-500 text-white'
          : 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100'
      }`}
    >
      <ThumbsUp className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
      <span className="font-semibold">{likes}</span>
    </button>
  );
}
