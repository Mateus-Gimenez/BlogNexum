'use client';

import { useEffect, useState } from 'react';
import api from '@/services/api';
import { Post } from '@/types/post';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      const fetchPosts = async () => {
        try {
          const response = await api.get('/blog');
          setPosts(response.data);
        } catch (err) {
          setError('Falha ao carregar os posts.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchPosts();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-4xl font-bold text-black">Bem-vindo ao BlogNexum</h1>
      </main>
    );
  }

  return (
    <main className="container mx-auto p-4 mt-10">
      <h1 className="text-4xl font-bold text-center mb-10 text-black">Últimos Posts</h1>
      
      {loading && <p className="text-center text-black">Carregando...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="space-y-8">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.id} className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-black mb-2">{post.titulo}</h2>
                <p className="text-gray-500 text-sm mb-4">
                  Por {post.autorNome} em {new Date(post.dataCriacao).toLocaleDateString()}
                </p>
                <p className="text-gray-700">{post.conteudo.substring(0, 200)}...</p>
              </div>
            ))
          ) : (
            <p className="text-center text-black">Nenhum post encontrado.</p>
          )}
        </div>
      )}
    </main>
  );
}
