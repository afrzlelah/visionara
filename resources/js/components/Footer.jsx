// resources/js/Components/Footer.jsx
export default function Footer() {
  return (
    <footer className="bg-[#0788F9] text-white py-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} Padhang. All rights reserved.</p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a href="/terms" className="hover:underline">Syarat &amp; Ketentuan</a>
          <a href="/privacy" className="hover:underline">Kebijakan Privasi</a>
        </div>
      </div>
    </footer>
  );
}

