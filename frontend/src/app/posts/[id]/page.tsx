'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/services/api';
import { Post } from '@/types/post';
import Link from 'next/link';

const PostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      const fetchPost = async () => {
        try {
          const response = await api.get(`/blog/${id}`);
          setPost(response.data);
        } catch (err) {
          setError('Falha ao carregar o post.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchPost();
    }
  }, [id]);

  if (loading) {
    return <p className="text-center p-8">Carregando...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 p-8">{error}</p>;
  }

  if (!post) {
    return <p className="text-center p-8">Post não encontrado.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white p-8 rounded-lg shadow-md m-4">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">{post.titulo}</h1>
        <div className="text-sm text-gray-500 mb-6">
          <span>Por {post.autorNome}</span> &middot; <span>{new Date(post.dataCriacao).toLocaleDateString()}</span>
        </div>
        <div className="prose prose-lg max-w-none text-gray-800">
          {post.conteudo}
        </div>
        <div className="mt-8 text-center">
            <Link href="/" className="text-indigo-600 hover:text-indigo-800 font-semibold">
              &larr; Voltar para todos os posts
            </Link>
        </div>
      </div>
    </div>
  );
};

export default PostPage;
