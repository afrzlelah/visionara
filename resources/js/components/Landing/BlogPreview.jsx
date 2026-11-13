// resources/js/Components/Landing/BlogPreview.jsx
export default function BlogPreview() {
  const posts = [
    {
      title: 'Cara Membuat Panggilan Video Stabil di Jaringan Tidak Terduga',
      excerpt: 'Tips teknis untuk mengoptimalkan bitrate, codec, dan fallback jaringan.',
      slug: '/blog/stable-video-calls',
    },
    {
      title: 'Integrasi Padhang dengan Laravel: Langkah‑Langkah Praktis',
      excerpt: 'Tutorial lengkap mulai dari instalasi hingga deployment.',
      slug: '/blog/laravel-integration',
    },
    {
      title: 'Keamanan Video Call: Enkripsi End‑to‑End',
      excerpt: 'Mengapa end‑to‑end encryption penting dan bagaimana cara mengaktifkannya.',
      slug: '/blog/end-to-end-security',
    },
  ];

  return (
    <section className="py-20 bg-[#F5F7FA]">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-[#0788F9] mb-8">Dari Blog Kami</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {posts.map((p) => (
            <a
              key={p.slug}
              href={p.slug}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition text-left"
            >
              <h3 className="text-xl font-semibold text-[#202124] mb-2">{p.title}</h3>
              <p className="text-[#202124] mb-4">{p.excerpt}</p>
              <span className="text-[#00B8E5] font-medium">Baca selengkapnya →</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

