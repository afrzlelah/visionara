 Install @daily-co/daily-js and @daily-co/daily-react via npm.
 Add DAILY_API_KEY and DAILY_DOMAIN to .env files.
 Update App\Services\CallService to create a Daily.co room via API when a call is assigned.
 Refactor resources/js/hooks/use-webrtc.ts to use Daily.co SDK.
 Refactor resources/js/pages/call.tsx to mount Daily.co iframe or custom video components.
 Remove unused vanilla WebRTC endpoints in CallController.php.
 Ask the user to register on Daily.co and provide the API Key.


 Evaluasi Arsitektur WebRTC untuk Mobile
Masalah koneksi WebRTC yang persisten pada perangkat mobile (terutama saat menggunakan jaringan seluler 4G/5G atau browser Safari di iOS) adalah hal yang sangat umum terjadi pada implementasi Vanilla WebRTC.

Akar Permasalahan Terbesar di Mobile
Symmetric NAT (Jaringan Seluler): Provider seluler (Telkomsel, XL, dll) menggunakan jenis NAT yang sangat ketat. Panggilan P2P (Peer-to-Peer) langsung nyaris mustahil terjadi. WebRTC wajib menggunakan TURN server untuk merelay video. Masalahnya, TURN server gratis (free.expressturn.com) sering kali lambat, tidak stabil, atau bahkan diblokir oleh provider. Jika TURN gagal, panggilan akan blank atau connecting selamanya.
Safari / iOS Strict Autoplay Policies: Apple memiliki perlindungan ketat terhadap media. Walaupun kita sudah memasang playsInline, kadangkala audio context harus dipicu langsung oleh ketukan layar tanpa jeda asinkron yang terlalu panjang.
Koneksi WebSocket Terputus (Backgrounding): Saat HP layar mati atau berpindah aplikasi sebentar, WebSocket (Laravel Reverb) akan ditutup oleh OS untuk menghemat baterai, menyebabkan sinyal gagal terkirim.
⚠️ User Review Required: Pemilihan Arsitektur
Mengingat Anda bertanya "apakah sebaiknya ganti arsitektur?", jawabannya adalah IYA, sangat disarankan untuk aplikasi produksi. Membangun dan me-maintain infrastruktur WebRTC mentah dari nol memakan waktu besar.

Saya mengusulkan dua opsi arsitektur:

Opsi 1: Migrasi ke Managed WebRTC / CPaaS (Sangat Direkomendasikan)
Mengganti Vanilla WebRTC dengan SDK dari penyedia layanan video terkelola seperti Daily.co, Agora, atau LiveKit.

Keuntungan: Mereka sudah memiliki ratusan TURN server berkecepatan tinggi di seluruh dunia, SDK React (seperti @daily-co/daily-react) yang otomatis menangani edge cases iOS/Android, pemulihan koneksi saat sinyal drop, dan manajemen room otomatis.
Biaya: Daily.co dan Agora memiliki free tier (gratis) hingga 10.000 menit per bulan, sangat cukup untuk tahap awal.
Perubahan Kode: Kita akan menghapus use-webrtc.ts dan menggantinya dengan integrasi SDK yang jauh lebih ringkas. Laravel backend hanya bertugas membuat/mengelola Room URL atau Token.
Opsi 2: Tetap Vanilla WebRTC, tetapi Ganti Infrastruktur TURN & Tambah Log (Beresiko)
Kita tetap mempertahankan kode saat ini, namun dengan perombakan infrastruktur:

Mengganti TURN server gratis dengan Metered TURN atau Twilio Network Traversal Services (membutuhkan akun dan kartu kredit untuk setup, meski biayanya sangat murah per GB).
Menambahkan reconnection logic yang agresif pada WebSocket.
Menambahkan state iceConnectionState untuk me-render UI error secara eksplisit (seperti "Koneksi terblokir firewall").
Open Questions
Apakah Anda setuju untuk mengganti arsitektur menggunakan penyedia Managed WebRTC (seperti Daily.co)? Ini akan secara instan menyelesaikan 99% masalah kompatibilitas mobile dan koneksi jaringan seluler.
Jika Anda memilih Opsi 1, apakah Anda ingin saya memandu pembuatan Room dan integrasinya sekarang menggunakan Daily.co (karena memiliki React hooks resmi terbaik)?
Jika Anda memilih Opsi 2 (tetap Vanilla WebRTC), apakah Anda memiliki akun TURN server berbayar (seperti Twilio) yang bisa kita gunakan?
Silakan tinjau dan berikan keputusan Anda.

