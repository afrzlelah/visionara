// resources/js/Components/Landing/Features.jsx
const features = [
  {
    icon: '🎥',
    title: 'Panggilan Video HD',
    description: 'Kualitas tinggi, latency rendah, tanpa batasan waktu.',
  },
  {
    icon: '🔗',
    title: 'Integrasi API',
    description: 'Hubungkan panggilan dengan sistem Anda lewat REST API.',
  },
  {
    icon: '🔒',
    title: 'Keamanan Terpercaya',
    description: 'Enkripsi end‑to‑end dan kontrol akses granular.',
  },
];

export default function Features() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-[#0788F9] mb-12">Fitur Utama</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-[#F5F7FA] rounded-xl p-8 shadow-sm hover:shadow-md transition"
            >
              <div className="text-4xl mb-4" aria-hidden="true">
                {f.icon}
              </div>
              <h3 className="text-xl font-semibold text-[#202124] mb-2">
                {f.title}
              </h3>
              <p className="text-[#202124]">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

