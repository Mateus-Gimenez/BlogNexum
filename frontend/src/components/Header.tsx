'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          BlogNexum
        </Link>
        <nav>
          {isAuthenticated ? (
            <div className="flex items-center">
              <span className="mr-4">Olá, {user?.nome}</span>
              <button onClick={logout} className="hover:text-gray-300">
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link href="/login" className="mr-4 hover:text-gray-300">
                Login
              </Link>
              <Link href="/register" className="hover:text-gray-300">
                Registrar
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
