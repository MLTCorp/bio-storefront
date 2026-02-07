import { useState, useEffect, useRef, useCallback } from "react";
import { Play, X, ChevronLeft, ChevronRight, ArrowUp, ArrowDown } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import type { Theme } from "@/lib/themes";
import type { StoriesConfig, StoriesItem } from "@/types/database";
import { ReelViewer } from "@/components/media/reel-viewer";

interface StoriesRendererProps {
  config: StoriesConfig;
  theme: Theme;
  componentId?: number;
  pageId?: number;
  ownerId?: string;
}

// Analytics tracking function
const trackClick = (pageId: number | undefined, componentId: number, componentType: string, componentLabel: string, targetUrl: string, ownerId?: string) => {
  if (!pageId) return;
  fetch('/api/analytics/click', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      pageId,
      componentId,
      componentType,
      componentLabel,
      targetUrl,
      ownerId: ownerId || null
    })
  }).catch(() => {}); // Silently fail
};

// Progress Bar Component
function ProgressBar({ progress, paused }: { progress: number; paused: boolean }) {
  return (
    <div className="absolute top-0 left-0 right-0 h-1 bg-white/20">
      <div
        className={`h-full bg-white transition-all ease-linear ${paused ? '' : 'duration-100'}`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

export function StoriesRenderer({ config, theme, componentId, pageId, ownerId }: StoriesRendererProps) {
  const [emblaRef] = useEmblaCarousel({ loop: false });
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);
  const [currentViewerIndex, setCurrentViewerIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showReelViewer, setShowReelViewer] = useState(false);

  // Swipe gesture state
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchCurrent, setTouchCurrent] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const items = config.items || [];
  const viewerRef = useRef<HTMLDivElement>(null);

  // Get story duration
  const getStoryDuration = useCallback((item: StoriesItem): number => {
    if (item.type === 'video' && item.duration) {
      return item.duration * 1000; // Convert to milliseconds
    }
    return 5000; // Default 5 seconds for images
  }, []);

  // Auto-advance logic
  useEffect(() => {
    if (selectedStoryIndex === null || isPaused) return;

    const currentItem = items[selectedStoryIndex];
    const duration = getStoryDuration(currentItem);
    const interval = 50; // Update every 50ms for smooth progress
    const increment = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          // Move to next story
          if (selectedStoryIndex < items.length - 1) {
            setSelectedStoryIndex(selectedStoryIndex + 1);
            return 0;
          } else {
            // Close viewer at end
            setSelectedStoryIndex(null);
            return 0;
          }
        }
        return prev + increment;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [selectedStoryIndex, items, getStoryDuration, isPaused]);

  // Reset progress when story changes
  useEffect(() => {
    if (selectedStoryIndex !== null) {
      setCurrentViewerIndex(selectedStoryIndex);
      setProgress(0);
    }
  }, [selectedStoryIndex]);

  const handleStoryClick = (index: number) => {
    setSelectedStoryIndex(index);
    setCurrentViewerIndex(index);
    setProgress(0);
    trackClick(pageId, componentId || 0, 'stories', `Story ${index + 1}`, '', ownerId);
  };

  const handleCloseViewer = () => {
    setSelectedStoryIndex(null);
    setProgress(0);
    setIsPaused(false);
  };

  const handlePrevious = () => {
    if (currentViewerIndex > 0) {
      const newIndex = currentViewerIndex - 1;
      setCurrentViewerIndex(newIndex);
      setSelectedStoryIndex(newIndex);
      setProgress(0);
    }
  };

  const handleNext = () => {
    if (currentViewerIndex < items.length - 1) {
      const newIndex = currentViewerIndex + 1;
      setCurrentViewerIndex(newIndex);
      setSelectedStoryIndex(newIndex);
      setProgress(0);
    } else {
      handleCloseViewer();
    }
  };

  const handleSideClick = (side: 'left' | 'right') => {
    if (side === 'left') {
      handlePrevious();
    } else {
      handleNext();
    }
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (selectedStoryIndex === null) return;
    if (e.key === 'Escape') {
      handleCloseViewer();
    } else if (e.key === 'ArrowLeft') {
      handlePrevious();
    } else if (e.key === 'ArrowRight') {
      handleNext();
    }
  }, [selectedStoryIndex, handlePrevious, handleNext, handleCloseViewer]);

  useEffect(() => {
    if (selectedStoryIndex !== null) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [selectedStoryIndex, handleKeyDown]);

  const handleViewerClick = (e: React.MouseEvent) => {
    // Close on click outside
    if (e.target === viewerRef.current) {
      handleCloseViewer();
    }
  };

  const handleLinkClick = (item: StoriesItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.link) {
      trackClick(pageId, componentId || 0, 'stories', `Story ${items.indexOf(item) + 1} - link`, item.link, ownerId);
      window.open(item.link, '_blank');
    }
  };

  // Touch event handlers for swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    // Only handle gestures on viewer, not on preview
    if (selectedStoryIndex === null) return;

    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
    setTouchCurrent({ x: touch.clientX, y: touch.clientY });
    setIsDragging(true);
    setIsPaused(true); // Pause auto-play during interaction
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !touchStart || selectedStoryIndex === null) return;

    const touch = e.touches[0];
    setTouchCurrent({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging || !touchStart || !touchCurrent || selectedStoryIndex === null) {
      setIsDragging(false);
      setIsPaused(false);
      return;
    }

    const deltaX = touchCurrent.x - touchStart.x;
    const deltaY = touchCurrent.y - touchStart.y;

    // Determine if horizontal or vertical swipe (whichever has greater magnitude)
    const isHorizontal = Math.abs(deltaX) > Math.abs(deltaY);

    if (isHorizontal) {
      // Horizontal swipe: navigate between stories
      if (Math.abs(deltaX) > 100) {
        if (deltaX > 0) {
          // Swipe right - previous story
          handlePrevious();
        } else {
          // Swipe left - next story
          handleNext();
        }
      }
    } else {
      // Vertical swipe
      const currentItem = items[currentViewerIndex];

      if (deltaY < -150) {
        // Swipe up > 150px - open link
        if (currentItem?.link) {
          trackClick(pageId, componentId || 0, 'stories', `Story ${currentViewerIndex + 1} - link`, currentItem.link, ownerId);
          window.open(currentItem.link, '_blank');
        }
      } else if (deltaY > 100) {
        // Swipe down > 100px - close viewer
        handleCloseViewer();
      }
    }

    // Reset drag state
    setTouchStart(null);
    setTouchCurrent(null);
    setIsDragging(false);
    setIsPaused(false);
  };

  // Story size based on screen size
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
  const storySize = isMobile ? 72 : 80;

  // Calculate transform values for swipe feedback
  const getSwipeTransform = () => {
    if (!isDragging || !touchStart || !touchCurrent) return { transform: 'none', opacity: 1 };

    const deltaX = touchCurrent.x - touchStart.x;
    const deltaY = touchCurrent.y - touchStart.y;
    const isHorizontal = Math.abs(deltaX) > Math.abs(deltaY);

    if (isHorizontal) {
      // Horizontal swipe with fade based on distance
      const fade = 1 - Math.min(Math.abs(deltaX) / 200, 0.3);
      return {
        transform: `translateX(${deltaX}px)`,
        opacity: fade
      };
    } else {
      // Vertical swipe with fade
      const fade = 1 - Math.min(Math.abs(deltaY) / 200, 0.3);
      return {
        transform: `translateY(${deltaY}px)`,
        opacity: fade
      };
    }
  };

  const swipeStyle = getSwipeTransform();

  return (
    <div className="relative space-y-3">
      {/* Stories Carousel */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-3">
          {items.map((item, index) => (
            <button
              key={item.id}
              onClick={() => handleStoryClick(index)}
              className="flex-shrink-0 group relative"
              style={{ width: storySize, height: storySize }}
            >
              {/* Gradient Border Circle */}
              <div
                className="w-full h-full rounded-full p-[3px] flex items-center justify-center shadow-md"
                style={{
                  background: 'linear-gradient(to top right, #fbbf24, #ec4899)',
                }}
              >
                {/* Thumbnail */}
                <div className="w-full h-full rounded-full overflow-hidden border-2 border-white">
                  <img
                    src={item.thumbnail || item.url}
                    alt={`Story ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Type Badge */}
              <div className="absolute top-0 right-0 p-1 bg-black/60 rounded-full text-white text-[8px]">
                {item.type === 'image' ? '📷' : '▶️'}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Ver em Reels Button - Bottom right of the component */}
      {items.length > 0 && (
        <button
          onClick={() => setShowReelViewer(true)}
          className="absolute right-4 bottom-4 flex flex-col items-center gap-1 animate-pulse hover:scale-110 active:scale-95 transition-all z-10"
          title="Ver em tela cheia"
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg"
            style={{
              background: 'linear-gradient(to bottom, #8B5CF6, #3B82F6)',
            }}
          >
            <ArrowDown className="h-5 w-5" />
          </div>
          <span className="text-[12px] font-medium text-gray-600">
            Ver em Reels
          </span>
        </button>
      )}

      {/* Full Screen Viewer */}
      {selectedStoryIndex !== null && (
        <div
          ref={viewerRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={handleViewerClick}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center overflow-hidden"
          style={{ opacity: 0.9 }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Progress Bar */}
          {items.map((_, index) => (
            <ProgressBar
              key={index}
              progress={index < currentViewerIndex ? 100 : index > currentViewerIndex ? 0 : progress}
              paused={index === currentViewerIndex && isPaused}
            />
          ))}

          {/* Close Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCloseViewer();
            }}
            className="absolute top-4 right-4 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors z-50"
            style={{ padding: '12px' }}
          >
            <X className="h-6 w-6" />
          </button>

          {/* Navigation Areas - Desktop only (click areas) */}
          {!isMobile && (
            <>
              <div
                className="absolute left-0 top-0 bottom-0 w-1/3 cursor-pointer z-40"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSideClick('left');
                }}
              >
                {currentViewerIndex > 0 && (
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
                    <ChevronLeft className="h-6 w-6" />
                  </div>
                )}
              </div>

              <div
                className="absolute right-0 top-0 bottom-0 w-1/3 cursor-pointer z-40"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSideClick('right');
                }}
              >
                {currentViewerIndex < items.length - 1 && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
                    <ChevronRight className="h-6 w-6" />
                  </div>
                )}
              </div>
            </>
          )}

          {/* Swipe Direction Indicators (Mobile only, shown during swipe) */}
          {isMobile && isDragging && (
            <>
              {/* Left swipe indicator */}
              {touchCurrent && touchStart && touchCurrent.x < touchStart.x - 50 && (
                <div className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 rounded-full text-white animate-pulse z-40">
                  <ChevronLeft className="h-8 w-8" />
                </div>
              )}
              {/* Right swipe indicator */}
              {touchCurrent && touchStart && touchCurrent.x > touchStart.x + 50 && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 rounded-full text-white animate-pulse z-40">
                  <ChevronRight className="h-8 w-8" />
                </div>
              )}
              {/* Up swipe indicator (link) */}
              {touchCurrent && touchStart && touchCurrent.y < touchStart.y - 50 && items[currentViewerIndex]?.link && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 bg-white/20 rounded-full text-white animate-pulse z-40 flex flex-col items-center">
                  <ArrowUp className="h-8 w-8 mb-1" />
                  <span className="text-xs">Abrir link</span>
                </div>
              )}
              {/* Down swipe indicator (close) */}
              {touchCurrent && touchStart && touchCurrent.y > touchStart.y + 50 && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 p-4 bg-white/20 rounded-full text-white animate-pulse z-40 flex flex-col items-center">
                  <ArrowDown className="h-8 w-8 mb-1" />
                  <span className="text-xs">Fechar</span>
                </div>
              )}
            </>
          )}

          {/* Story Content */}
          <div
            className="relative max-w-full max-h-full flex items-center justify-center p-8 transition-transform ease-out"
            style={{
              transform: swipeStyle.transform,
              opacity: swipeStyle.opacity,
            }}
          >
            {items[currentViewerIndex] && (
              <div className="relative">
                {items[currentViewerIndex].type === 'image' ? (
                  <img
                    src={items[currentViewerIndex].url}
                    alt={`Story ${currentViewerIndex + 1}`}
                    className="max-w-full max-h-[80vh] object-contain rounded-lg"
                  />
                ) : (
                  <video
                    src={items[currentViewerIndex].url}
                    autoPlay
                    className="max-w-full max-h-[80vh] rounded-lg"
                  />
                )}

                {/* Link overlay - Desktop only */}
                {!isMobile && items[currentViewerIndex].link && (
                  <button
                    onClick={(e) => handleLinkClick(items[currentViewerIndex], e)}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 bg-white/90 text-black rounded-full font-medium hover:bg-white transition-colors flex items-center gap-2"
                  >
                    <ArrowUp className="h-4 w-4" />
                    Ver mais
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reel Viewer */}
      {showReelViewer && (
        <ReelViewer
          items={items}
          onClose={() => setShowReelViewer(false)}
          theme={theme}
        />
      )}

      {/* Empty state */}
      {items.length === 0 && (
        <div className="text-center py-8 text-gray-400 text-sm">
          Nenhum story configurado
        </div>
      )}
    </div>
  );
}
