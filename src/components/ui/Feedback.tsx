import React, { useRef, useState } from 'react';
import { UploadCloud, Camera, Info, AlertTriangle, FileWarning, X } from 'lucide-react';
import { haptics } from '../../lib/motion';

export const Skeleton: React.FC<{
  className?: string;
  width?: string | number;
  height?: string | number;
}> = ({ className = '', width, height }) => {
  return (
    <div
      className={`relative overflow-hidden rounded-lg bg-surface-2/80 before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.8s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent ${className}`}
      style={{ width, height }}
    />
  );
};

export const ProgressRing: React.FC<{
  progress: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  className?: string;
}> = ({ progress, size = 48, strokeWidth = 4, className = '' }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, progress));
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="stroke-surface-2"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="stroke-emerald-500 transition-all duration-300 ease-out"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      <span className="absolute font-mono text-xs font-bold text-text">{Math.round(clamped)}%</span>
    </div>
  );
};

export type BannerVariant = 'info' | 'warning' | 'draft';

export const Banner: React.FC<{
  variant?: BannerVariant;
  title: string;
  message?: string;
  onClose?: () => void;
  className?: string;
}> = ({ variant = 'info', title, message, onClose, className = '' }) => {
  const config = {
    info: {
      bg: 'bg-sky-500/10',
      border: 'border-sky-500/20',
      text: 'text-sky-400',
      icon: <Info className="w-4 h-4 shrink-0 text-sky-400" />,
    },
    warning: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      text: 'text-amber-400',
      icon: <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />,
    },
    draft: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      text: 'text-emerald-400',
      icon: <FileWarning className="w-4 h-4 shrink-0 text-emerald-400" />,
    },
  }[variant];

  return (
    <div
      role="alert"
      className={`flex items-start gap-3 p-3.5 rounded-xl border ${config.bg} ${config.border} text-left ${className}`}
    >
      <div className="mt-0.5">{config.icon}</div>
      <div className="flex-1 min-w-0">
        <h4 className={`text-xs font-semibold ${config.text}`}>{title}</h4>
        {message && <p className="text-xs text-text-muted mt-0.5 leading-relaxed">{message}</p>}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="p-1 rounded-md text-text-muted hover:text-text hover:bg-surface/50 shrink-0"
          aria-label="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

export interface FileDropzoneProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSizeMb?: number;
  isLoading?: boolean;
  className?: string;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({
  onFileSelect,
  accept = '.pdf,image/jpeg,image/png,image/heic',
  maxSizeMb = 25,
  isLoading = false,
  className = '',
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const validateAndPass = (file: File) => {
    setError(null);
    if (file.size > maxSizeMb * 1024 * 1024) {
      setError(`File size exceeds maximum allowed limit of ${maxSizeMb} MB.`);
      haptics.error();
      return;
    }
    haptics.success();
    onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndPass(e.dataTransfer.files[0]);
    }
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
      className={`relative p-6 rounded-2xl border-2 border-dashed transition-all text-center flex flex-col items-center justify-center gap-3 ${
        isDragOver
          ? 'border-emerald-500 bg-emerald-500/5 ring-4 ring-emerald-500/10'
          : 'border-border bg-surface-2/40 hover:border-emerald-500/40'
      } ${className}`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => e.target.files?.[0] && validateAndPass(e.target.files[0])}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && validateAndPass(e.target.files[0])}
      />

      <div className="w-12 h-12 rounded-2xl bg-surface border border-border shadow-inner flex items-center justify-center text-emerald-400">
        <UploadCloud className="w-6 h-6" />
      </div>

      <div>
        <h4 className="text-sm font-semibold text-text">Drag & drop Mill Certificate</h4>
        <p className="text-xs text-text-muted mt-0.5">
          PDF, JPG, PNG, or HEIC up to {maxSizeMb} MB
        </p>
      </div>

      <div className="flex items-center gap-2 mt-1">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-3.5 py-1.5 rounded-xl bg-surface border border-border hover:border-emerald-500/50 text-xs font-semibold text-text transition-all active:scale-95"
        >
          Browse Files
        </button>
        <button
          type="button"
          onClick={() => cameraInputRef.current?.click()}
          className="px-3.5 py-1.5 rounded-xl bg-surface-2 border border-border hover:border-emerald-500/50 text-xs font-semibold text-text transition-all flex items-center gap-1.5 active:scale-95 sm:hidden"
        >
          <Camera className="w-3.5 h-3.5 text-emerald-400" />
          <span>Camera</span>
        </button>
      </div>

      {error && <span className="text-xs text-danger font-medium mt-1">{error}</span>}
    </div>
  );
};
