import { useState, useEffect, useRef } from 'react';
import AgoraRTC, {
  AgoraRTCProvider,
  useRTCClient,
  useLocalMicrophoneTrack,
  useLocalCameraTrack,
  useRemoteUsers,
  usePublish,
  useJoin,
  LocalVideoTrack,
  RemoteUser,
} from 'agora-rtc-react';
import { PhoneOff, Video, VideoOff, Mic, MicOff, RotateCcw, Loader2 } from 'lucide-react';
import { Head } from '@inertiajs/react';
import useSWR from 'swr';

function ActiveCallUI({
  channelName,
  appId,
  token,
  uid,
  isCameraOff,
  setIsCameraOff,
  isMuted,
  setIsMuted,
  handleHangUp,
}: {
  channelName: string;
  appId: string;
  token: string;
  uid: string;
  isCameraOff: boolean;
  setIsCameraOff: (v: boolean) => void;
  isMuted: boolean;
  setIsMuted: (v: boolean) => void;
  handleHangUp: () => void;
}) {
  const [callDuration, setCallDuration] = useState(0);
  const durationRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Initialize tracks
  const { localMicrophoneTrack } = useLocalMicrophoneTrack();
  const { localCameraTrack } = useLocalCameraTrack();

  usePublish([localMicrophoneTrack, localCameraTrack]);

  // Join channel using the fetched token
  useJoin({
    appid: appId,
    channel: channelName,
    token: token,
    uid: uid,
  });

  const remoteUsers = useRemoteUsers();

  // Handle mute/unmute
  useEffect(() => {
    if (localMicrophoneTrack) {
      localMicrophoneTrack.setMuted(isMuted);
    }
  }, [isMuted, localMicrophoneTrack]);

  useEffect(() => {
    if (localCameraTrack) {
      localCameraTrack.setMuted(isCameraOff);
    }
  }, [isCameraOff, localCameraTrack]);

  // Duration counter
  useEffect(() => {
    durationRef.current = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => {
      if (durationRef.current) clearInterval(durationRef.current);
    };
  }, []);

  function formatDuration(seconds: number) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  return (
    <>
      <Head title="Dalam Panggilan" />
      <div className="fixed inset-0 z-50 bg-white flex flex-col">
        {/* Main video area (Remote Stream) */}
        <div className="flex-1 relative bg-neutral-900 overflow-hidden">
          {remoteUsers.length > 0 ? (
            // Just display the first remote user taking up the full screen
            <RemoteUser
              user={remoteUsers[0]}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-white/50">
              Menunggu koneksi dari lawan bicara...
            </div>
          )}

          {/* Self-camera thumbnail — top left */}
          <div className="absolute top-4 left-4 w-28 h-40 bg-black rounded-2xl shadow-lg overflow-hidden border-2 border-white/20 z-20">
            {localCameraTrack && !isCameraOff ? (
              <LocalVideoTrack
                track={localCameraTrack}
                play={true}
                className="w-full h-full object-cover scale-x-[-1]"
              />
            ) : (
              <div className="w-full h-full bg-neutral-800" />
            )}

            {isCameraOff && (
              <div className="absolute inset-0 bg-neutral-800/80 flex flex-col items-center justify-center z-10 backdrop-blur-sm">
                <VideoOff className="w-6 h-6 text-white/70" />
              </div>
            )}
          </div>

          {/* Duration badge — top center */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm rounded-full px-4 py-1 z-20">
            <span className="text-white text-sm font-mono font-semibold">
              {formatDuration(callDuration)}
            </span>
          </div>
        </div>

        {/* Controls bar */}
        <div className="bg-neutral-900 border-t border-neutral-800 px-8 py-5 flex items-center justify-between pb-safe">
          <button
            onClick={() => {
              /* flip cam placeholder */
            }}
            className="w-13 h-13 rounded-full bg-neutral-100 flex items-center justify-center active:scale-95 transition-all"
            aria-label="Ganti kamera"
          >
            <RotateCcw className="w-5 h-5 text-neutral-600" />
          </button>

          <button
            onClick={() => setIsCameraOff(!isCameraOff)}
            className="w-13 h-13 rounded-full bg-neutral-100 flex items-center justify-center active:scale-95 transition-all"
            aria-label="Toggle video"
          >
            {isCameraOff ? (
              <VideoOff className="w-5 h-5 text-neutral-600" />
            ) : (
              <Video className="w-5 h-5 text-neutral-600" />
            )}
          </button>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className="w-13 h-13 rounded-full bg-neutral-100 flex items-center justify-center active:scale-95 transition-all"
            aria-label="Toggle mute"
          >
            {isMuted ? (
              <MicOff className="w-5 h-5 text-neutral-600" />
            ) : (
              <Mic className="w-5 h-5 text-neutral-600" />
            )}
          </button>

          <button
            onClick={handleHangUp}
            className="w-13 h-13 rounded-full bg-[#E1005E] flex items-center justify-center shadow-[0_4px_16px_rgba(225,0,94,0.4)] active:scale-95 transition-all"
            aria-label="Akhiri panggilan"
          >
            <PhoneOff className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </>
  );
}

export default function ActiveCall({
  activeCall,
  isCameraOff,
  setIsCameraOff,
  isMuted,
  setIsMuted,
  handleHangUp,
}: {
  activeCall: any;
  isCameraOff: boolean;
  setIsCameraOff: (v: boolean) => void;
  isMuted: boolean;
  setIsMuted: (v: boolean) => void;
  handleHangUp: () => void;
}) {
  const appId = import.meta.env.VITE_AGORA_APP_ID;
  const channelName = activeCall?.room_name;

  // -------------------------------------------------------------------
  // 1️⃣ Fetch Agora token for this call (backend endpoint)
  // -------------------------------------------------------------------
  const { data, error, isLoading } = useSWR(
    activeCall ? `/calls/${activeCall.id}/token` : null,
    (url: string) => fetch(url, { credentials: 'include' }).then((res) => {
      if (!res.ok) throw new Error('Failed to fetch token');
      return res.json();
    }),
    { revalidateOnFocus: false }
  );

  // -------------------------------------------------------------------
  // 2️⃣ Create Agora client (must be called unconditionally — React hook)
  // -------------------------------------------------------------------
  const client = useRTCClient(AgoraRTC.createClient({ codec: 'vp8', mode: 'rtc' }));

  // -------------------------------------------------------------------
  // 3️⃣ Guard clauses (missing appId or token loading/error)
  //    Placed AFTER all hooks to satisfy React rules of hooks
  // -------------------------------------------------------------------
  if (!appId) {
    return (
      <div className="fixed inset-0 z-50 bg-neutral-900 flex flex-col items-center justify-center text-white p-8 text-center">
        <PhoneOff className="w-12 h-12 text-[#E1005E] mb-4" />
        <h2 className="text-xl font-bold mb-2">Konfigurasi Agora Belum Selesai</h2>
        <p className="text-neutral-400 mb-8">
          Harap isi VITE_AGORA_APP_ID di file .env dengan App ID dari dashboard Agora.
        </p>
        <button onClick={handleHangUp} className="bg-[#E1005E] px-6 py-3 rounded-xl font-bold active:scale-95">
          Tutup Panggilan
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 bg-neutral-900 flex items-center justify-center text-white">
        <Loader2 className="animate-spin w-8 h-8 mr-2" />
        <span>Memuat token…</span>
      </div>
    );
  }

  if (error || !data?.token) {
    return (
      <div className="fixed inset-0 z-50 bg-neutral-900 flex flex-col items-center justify-center text-white p-8 text-center">
        <PhoneOff className="w-12 h-12 text-[#E1005E] mb-4" />
        <h2 className="text-xl font-bold mb-2">Gagal Mengambil Token Agora</h2>
        <p className="text-neutral-400 mb-8">{error?.message || 'Coba lagi nanti.'}</p>
        <button onClick={handleHangUp} className="bg-[#E1005E] px-6 py-3 rounded-xl font-bold active:scale-95">
          Tutup Panggilan
        </button>
      </div>
    );
  }

  // -------------------------------------------------------------------
  // 4️⃣ Render — token + appId are ready. AgoraRTCProvider wraps
  //    ActiveCallUI which calls useJoin inside the provider context.
  // -------------------------------------------------------------------
  return (
    <AgoraRTCProvider client={client}>
      <ActiveCallUI
        channelName={channelName}
        appId={appId}
        token={data.token}
        uid={data.uid?.toString()}
        isCameraOff={isCameraOff}
        setIsCameraOff={setIsCameraOff}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        handleHangUp={handleHangUp}
      />
    </AgoraRTCProvider>
  );
}
