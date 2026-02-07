import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import type { Theme } from '@/lib/themes';
import type { StoriesItem } from '@/types/database';

// Combined type for StoriesItem or CarouselImage
export type ReelItem = StoriesItem | {
  id: string;
  url: string;
  type?: 'image' | 'video';
  thumbnail?: string;
  link?: string;
};

interface ReelViewerProps {
  items: ReelItem[];
  startIndex?: number;
  onClose: () => void;
  theme: Theme;
}

export function ReelViewer({ items, startIndex = 0, onClose, theme }: ReelViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragCurrentY, setDragCurrentY] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Initialize video refs
  useEffect(() => {
    videoRefs.current = videoRefs.current.slice(0, items.length);
  }, [items]);

  // Scroll to initial index
  useEffect(() => {
    if (containerRef.current) {
      const scrollToIndex = (index: number) => {
        const itemHeight = window.innerHeight;
        containerRef.current?.scrollTo({
          top: index * itemHeight,
          behavior: 'smooth'
        });
      };
      scrollToIndex(startIndex);
    }
  }, [startIndex]);

  // Handle video play/pause based on visibility
  useEffect(() => {
    const handleScroll = () => {
      const viewportHeight = window.innerHeight;
      const scrollTop = containerRef.current?.scrollTop || 0;

      videoRefs.current.forEach((video, index) => {
        if (!video) return;

        const itemTop = index * viewportHeight;
        const itemBottom = itemTop + viewportHeight;
        const isVisible = scrollTop >= itemTop - viewportHeight / 2 && scrollTop < itemBottom - viewportHeight / 2;

        if (isVisible) {
          video.currentTime = 0;
          video.play().catch(() => {});
        } else {
          video.pause();
          video.currentTime = 0;
        }
      });

      // Update current index
      const newIndex = Math.round(scrollTop / viewportHeight);
      setCurrentIndex(Math.min(Math.max(newIndex, 0), items.length - 1));
    };

    containerRef.current?.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => {
      containerRef.current?.removeEventListener('scroll', handleScroll);
      videoRefs.current.forEach(video => {
        video?.pause();
      });
    };
  }, [items]);

  // Auto-hide controls after 3 seconds
  useEffect(() => {
    const resetControlsTimeout = () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    };

    resetControlsTimeout();
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [currentIndex]);

  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  }, []);

  // Touch handlers for swipe to close
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setDragStartY(touch.clientY);
    setDragCurrentY(touch.clientY);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    setDragCurrentY(touch.clientY);
  };

  const handleTouchEnd = () => {
    const dragDistance = dragCurrentY - dragStartY;

    if (dragDistance > 100) {
      // Swipe down > 100px - close viewer
      onClose();
    } else {
      // Swipe < 100px - spring back to original position
      setDragCurrentY(0);
    }

    setIsDragging(false);
    setDragStartY(0);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragStartY(e.clientY);
    setDragCurrentY(e.clientY);
    setIsDragging(true);
  };

  const handleMouseMoveDrag = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setDragCurrentY(e.clientY);
  };

  const handleMouseUp = () => {
    const dragDistance = dragCurrentY - dragStartY;

    if (dragDistance > 100) {
      onClose();
    } else {
      setDragCurrentY(0);
    }

    setIsDragging(false);
    setDragStartY(0);
  };

  const togglePlayPause = (index: number) => {
    const video = videoRefs.current[index];
    if (video) {
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
      setShowControls(true);
    }
  };

  const toggleMute = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    const video = videoRefs.current[index];
    if (video) {
      video.muted = !video.muted;
      setIsMuted(!isMuted);
      setShowControls(true);
    }
  };

  const getItemType = (item: ReelItem): 'image' | 'video' => {
    if ('type' in item && item.type) {
      return item.type;
    }
    // Default to image if type is not specified
    return 'image';
  };

  const getItemUrl = (item: ReelItem): string => {
    return item.url;
  };

  const getItemThumbnail = (item: ReelItem): string | undefined => {
    if ('thumbnail' in item) {
      return item.thumbnail;
    }
    return undefined;
  };

  const getItemLink = (item: ReelItem): string | undefined => {
    if ('link' in item) {
      return item.link;
    }
    return undefined;
  };

  // Get visible dots (max 3 at a time)
  const getVisibleDots = () => {
    if (items.length <= 3) return items;
    const start = Math.max(0, currentIndex - 1);
    const end = Math.min(items.length, start + 3);
    return items.slice(start, end);
  };

  const visibleStartIndex = items.length <= 3 ? 0 : Math.max(0, currentIndex - 1);

  return (
    <div
      className="fixed inset-0 z-50 bg-black"
      style={{
        width: '100vw',
        height: '100vh',
        background: '#000000'
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMoveDrag}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Close Button - Fixed in top right corner with z-index 50, padding 16px, white color */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="fixed top-0 right-0 z-50 p-4 text-white hover:bg-black/50 transition-colors"
        style={{ padding: '16px', zIndex: 50 }}
      >
        <X className="h-6 w-6" />
      </button>

      {/* Scroll Container */}
      <div
        ref={containerRef}
        className="h-full overflow-y-scroll scroll-smooth"
        style={{
          scrollSnapType: 'y mandatory',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
        onMouseMove={handleMouseMove}
      >
        {items.map((item, index) => (
          <div
            key={item.id}
            className="relative flex items-center justify-center"
            style={{
              width: '100%',
              height: '100vh',
              scrollSnapAlign: 'start',
              transform: isDragging && index === currentIndex
                ? `translateY(${Math.max(0, dragCurrentY - dragStartY)}px)`
                : 'none',
              opacity: isDragging && index === currentIndex && dragCurrentY - dragStartY > 0
                ? 1 - ((dragCurrentY - dragStartY) / window.innerHeight)
                : 1,
              transition: isDragging ? 'none' : 'transform 0.3s ease-out, opacity 0.3s ease-out'
            }}
          >
            {/* Content Container - 100% width, dynamic height for aspect ratio */}
            <div
              className="relative w-full flex items-center justify-center"
              onMouseMove={() => index === currentIndex && handleMouseMove()}
            >
              {getItemType(item) === 'image' ? (
                <img
                  src={getItemUrl(item)}
                  alt={`Reel item ${index + 1}`}
                  className="w-full h-full object-contain"
                  style={{ maxWidth: '100%', maxHeight: '100vh' }}
                />
              ) : (
                <div className="relative w-full h-full flex items-center justify-center">
                  <video
                    ref={(el) => (videoRefs.current[index] = el)}
                    src={getItemUrl(item)}
                    autoPlay
                    muted={isMuted}
                    playsInline
                    loop
                    className="w-full h-full object-contain"
                    style={{ maxWidth: '100%', maxHeight: '100vh' }}
                    onClick={() => togglePlayPause(index)}
                  />

                  {/* Play/Pause Button - Center, auto-hides after 3s */}
                  {showControls && getItemType(item) === 'video' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePlayPause(index);
                      }}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 bg-black/50 hover:bg-black/70 rounded-full text-white transition-all"
                    >
                      {videoRefs.current[index]?.paused ? (
                        <Play className="h-12 w-12" />
                      ) : (
                        <Pause className="h-12 w-12" />
                      )}
                    </button>
                  )}

                  {/* Mute/Unmute Button - Bottom right corner */}
                  {showControls && getItemType(item) === 'video' && (
                    <button
                      onClick={(e) => toggleMute(e, index)}
                      className="absolute bottom-8 right-8 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-all"
                    >
                      {isMuted ? (
                        <VolumeX className="h-6 w-6" />
                      ) : (
                        <Volume2 className="h-6 w-6" />
                      )}
                    </button>
                  )}
                </div>
              )}

              {/* Link overlay */}
              {getItemLink(item) && (
                <a
                  href={getItemLink(item)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-24 left-1/2 -translate-x-1/2 px-6 py-3 bg-white/90 text-black rounded-full font-medium hover:bg-white transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  Ver mais
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Dots - Vertical dots on the right side, showing 3 at a time if > 3 items */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-40">
        {getVisibleDots().map((_, i) => {
          const actualIndex = visibleStartIndex + i;
          return (
            <div
              key={actualIndex}
              className={`w-2 h-2 rounded-full transition-all ${
                actualIndex === currentIndex ? 'bg-white scale-125' : 'bg-white/40'
              }`}
            />
          );
        })}
      </div>

      {/* Swipe indicator - only show when dragging down */}
      {isDragging && dragCurrentY - dragStartY > 50 && (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/80 z-50">
          <div className="w-12 h-1 bg-white/60 rounded-full" />
          <p className="text-sm">Deslize para fechar</p>
        </div>
      )}
    </div>
  );
}
