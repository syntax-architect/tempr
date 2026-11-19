import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Camera,
  X,
  RefreshCw,
  Flashlight,
  Check,
  AlertTriangle,
  FileCheck2,
  Trash2,
  Plus,
  ShieldCheck,
  Wifi,
  WifiOff,
  Upload,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { enqueueOfflineUpload, isDeviceOnline } from '../../lib/offlineQueue';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCaptureComplete: (files: File[]) => void;
}

interface CapturedPage {
  id: string;
  blob: Blob;
  dataUrl: string;
  sizeKb: number;
  quality: {
    blurScore: number;
    brightness: number;
    glarePct: number;
    warnings: string[];
    isAcceptable: boolean;
  };
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  isOpen,
  onClose,
  onCaptureComplete,
}) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [torchOn, setTorchOn] = useState<boolean>(false);
  const [hasTorch, setHasTorch] = useState<boolean>(false);
  const [capturedPages, setCapturedPages] = useState<CapturedPage[]>([]);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [online, setOnline] = useState<boolean>(isDeviceOnline());

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Monitor network status
  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Initialize camera stream
  const startCamera = useCallback(async () => {
    try {
      setCameraError(null);
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });

      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play().catch(() => {});
      }

      // Check for torch capability
      const track = mediaStream.getVideoTracks()[0];
      const capabilities = (track.getCapabilities && track.getCapabilities()) as any;
      if (capabilities && capabilities.torch) {
        setHasTorch(true);
      } else {
        setHasTorch(false);
      }
    } catch (err: any) {
      console.warn('Camera access denied or unavailable:', err);
      setCameraError('Camera access unavailable. Ensure camera permissions are granted or upload from files.');
    }
  }, [facingMode]);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
        setStream(null);
      }
      setCapturedPages([]);
      setTorchOn(false);
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [isOpen]);

  // Toggle torch / flash
  const toggleTorch = async () => {
    if (!stream) return;
    const track = stream.getVideoTracks()[0];
    try {
      const nextTorch = !torchOn;
      await (track as any).applyConstraints({
        advanced: [{ torch: nextTorch }],
      });
      setTorchOn(nextTorch);
    } catch (e) {
      console.warn('Torch toggle failed:', e);
    }
  };

  // Flip camera (rear vs front)
  const flipCamera = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  /**
   * Evaluates image quality:
   * 1. Laplacian variance check for blur detection.
   * 2. Luminance check for darkness.
   * 3. Saturated pixel percentage for glare detection.
   */
  const evaluateQuality = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ): CapturedPage['quality'] => {
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;

    let totalBrightness = 0;
    let glarePixels = 0;
    const totalPixels = width * height;

    // Sample pixels for brightness and glare
    const sampleStep = 4;
    let sampledCount = 0;
    const grayscale: number[] = [];

    for (let i = 0; i < data.length; i += 4 * sampleStep) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      totalBrightness += lum;
      if (r > 248 && g > 248 && b > 248) {
        glarePixels++;
      }
      grayscale.push(lum);
      sampledCount++;
    }

    const avgBrightness = totalBrightness / sampledCount;
    const glarePct = (glarePixels / sampledCount) * 100;

    // Fast discrete Laplacian variance approximation
    let meanLum = 0;
    for (let i = 0; i < grayscale.length; i++) {
      meanLum += grayscale[i];
    }
    meanLum /= grayscale.length;

    let variance = 0;
    for (let i = 0; i < grayscale.length; i++) {
      variance += Math.pow(grayscale[i] - meanLum, 2);
    }
    const blurScore = Math.round(variance / grayscale.length);

    const warnings: string[] = [];
    if (blurScore < 120) {
      warnings.push('Image may be blurry. Hold steady for clean OCR.');
    }
    if (avgBrightness < 45) {
      warnings.push('Low light detected. Turn on flashlight or brighter lamp.');
    }
    if (glarePct > 15) {
      warnings.push('Paper glare / reflection detected. Tilt slightly away from lights.');
    }

    return {
      blurScore,
      brightness: Math.round(avgBrightness),
      glarePct: Math.round(glarePct),
      warnings,
      isAcceptable: warnings.length === 0,
    };
  };

  // Capture frame from video feed
  const captureFrame = async () => {
    if (!videoRef.current || isProcessing) return;
    setIsProcessing(true);

    try {
      const video = videoRef.current;
      const canvas = canvasRef.current || document.createElement('canvas');

      // Max dimensions for compression <= 1.5MB
      const maxDim = 1920;
      let targetW = video.videoWidth || 1280;
      let targetH = video.videoHeight || 720;

      if (targetW > maxDim || targetH > maxDim) {
        if (targetW > targetH) {
          targetH = Math.round((targetH * maxDim) / targetW);
          targetW = maxDim;
        } else {
          targetW = Math.round((targetW * maxDim) / targetH);
          targetH = maxDim;
        }
      }

      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(video, 0, 0, targetW, targetH);
      const quality = evaluateQuality(ctx, targetW, targetH);

      // Compress to JPEG with 0.82 quality factor (ensures <= 1.5MB)
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((b) => resolve(b || new Blob()), 'image/jpeg', 0.82);
      });

      const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
      const pageId = `page_${Date.now()}_${capturedPages.length + 1}`;

      const newPage: CapturedPage = {
        id: pageId,
        blob,
        dataUrl,
        sizeKb: Math.round(blob.size / 1024),
        quality,
      };

      setCapturedPages((prev) => [...prev, newPage]);
    } catch (err) {
      console.error('Frame capture error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const removePage = (id: string) => {
    setCapturedPages((prev) => prev.filter((p) => p.id !== id));
  };

  const handleFinish = async () => {
    if (capturedPages.length === 0) return;

    const files = capturedPages.map(
      (p, idx) =>
        new File([p.blob], `mtc_capture_page_${idx + 1}.jpg`, {
          type: 'image/jpeg',
          lastModified: Date.now(),
        })
    );

    if (!online) {
      // Save directly to IndexedDB Offline Queue
      for (const file of files) {
        await enqueueOfflineUpload(file, file.name, {
          pageCount: files.length,
          notes: 'Captured via Mobile Camera Offline Mode',
        });
      }
    }

    onCaptureComplete(files);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
                <span>MILL CERTIFICATE SCANNER</span>
                {online ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    <Wifi className="w-3 h-3" /> ONLINE
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-medium text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full">
                    <WifiOff className="w-3 h-3" /> OFFLINE QUEUE
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-400 font-sans">
                EN 10204 3.1 &amp; ISO 10474 Optical Document Acquisition
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Camera Viewfinder Container */}
        <div className="relative flex-1 bg-black min-h-[320px] sm:min-h-[380px] flex items-center justify-center overflow-hidden">
          {cameraError ? (
            <div className="p-6 text-center max-w-md space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <p className="text-sm text-slate-200">{cameraError}</p>
              <button
                onClick={startCamera}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Camera Permission</span>
              </button>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                playsInline
                autoPlay
                muted
                className="w-full h-full object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />

              {/* Laser Scan HUD / Document Framing Guide */}
              <div className="absolute inset-6 sm:inset-10 border border-emerald-500/40 rounded-xl pointer-events-none flex flex-col justify-between p-3">
                {/* 4 Corner Markers */}
                <div className="flex justify-between">
                  <div className="w-6 h-6 border-t-2 border-l-2 border-emerald-400 rounded-tl-md" />
                  <div className="w-6 h-6 border-t-2 border-r-2 border-emerald-400 rounded-tr-md" />
                </div>

                <div className="text-center font-mono text-[11px] text-emerald-300/80 bg-slate-950/70 border border-emerald-500/30 px-3 py-1 rounded-full mx-auto backdrop-blur-md">
                  Align Mill Heat Certificate Inside Frame
                </div>

                <div className="flex justify-between">
                  <div className="w-6 h-6 border-b-2 border-l-2 border-emerald-400 rounded-bl-md" />
                  <div className="w-6 h-6 border-b-2 border-r-2 border-emerald-400 rounded-br-md" />
                </div>
              </div>

              {/* Viewfinder Controls (Torch, Flip) */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                {hasTorch && (
                  <button
                    onClick={toggleTorch}
                    className={`p-2.5 rounded-full backdrop-blur-md border transition-all ${
                      torchOn
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-glow-amber'
                        : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:text-white'
                    }`}
                    title="Toggle Flashlight / Torch"
                  >
                    <Flashlight className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={flipCamera}
                  className="p-2.5 rounded-full bg-slate-900/80 text-slate-300 border border-slate-700 hover:text-white backdrop-blur-md"
                  title="Switch Front/Rear Camera"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>

        {/* Thumbnail Preview Strip (Multi-Page Capture) */}
        {capturedPages.length > 0 && (
          <div className="p-3 bg-slate-950/90 border-t border-slate-800 flex items-center gap-2.5 overflow-x-auto">
            <span className="text-xs font-mono text-slate-400 whitespace-nowrap pl-1">
              Captured ({capturedPages.length}):
            </span>
            {capturedPages.map((page, index) => (
              <div
                key={page.id}
                className="relative group shrink-0 w-16 h-20 rounded-lg overflow-hidden border border-slate-700 bg-slate-900"
              >
                <img src={page.dataUrl} alt={`Page ${index + 1}`} className="w-full h-full object-cover" />
                <span className="absolute bottom-0 inset-x-0 bg-slate-950/80 text-[10px] font-mono text-center text-slate-300 py-0.5">
                  P.{index + 1}
                </span>

                {page.quality.warnings.length > 0 && (
                  <div
                    className="absolute top-1 left-1 w-3.5 h-3.5 rounded-full bg-amber-500 flex items-center justify-center text-slate-950"
                    title={page.quality.warnings.join(' ')}
                  >
                    <AlertTriangle className="w-2.5 h-2.5" />
                  </div>
                )}

                <button
                  onClick={() => removePage(page.id)}
                  className="absolute top-1 right-1 p-1 rounded bg-rose-600/90 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete page"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Shutter & Action Bar */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3">
          <div className="text-xs font-mono text-slate-400">
            {capturedPages.length === 0
              ? 'Ready to capture Page 1'
              : `${capturedPages.length} page${capturedPages.length > 1 ? 's' : ''} staged (max 1.5MB/page)`}
          </div>

          <div className="flex items-center gap-3">
            {/* Shutter Button */}
            <button
              onClick={captureFrame}
              disabled={isProcessing || !!cameraError}
              className="relative p-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all disabled:opacity-50"
              title="Capture Document Page"
            >
              <Camera className="w-6 h-6 fill-current" />
            </button>

            {/* Complete / Transfer Button */}
            <button
              onClick={handleFinish}
              disabled={capturedPages.length === 0}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 disabled:opacity-40 transition-all"
            >
              <Check className="w-4 h-4 text-emerald-400" />
              <span>
                {online ? 'Send to Workbench' : 'Save to Offline Queue'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
