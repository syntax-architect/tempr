import React, { useRef, useState } from 'react';
import { ResponsiveSheet } from '../common/ResponsiveSheet';
import { Camera, Upload, FileText, ShieldCheck, MessageSquare, Mail } from 'lucide-react';
import { SIMULATOR_PRESETS } from '../../data/mockData';
import { CameraCaptureModal } from '../camera/CameraCaptureModal';
import { IntakeConfigModal } from '../intake/IntakeConfigModal';

interface CaptureChoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFile: (file: File) => void;
  onSelectPreset: (presetId: string) => void;
}

export const CaptureChoiceModal: React.FC<CaptureChoiceModalProps> = ({
  isOpen,
  onClose,
  onSelectFile,
  onSelectPreset,
}) => {
  const [isLiveCameraOpen, setIsLiveCameraOpen] = useState(false);
  const [isIntakeModalOpen, setIsIntakeModalOpen] = useState(false);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('File exceeds 10MB limit. Please provide a file <= 10MB.');
      return;
    }

    const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/webp'];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(pdf|png|jpe?g|webp)$/i)) {
      alert('Unsupported file type. Please upload a PDF or image (PNG/JPEG/WEBP).');
      return;
    }

    onSelectFile(file);
    onClose();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('File exceeds 10MB limit. Please provide a file <= 10MB.');
        return;
      }
      onSelectFile(file);
      onClose();
    }
  };

  return (
    <ResponsiveSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Capture Mill Test Certificate (MTC)"
      description="Scan or upload an EN 10204 3.1 mill certificate from Tata Steel, SAIL, JSW, or Jindal."
    >
      <div className="space-y-4">
        {/* Hidden Native File Inputs */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFileChange}
        />
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Primary Action 1: Camera Photo Capture */}
        <button
          onClick={() => {
            if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
              setIsLiveCameraOpen(true);
            } else {
              cameraInputRef.current?.click();
            }
          }}
          className="w-full flex items-center justify-between p-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white transition-all shadow-md touch-target cursor-pointer group"
        >
          <div className="flex items-center gap-3.5 text-left">
            <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-xs sm:text-sm">Snap Photo with Camera</div>
              <div className="text-xs text-emerald-100 font-mono mt-0.5">
                Multi-page optical capture with automatic glare &amp; blur check
              </div>
            </div>
          </div>
          <span className="text-xs font-mono font-semibold px-2 py-1 rounded bg-white/20 text-white shrink-0">
            CAM
          </span>
        </button>

        {/* Primary Action 2: Document / PDF Upload & Drag-and-drop */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 rounded-2xl p-5 text-center cursor-pointer bg-slate-50 dark:bg-slate-800/50 hover:bg-emerald-50/20 transition-all touch-target"
        >
          <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center mx-auto mb-2 text-slate-700 dark:text-slate-300">
            <Upload className="w-5 h-5" />
          </div>
          <div className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
            Upload PDF or Certificate Scan
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Tap to browse files or drag &amp; drop here (PDF, PNG, JPG up to 10MB)
          </p>
        </div>

        {/* Primary Action 3: WhatsApp & Email Intake (Prompt P3) */}
        <button
          onClick={() => setIsIntakeModalOpen(true)}
          className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500 text-left transition-all touch-target cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                <span>Send via WhatsApp or Email</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 font-semibold">
                  P3 INTAKE
                </span>
              </div>
              <div className="text-xs text-slate-400 font-mono mt-0.5">
                WhatsApp +91 98300 22000 · Inbound Mailbox
              </div>
            </div>
          </div>
          <span className="text-xs font-mono font-semibold text-emerald-400 group-hover:translate-x-0.5 transition-transform">
            Connect →
          </span>
        </button>

        {/* Quick-Load Sample Presets */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">
              Or Try A Sample Certificate
            </span>
            <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-medium">
              Verified Specs
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {SIMULATOR_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => {
                  onSelectPreset(preset.id);
                  onClose();
                }}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 bg-white dark:bg-slate-800 text-left transition-all touch-target cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                    <FileText className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className="truncate">{preset.mill || preset.title}</span>
                  </div>
                  <div className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-1">
                    Heat #{preset.heatNumber}
                  </div>
                </div>
                <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold mt-2">
                  {preset.code}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Security & Cryptographic Guarantee Notice */}
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono pt-1">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Original PDFs preserved untouched with SHA-256 integrity hash.</span>
        </div>
      </div>

      {/* Live Viewfinder & Optical Quality Evaluation Modal */}
      <CameraCaptureModal
        isOpen={isLiveCameraOpen}
        onClose={() => setIsLiveCameraOpen(false)}
        onCaptureComplete={(files) => {
          if (files.length > 0) {
            onSelectFile(files[0]);
            onClose();
          }
        }}
      />

      {/* WhatsApp & Email Intake Configuration Modal (Prompt P3) */}
      {isIntakeModalOpen && (
        <IntakeConfigModal
          isOpen={isIntakeModalOpen}
          onClose={() => setIsIntakeModalOpen(false)}
        />
      )}
    </ResponsiveSheet>
  );
};
