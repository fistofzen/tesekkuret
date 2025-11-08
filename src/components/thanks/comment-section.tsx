'use client';

import { useState, useEffect } from 'react';
import Image from '@/components/ui/image';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Send, MessageCircle } from 'lucide-react';

interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

interface CommentSectionProps {
  thanksId: string;
}

export default function CommentSection({ thanksId }: CommentSectionProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const loadComments = async () => {
      try {
        const response = await fetch(`/api/thanks/${thanksId}/comments`);
        if (response.ok) {
          const data = await response.json();
          setComments(data.comments || []);
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
      } finally {
        setIsFetching(false);
      }
    };
    loadComments();
  }, [thanksId]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/thanks/${thanksId}/comments`);
      if (response.ok) {
        const data = await response.json();
        setComments(data.comments || []);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session) {
      toast.error('Yorum yapmak için giriş yapmalısınız');
      return;
    }

    if (!newComment.trim()) {
      toast.error('Yorum boş olamaz');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/thanks/${thanksId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newComment }),
      });

      if (!response.ok) {
        throw new Error('Yorum eklenemedi');
      }

      const data = await response.json();
      setComments([data.comment, ...comments]);
      setNewComment('');
      toast.success('Yorum eklendi! 💬');
    } catch (error) {
      console.error('Comment error:', error);
      toast.error('Bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-purple-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-purple-50/50 to-pink-50/50">
        <div className="flex items-center gap-3">
          <MessageCircle className="w-6 h-6 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-900">
            Yorumlar ({comments.length})
          </h2>
        </div>
      </div>

      <div className="p-6">
        {/* Comment Form */}
        {session ? (
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="flex gap-4">
              <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-purple-200">
                <Image
                  src={session.user?.image || 'https://i.pravatar.cc/150?img=1'}
                  alt={session.user?.name || 'Kullanıcı'}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Yorumunuzu yazın..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none resize-none transition-all"
                  rows={3}
                  disabled={isLoading}
                />
                <div className="flex justify-end mt-3">
                  <button
                    type="submit"
                    disabled={isLoading || !newComment.trim()}
                    className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                  >
                    <Send className="w-4 h-4" />
                    {isLoading ? 'Gönderiliyor...' : 'Gönder'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        ) : (
          <div className="mb-8 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 text-center">
            <p className="text-gray-700">
              Yorum yapmak için{' '}
              <a href="/api/auth/signin" className="font-semibold text-purple-600 hover:text-purple-700 underline">
                giriş yapın
              </a>
            </p>
          </div>
        )}

        {/* Comments List */}
        {isFetching ? (
          <div className="text-center py-8">
            <div className="inline-block w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Yorumlar yükleniyor...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Henüz yorum yapılmamış</p>
            <p className="text-gray-400 text-sm mt-2">İlk yorumu siz yapın! 🎉</p>
          </div>
        ) : (
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-4">
                <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-purple-100">
                  <Image
                    src={comment.user.image || 'https://i.pravatar.cc/150?img=1'}
                    alt={comment.user.name || 'Kullanıcı'}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
                <div className="flex-1">
                  <div className="bg-gradient-to-r from-gray-50 to-purple-50 rounded-xl p-4 border border-purple-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900">
                        {comment.user.name || 'Anonim Kullanıcı'}
                      </span>
                      <time className="text-xs text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString('tr-TR', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </time>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
