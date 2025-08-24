import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          BlogNexum
        </Link>
        <nav>
          <Link href="/login" className="mr-4 hover:text-gray-300">
            Login
          </Link>
          <Link href="/register" className="hover:text-gray-300">
            Registrar
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
