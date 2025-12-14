import { Play } from "lucide-react";
import { useState } from "react";

interface VideoPlayerProps {
  videoUrl: string;
  thumbnail?: string;
}

export function VideoPlayer({ videoUrl, thumbnail }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  // Simple check to see if we have a valid video URL to show
  if (!videoUrl) return null;

  // Helper to extract embed ID if user pastes full link (basic support)
  const getEmbedUrl = (url: string) => {
    if (url.includes("embed")) return url;
    if (url.includes("watch?v=")) return url.replace("watch?v=", "embed/");
    if (url.includes("youtu.be/")) return url.replace("youtu.be/", "www.youtube.com/embed/");
    return url;
  };

  const embedUrl = getEmbedUrl(videoUrl);

  return (
    <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-lg border border-white/50 bg-black relative group mb-8">
      {!isPlaying ? (
        <div
          className="absolute inset-0 flex items-center justify-center cursor-pointer"
          onClick={() => setIsPlaying(true)}
        >
          {/* Thumbnail Background */}
          {thumbnail ? (
            <img
              src={thumbnail}
              alt="Video thumbnail"
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <>
              <div className="absolute inset-0 bg-zinc-900" />
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 via-black/80 to-purple-900/40" />
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay" />
            </>
          )}

          {/* Dark overlay for better play button visibility */}
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />

          <div className="relative z-20 flex flex-col items-center gap-4 transition-transform duration-500 group-hover:scale-105">
            <div className="relative">
              <div className="absolute -inset-4 bg-white/20 rounded-full blur-xl animate-pulse" />
              <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-2xl group-hover:bg-white/25 transition-all duration-300 ring-1 ring-white/10">
                <Play className="w-8 h-8 text-white ml-1 fill-white shadow-sm" />
              </div>
            </div>
            <span className="text-white font-medium text-sm tracking-widest uppercase opacity-90 group-hover:opacity-100 transition-opacity drop-shadow-lg">Watch My Story</span>
          </div>
        </div>
      ) : (
        <iframe
          width="100%"
          height="100%"
          src={`${embedUrl}?autoplay=1`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0"
        />
      )}
    </div>
  );
}
