'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import ConfirmationModal from './ConfirmationModal';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogoutConfirm = () => {
    logout();
    setIsLogoutModalOpen(false);
  };

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
              <button onClick={() => setIsLogoutModalOpen(true)} className="hover:text-gray-300">
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
    <ConfirmationModal
        isOpen={isLogoutModalOpen}
        title="Confirmar Logout"
        message="Tem certeza que deseja sair?"
        onConfirm={handleLogoutConfirm}
        onCancel={() => setIsLogoutModalOpen(false)}
        confirmButtonText="Sair"
      />
    </header>
  );
};

export default Header;
