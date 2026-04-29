import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { Loader2, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from './ui/button';

interface QrScannerProps {
  onScan: (decodedText: string) => void;
  onError?: (error: any) => void;
}

export function QrScanner({ onScan, onError }: QrScannerProps) {
  const [isStarting, setIsStarting] = useState(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [zoomSupported, setZoomSupported] = useState(false);
  const [zoomValue, setZoomValue] = useState(1);
  const [minZoom, setMinZoom] = useState(1);
  const [maxZoom, setMaxZoom] = useState(1);

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const regionId = 'qr-reader-region';

  useEffect(() => {
    let isMounted = true;

    const startScanner = async () => {
      try {
        const html5QrCode = new Html5Qrcode(regionId, {
          formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
          verbose: false,
        });
        scannerRef.current = html5QrCode;

        await html5QrCode.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
          },
          (decodedText) => {
            if (isMounted) onScan(decodedText);
          },
          (errorMessage) => {}
        );

        if (isMounted) {
          setIsStarting(false);

          // Check for zoom support
          try {
            const videoTrack = (html5QrCode as any).getRunningTrack();
            if (videoTrack) {
              const capabilities = videoTrack.getCapabilities() as any;
              if (capabilities && capabilities.zoom) {
                setZoomSupported(true);
                setMinZoom(capabilities.zoom.min || 1);
                setMaxZoom(capabilities.zoom.max || 1);
                setZoomValue(capabilities.zoom.min || 1);
              }
            }
          } catch (zoomErr) {
            console.log('Zoom not supported by this camera/browser', zoomErr);
          }
        }
      } catch (err: any) {
        console.error('Error starting camera:', err);
        if (isMounted) {
          setIsStarting(false);
          setCameraError(
            'Could not access camera. Please ensure you have granted permissions.'
          );
          if (onError) onError(err);
        }
      }
    };

    startScanner();

    return () => {
      isMounted = false;
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, [onScan, onError]);

  const handleZoomChange = async (newValue: number) => {
    if (!scannerRef.current || !zoomSupported) return;

    try {
      const videoTrack = (scannerRef.current as any)?.getRunningTrack();
      if (videoTrack) {
        await videoTrack.applyConstraints({
          advanced: [{ zoom: newValue }] as any,
        });
        setZoomValue(newValue);
      }
    } catch (err) {
      console.error('Error applying zoom:', err);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto aspect-square overflow-hidden rounded-3xl bg-black/40 border border-white/10 shadow-2xl backdrop-blur-sm">
      {isStarting && !cameraError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 z-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
          <p className="text-sm text-muted-foreground font-medium">
            Initializing camera...
          </p>
        </div>
      )}

      {cameraError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-background/95 z-20">
          <div className="w-12 h-12 rounded-full bg-destructive/20 flex items-center justify-center mb-4">
            <span className="text-xl">📷</span>
          </div>
          <p className="text-destructive font-semibold mb-2">Camera Error</p>
          <p className="text-sm text-muted-foreground">{cameraError}</p>
        </div>
      )}

      <div
        id={regionId}
        className="w-full h-full object-cover [&>video]:object-cover [&>video]:w-full [&>video]:h-full"
      />

      {!isStarting && !cameraError && (
        <>
          <div className="absolute inset-0 z-10 pointer-events-none border-[1px] border-primary/20 rounded-3xl overflow-hidden">
            <div className="absolute top-8 left-8 w-12 h-12 border-t-4 border-l-4 border-primary rounded-tl-xl"></div>
            <div className="absolute top-8 right-8 w-12 h-12 border-t-4 border-r-4 border-primary rounded-tr-xl"></div>
            <div className="absolute bottom-8 left-8 w-12 h-12 border-b-4 border-l-4 border-primary rounded-bl-xl"></div>
            <div className="absolute bottom-8 right-8 w-12 h-12 border-b-4 border-r-4 border-primary rounded-br-xl"></div>

            <div className="absolute top-8 left-8 right-8 bottom-8 overflow-hidden rounded-xl">
              <div className="scan-line"></div>
            </div>
          </div>

          {zoomSupported && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 pointer-events-auto">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/20 rounded-full"
                onClick={() =>
                  handleZoomChange(Math.max(minZoom, zoomValue - 0.5))
                }
                disabled={zoomValue <= minZoom}>
                <ZoomOut className="h-4 w-4" />
              </Button>

              <input
                type="range"
                min={minZoom}
                max={maxZoom}
                step="0.1"
                value={zoomValue}
                onChange={(e) => handleZoomChange(parseFloat(e.target.value))}
                className="w-24 h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-primary"
              />

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/20 rounded-full"
                onClick={() =>
                  handleZoomChange(Math.min(maxZoom, zoomValue + 0.5))
                }
                disabled={zoomValue >= maxZoom}>
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
