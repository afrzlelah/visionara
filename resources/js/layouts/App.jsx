// resources/js/Layouts/App.jsx
import { Head, usePage } from '@inertiajs/react';
import NavBar from '@/Components/NavBar';
import Footer from '@/Components/Footer';

export default function App({ children, title = 'Padhang', hideNavBar = false }) {
  return (
    <div className="font-sans antialiased text-[#202124] bg-white">
      <Head title={title} />
      {/* NavBar hanya muncul bila hideNavBar false/undefined */}
      {!hideNavBar && <NavBar />}
      <main className="pt-6">{children}</main>
      {!hideNavBar && <Footer />}
    </div>
  );
}