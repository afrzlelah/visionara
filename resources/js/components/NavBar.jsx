// resources/js/Components/NavBar.jsx

import { Link } from '@inertiajs/react';

export default function NavBar() {
  return (
    <nav className="sticky top-0 bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-[#0788F9]">
          Padhang
        </Link>
        {/* Menu */}
        <div className="hidden md:flex space-x-6 text-[#202124]">
          <Link href="/" className="hover:text-[#00B8E5] transition-colors">Beranda</Link>
          <Link href="/layanan" className="hover:text-[#00B8E5] transition-colors">Layanan</Link>
          <Link href="/blog" className="hover:text-[#00B8E5] transition-colors">Blog</Link>
          <Link href="/tentang" className="hover:text-[#00B8E5] transition-colors">Tentang Kami</Link>
          <Link href="/kontak" className="hover:text-[#00B8E5] transition-colors">Kontak</Link>
          <Link href="/faq" className="hover:text-[#00B8E5] transition-colors">Pertanyaan Umum</Link>
        </div>
      </div>
    </nav>
  );
}

