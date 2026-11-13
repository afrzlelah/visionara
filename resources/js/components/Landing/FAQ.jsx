// resources/js/Components/Landing/FAQ.jsx
const faqs = [
  {
    q: 'Berapa biaya penggunaan Padhang?',
    a: 'Kami menawarkan paket bulanan mulai dari Rp 150.000, dengan trial 14 hari.',
  },
  {
    q: 'Apakah video call terenkripsi?',
    a: 'Ya, semua panggilan menggunakan end‑to‑end encryption AES‑256.',
  },
  {
    q: 'Apakah ada batasan jumlah peserta?',
    a: 'Maksimum 50 peserta dalam satu sesi, dapat di‑upgrade.',
  },
];

export default function FAQ() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-[#0788F9] text-center mb-12">Pertanyaan Umum</h2>
        <dl className="space-y-6">
          {faqs.map((item, i) => (
            <div key={i} className="bg-[#F5F7FA] rounded-lg p-6 shadow-sm">
              <dt className="text-lg font-medium text-[#202124]">{item.q}</dt>
              <dd className="mt-2 text-[#202124]">{item.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

