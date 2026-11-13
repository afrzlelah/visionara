// resources/js/Components/Landing/Contact.jsx
export default function Contact() {
  return (
    <section className="py-20 bg-[#00B8E5] text-white">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">Hubungi Kami</h2>
        <p className="mb-8">Ada pertanyaan? Tim kami siap membantu 24/7.</p>
        <a
          href="mailto:info@padhang.id"
          className="inline-block bg-[#DFFF00] text-[#202124] px-8 py-3 rounded-full hover:bg-[#C0E000] transition"
        >
          info@padhang.id
        </a>
      </div>
    </section>
  );
}

