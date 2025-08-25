'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/services/api';

const CreatePostPage = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  if (!isAuthenticated) {
    // Idealmente, isso seria tratado com um HOC ou middleware
    // para proteger a rota, mas para simplificar, faremos um redirect.
    if (typeof window !== 'undefined') {
        router.push('/login');
    }
    return null; // Renderiza nada enquanto redireciona
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title || !content) {
      setError('Título e conteúdo são obrigatórios.');
      return;
    }

    try {
      await api.post('/blog', { titulo: title, conteudo: content });
      router.push('/'); // Redireciona para a home após o sucesso
    } catch (err) {
      setError('Ocorreu um erro ao criar o post. Tente novamente.');
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto mt-10 p-4">
      <div className="w-full max-w-2xl mx-auto p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-black">Criar Novo Post</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Título
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
            />
          </div>
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              Conteúdo
            </label>
            <textarea
              id="content"
              name="content"
              rows={10}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Publicar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostPage;
