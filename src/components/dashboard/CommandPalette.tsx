import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import {
  Search,
  LayoutDashboard,
  FlaskConical,
  Database,
  Stamp,
  FileCode,
  Building2,
  Moon,
  Sun,
  ShieldCheck,
  KeyRound,
  Upload,
  ArrowRight,
  FileText,
  Sliders,
  X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

export interface CommandItem {
  id: string;
  title: string;
  category: 'Navigation' | 'Actions' | 'Tools';
  keywords: string[];
  icon: React.FC<{ className?: string }>;
  onSelect: () => void;
  shortcut?: string;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerCapture: () => void;
  onTriggerPlantSwitch: () => void;
  onTriggerSecurity: () => void;
  onTriggerPinModal: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onTriggerCapture,
  onTriggerPlantSwitch,
  onTriggerSecurity,
  onTriggerPinModal,
}) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Global Ctrl+K / Cmd+K listener handled in parent or here
  const commands: CommandItem[] = useMemo(
    () => [
      {
        id: 'nav-home',
        title: 'Command Center & Shipments',
        category: 'Navigation',
        keywords: ['home', 'dashboard', 'shipments', 'overview', 'consignments'],
        icon: LayoutDashboard,
        onSelect: () => navigate('/app/shipments'),
        shortcut: 'G H',
      },
      {
        id: 'nav-workbench',
        title: 'MTC Workbench & Vision OCR',
        category: 'Navigation',
        keywords: ['mtc', 'workbench', 'ocr', 'certificates', 'chemistry', 'spectrometer'],
        icon: FlaskConical,
        onSelect: () => navigate('/app/certificates'),
        shortcut: 'G W',
      },
      {
        id: 'nav-signoff',
        title: 'Clause 6 Digital Sign-Off Queue',
        category: 'Navigation',
        keywords: ['sign', 'sign-off', 'queue', 'clause 6', 'signature', 'inspector', 'approve'],
        icon: Stamp,
        onSelect: () => navigate('/app/sign-off'),
        shortcut: 'G S',
      },
      {
        id: 'nav-heats',
        title: 'Heat Inventory & Mass Balance',
        category: 'Navigation',
        keywords: ['heat', 'heats', 'inventory', 'mass balance', 'ladle', 'chemistry', 'billet'],
        icon: Database,
        onSelect: () => navigate('/app/heats'),
        shortcut: 'G I',
      },
      {
        id: 'nav-cbam',
        title: 'CBAM Customs Dossiers & XML',
        category: 'Navigation',
        keywords: ['cbam', 'dossier', 'customs', 'xml', 'emissions', 'annex', 'export'],
        icon: FileCode,
        onSelect: () => navigate('/app/dossiers'),
        shortcut: 'G D',
      },
      {
        id: 'nav-suppliers',
        title: 'Supplier Registry & Upstream Mills',
        category: 'Navigation',
        keywords: ['supplier', 'suppliers', 'mills', 'tata', 'sail', 'jsw', 'vendor'],
        icon: Building2,
        onSelect: () => navigate('/app/suppliers'),
      },
      {
        id: 'nav-reports',
        title: 'Compliance Reports & Verification Log',
        category: 'Navigation',
        keywords: ['reports', 'audit', 'compliance', 'log', 'export', 'registry'],
        icon: FileText,
        onSelect: () => navigate('/app/reports'),
      },
      {
        id: 'nav-settings',
        title: 'Factory Settings & API Keys',
        category: 'Navigation',
        keywords: ['settings', 'config', 'api', 'keys', 'webhook', 'profile'],
        icon: Sliders,
        onSelect: () => navigate('/app/settings'),
      },
      {
        id: 'action-capture',
        title: 'Capture MTC or Export Invoice',
        category: 'Actions',
        keywords: ['upload', 'capture', 'camera', 'photo', 'pdf', 'scan'],
        icon: Upload,
        onSelect: onTriggerCapture,
        shortcut: 'U',
      },
      {
        id: 'action-plant',
        title: 'Switch Factory Installation',
        category: 'Actions',
        keywords: ['plant', 'switch', 'installation', 'howrah', 'raipur', 'kalinganagar'],
        icon: Building2,
        onSelect: onTriggerPlantSwitch,
        shortcut: 'P',
      },
      {
        id: 'action-theme',
        title: `Switch Theme to ${theme === 'dark' ? 'Precision Daylight (Light)' : 'Obsidian Forge (Dark)'}`,
        category: 'Tools',
        keywords: ['theme', 'dark', 'light', 'mode', 'color'],
        icon: theme === 'dark' ? Sun : Moon,
        onSelect: toggleTheme,
        shortcut: 'T',
      },
      {
        id: 'action-telemetry',
        title: 'Security Telemetry & Cryptographic Verification',
        category: 'Tools',
        keywords: ['security', 'telemetry', 'audit', 'sha-256', 'cryptography', 'shield'],
        icon: ShieldCheck,
        onSelect: onTriggerSecurity,
      },
      {
        id: 'action-pin',
        title: 'Inspector Step-Up PIN Challenge',
        category: 'Tools',
        keywords: ['pin', 'inspector', 'passkey', 'auth', '2fa', 'step up'],
        icon: KeyRound,
        onSelect: onTriggerPinModal,
      },
    ],
    [navigate, onTriggerCapture, onTriggerPlantSwitch, onTriggerSecurity, onTriggerPinModal, theme, toggleTheme]
  );

  const filtered = useMemo(() => {
    if (!query.trim()) return commands;
    const q = query.toLowerCase().trim();
    return commands.filter((cmd) => {
      if (cmd.title.toLowerCase().includes(q)) return true;
      if (cmd.category.toLowerCase().includes(q)) return true;
      return cmd.keywords.some((k) => k.toLowerCase().includes(q));
    });
  }, [commands, query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % (filtered.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].onSelect();
        onClose();
      }
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md data-[state=open]:animate-fadeIn" />
        <Dialog.Content className="fixed left-1/2 top-[15%] z-50 w-[95%] max-w-xl -translate-x-1/2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden outline-none font-sans text-slate-900 dark:text-slate-100">
          {/* Search Header Input */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <Search className="w-5 h-5 text-emerald-500 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search commands, views, heats, or actions... (Cmd+K)"
              className="flex-1 bg-transparent text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-xs font-mono bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded border border-slate-300 dark:border-slate-700">
              ESC
            </kbd>
          </div>

          {/* Results List */}
          <div className="max-h-[60vh] overflow-y-auto p-2 overscroll-contain">
            {filtered.length === 0 ? (
              <div className="p-8 text-center text-slate-400 dark:text-slate-500 text-xs">
                No matching actions or views found for &ldquo;{query}&rdquo;
              </div>
            ) : (
              <div className="space-y-1">
                {filtered.map((item, idx) => {
                  const Icon = item.icon;
                  const isSelected = idx === selectedIndex;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        item.onSelect();
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-all touch-target cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/30'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'bg-emerald-500 text-slate-950 font-bold'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="truncate">
                          <div className="text-xs font-semibold">{item.title}</div>
                          <div className="text-xs text-slate-400 dark:text-slate-500 font-mono">
                            {item.category}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {item.shortcut && (
                          <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                            {item.shortcut}
                          </span>
                        )}
                        {isSelected && <ArrowRight className="w-3.5 h-3.5 text-emerald-500" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer Quick Keys Hint */}
          <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
            <div className="flex items-center gap-3">
              <span>↑↓ Navigate</span>
              <span>↵ Select</span>
              <span>ESC Close</span>
            </div>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">HeatLedger Search</span>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
