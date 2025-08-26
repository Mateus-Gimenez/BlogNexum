'use client';

import { useEffect, useState } from 'react';
import api from '@/services/api';
import { Post } from '@/types/post';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import EditPostModal from '@/components/EditPostModal';
import ConfirmationModal from '@/components/ConfirmationModal';

export default function Home() {
  const { isAuthenticated, user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [filter, setFilter] = useState<'all' | 'mine'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);

  const handleUpdate = async (updatedPost: Post) => {
    if (!editingPost) return;

    try {
      await api.put(`/blog/${updatedPost.id}`, {
        titulo: updatedPost.titulo,
        conteudo: updatedPost.conteudo,
      });
      setPosts(posts.map(p => (p.id === updatedPost.id ? updatedPost : p)));
      setEditingPost(null); // Fecha o modal
    } catch (err) {
      setError('Falha ao atualizar o post.');
      console.error(err);
    }
  };

  const handleDeleteClick = (postId: string) => {
    setPostToDelete(postId);
    setIsConfirmModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!postToDelete) return;

    try {
      await api.delete(`/blog/${postToDelete}`);
      setPosts(posts.filter(p => p.id !== postToDelete));
    } catch (err) {
      setError('Falha ao excluir o post.');
      console.error(err);
    } finally {
      setIsConfirmModalOpen(false);
      setPostToDelete(null);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      const fetchPosts = async () => {
        try {
          const params = filter === 'mine' ? { meus_posts: true } : {};
          const response = await api.get('/blog', { params });
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
  }, [isAuthenticated, filter]);

  if (!isAuthenticated) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-4xl font-bold text-black">Bem-vindo ao BlogNexum</h1>
      </main>
    );
  }

  return (
    <div className="bg-gray-50">
      <main className="w-full max-w-2xl mx-auto border-x border-gray-200 min-h-screen bg-white">
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <div className="flex-grow">
          <div className="flex border-b border-gray-200">
            <button 
              onClick={() => setFilter('all')}
              className={`flex-1 p-3 font-bold text-center transition-colors ${filter === 'all' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}>
              Todos os Posts
            </button>
            <button 
              onClick={() => setFilter('mine')}
              className={`flex-1 p-3 font-bold text-center transition-colors ${filter === 'mine' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}>
              Meus Posts
            </button>
          </div>
        </div>
        <Link href="/posts/create" className="ml-4 bg-indigo-600 text-white font-bold py-2 px-4 rounded-full hover:bg-indigo-700">
          Criar Novo Post
        </Link>
      </div>
      
      {loading && <p className="text-center text-black">Carregando...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="divide-y divide-gray-200">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.id} className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-xl font-bold text-gray-600">{post.autorNome?.charAt(0)}</span>
                    </div>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center">
                      <span className="font-bold text-black">{post.autorNome}</span>
                      <span className="text-gray-500 ml-2 text-sm">· {new Date(post.dataCriacao).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}</span>
                    </div>
                    <Link href={`/posts/${post.id}`} className="hover:underline">
                      <h2 className="text-2xl font-bold text-black">{post.titulo}</h2>
                    </Link>
                    <p className="text-gray-800 mt-2 whitespace-pre-wrap">{post.conteudo}</p>
                    {isAuthenticated && user?.id === post.autorId && (
                    <div className="flex items-center space-x-4 mt-4 text-gray-500">
                      <button onClick={() => setEditingPost(post)} className="flex items-center space-x-2 hover:text-blue-500 group">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z"></path></svg>
                        <span className="text-sm">Editar</span>
                      </button>
                      <button onClick={() => handleDeleteClick(post.id)} className="flex items-center space-x-2 hover:text-red-500 group">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        <span className="text-sm">Excluir</span>
                      </button>
                    </div>
                  )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-black">Nenhuma postagem encontrado.</p>
          )}
        </div>
      )}

      {editingPost && (
        <EditPostModal
          post={editingPost}
          onUpdate={handleUpdate}
          onClose={() => setEditingPost(null)}
        />
      )}

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        title="Exclusão"
        message="Tem certeza que deseja excluir essa postagem?"
        onConfirm={confirmDelete}
        onCancel={() => setIsConfirmModalOpen(false)}
      />
    </main>
  </div>
  );
}
