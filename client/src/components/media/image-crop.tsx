import React, { useState, useCallback, useRef } from 'react';
import Cropper from 'react-easy-crop';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { X, Check, ZoomIn, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Area {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface PixelCrop extends Area {
  width: number;
  height: number;
}

export interface ImageCropProps {
  imageUrl: string;
  onCropComplete: (data: {
    croppedArea: Area;
    croppedAreaPixels: PixelCrop;
    croppedImageUrl: string;
  }) => void;
  aspectRatio?: number;
  initialZoom?: number;
  onCancel?: () => void;
}

export function ImageCrop({
  imageUrl,
  onCropComplete,
  aspectRatio = 1,
  initialZoom = 1,
  onCancel,
}: ImageCropProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(initialZoom);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<PixelCrop | null>(null);
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const onCropCompleteHandler = useCallback(
    (_croppedArea: Area, croppedAreaPixelsResult: PixelCrop) => {
      setCroppedAreaPixels(croppedAreaPixelsResult);
    },
    []
  );

  const generateCroppedImage = useCallback(async () => {
    if (!croppedAreaPixels || !imageRef.current) return null;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) return null;

    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;

    // Draw the cropped image onto the canvas
    ctx.drawImage(
      imageRef.current,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );

    // Get the base64 representation of the cropped image
    const base64 = canvas.toDataURL('image/jpeg', 0.95);
    return base64;
  }, [croppedAreaPixels]);

  const handleConfirm = useCallback(async () => {
    if (!croppedAreaPixels) return;

    setIsProcessing(true);

    try {
      const croppedImage = await generateCroppedImage();

      if (croppedImage) {
        setCroppedImageUrl(croppedImage);
        onCropComplete({
          croppedArea: {
            x: crop.x,
            y: crop.y,
            width: croppedAreaPixels.width,
            height: croppedAreaPixels.height,
          },
          croppedAreaPixels,
          croppedImageUrl: croppedImage,
        });
      }
    } catch (error) {
      console.error('Error cropping image:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [croppedAreaPixels, crop, generateCroppedImage, onCropComplete]);

  const handleZoomChange = useCallback((value: number[]) => {
    setZoom(value[0]);
  }, []);

  const handleImageError = useCallback(() => {
    console.error('Failed to load image for cropping:', imageUrl);
    setImageError(true);
  }, [imageUrl]);

  const handleImageLoad = useCallback(() => {
    console.log('Image loaded successfully for cropping');
    setImageLoaded(true);
  }, []);

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Hidden image ref for canvas operations */}
      <img
        ref={imageRef}
        src={imageUrl}
        alt="Crop source"
        className="hidden"
        crossOrigin="anonymous"
        onError={handleImageError}
        onLoad={handleImageLoad}
      />

      {/* Error state */}
      {imageError && (
        <div className="flex flex-col items-center justify-center p-8 bg-red-50 rounded-lg border border-red-200">
          <AlertCircle className="h-12 w-12 text-red-500 mb-3" />
          <p className="text-red-700 font-medium">Falha ao carregar imagem</p>
          <p className="text-red-600 text-sm mt-1">Verifique se a URL está correta</p>
        </div>
      )}

      {/* Crop area - only render when image is loaded without errors */}
      {!imageError && (
        <div className="relative w-full bg-black/5 rounded-lg overflow-hidden" style={{ minHeight: '300px', height: '400px' }}>
          <Cropper
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatio}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropCompleteHandler}
            cropShape="rect"
            showGrid={true}
            style={{
              containerStyle: {
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
              },
              cropAreaStyle: {
                border: '2px dashed #ffffff',
              },
              mediaStyle: {
                transform: `translate(${crop.x}px, ${crop.y}px) scale(${zoom})`,
              },
            }}
            minZoom={1}
            maxZoom={3}
            restrictPosition={true}
          />
        </div>
      )}

      {/* Zoom slider - Height exactly 48px with theme primary color */}
      {!imageError && (
        <div className="flex items-center gap-4 w-full h-[48px]">
          <ZoomIn className="h-5 w-5 text-primary flex-shrink-0" />
          <Slider
            value={[zoom]}
            onValueChange={handleZoomChange}
            min={1}
            max={3}
            step={0.01}
            className="flex-1"
          />
          <span className="text-sm text-muted-foreground font-medium w-12 text-right flex-shrink-0">
            {Math.round(zoom * 100)}%
          </span>
        </div>
      )}

      {/* Action buttons - 48% width each */}
      <div className="flex gap-4 w-full">
        {onCancel && (
          <Button
            variant="outline"
            onClick={onCancel}
            className="w-[48%] h-12 text-base font-medium"
            disabled={isProcessing}
          >
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
        )}
        <Button
          onClick={handleConfirm}
          className="w-[48%] h-12 text-base font-medium bg-primary hover:bg-primary/90"
          disabled={isProcessing || !croppedAreaPixels || imageError}
        >
          {isProcessing ? (
            <>
              <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              Processando...
            </>
          ) : (
            <>
              <Check className="h-4 w-4 mr-2" />
              Confirmar
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
