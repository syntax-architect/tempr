import React from 'react';
import { Drawer } from 'vaul';
import {
  FileCode,
  FlaskConical,
  Database,
  Stamp,
  Building2,
  FileText,
  Sliders,
  ShieldCheck,
  KeyRound,
  Globe,
  Sun,
  Moon,
  ArrowLeft,
  X,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { PlantProfile } from './PlantSwitcherModal';
import { LanguageSwitcher } from '../navigation/LanguageSwitcher';

interface MobileMoreSheetProps {
  isOpen: boolean;
  onClose: () => void;
  activePlant: PlantProfile;
  onOpenPlantSwitcher: () => void;
  onOpenSecurity: () => void;
  onOpenPinModal: () => void;
}

export const MobileMoreSheet: React.FC<MobileMoreSheetProps> = ({
  isOpen,
  onClose,
  activePlant,
  onOpenPlantSwitcher,
  onOpenSecurity,
  onOpenPinModal,
}) => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, expiryTimerString } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleNavigate = (path: string) => {
    onClose();
    navigate(path);
  };

  return (
    <Drawer.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md" />
        <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 flex max-h-[92dvh] flex-col rounded-t-3xl bg-slate-900 border-t border-slate-800 text-white p-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] outline-none font-sans shadow-2xl">
          {/* Drag Handle */}
          <div className="mx-auto mb-3 h-1.5 w-12 shrink-0 rounded-full bg-slate-700" />

          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
                More Workspaces &amp; Controls
              </div>
              <button
                onClick={() => {
                  onClose();
                  onOpenPlantSwitcher();
                }}
                className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white mt-0.5 group cursor-pointer text-left"
              >
                <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-semibold underline decoration-slate-600 group-hover:decoration-emerald-400">
                  {activePlant.shortName}
                </span>
                <ChevronRight className="w-3 h-3 text-slate-500" />
              </button>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors touch-target flex items-center justify-center cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable Content Body */}
          <div className="pt-3 overflow-y-auto space-y-5 flex-1 overscroll-contain">
            {/* 1. Regulatory & Customs Group */}
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2 font-semibold">
                Customs &amp; Compliance
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleNavigate('/app/cbam')}
                  className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 hover:bg-slate-800 text-left transition-all touch-target cursor-pointer"
                >
                  <FileCode className="w-4 h-4 text-emerald-400 mb-1.5" />
                  <div className="text-xs font-bold text-white">CBAM Declarations</div>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">EU XML &amp; Scope</div>
                </button>

                <button
                  onClick={() => handleNavigate('/app/dossiers')}
                  className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 hover:bg-slate-800 text-left transition-all touch-target cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-cyan-400 mb-1.5" />
                  <div className="text-xs font-bold text-white">Customs Dossiers</div>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">ZIP Packages &amp; SHA</div>
                </button>

                <button
                  onClick={() => handleNavigate('/app/suppliers')}
                  className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 hover:bg-slate-800 text-left transition-all touch-target cursor-pointer"
                >
                  <Building2 className="w-4 h-4 text-amber-400 mb-1.5" />
                  <div className="text-xs font-bold text-white">Suppliers Registry</div>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">SAIL, Tata, JSW</div>
                </button>

                <button
                  onClick={() => handleNavigate('/app/reports')}
                  className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 hover:bg-slate-800 text-left transition-all touch-target cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-purple-400 mb-1.5" />
                  <div className="text-xs font-bold text-white">Audit Reports</div>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">Logs &amp; CSV Export</div>
                </button>
              </div>
            </div>

            {/* 2. Factory Workspaces */}
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2 font-semibold">
                Factory Workspaces
              </div>
              <div className="space-y-1.5">
                <button
                  onClick={() => handleNavigate('/app/certificates')}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 hover:bg-slate-800 transition-all touch-target text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                      <FlaskConical className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">MTC Workbench</div>
                      <div className="text-xs text-slate-400 font-mono">
                        PyMuPDF OCR, Chemical &amp; Mechanical Specs
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </button>

                <button
                  onClick={() => handleNavigate('/app/sign-off')}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 hover:bg-slate-800 transition-all touch-target text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
                      <Stamp className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Clause 6 Sign-Off Queue</div>
                      <div className="text-xs text-slate-400 font-mono">
                        Digital Signing with Ed25519 Keys
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                    3
                  </span>
                </button>

                <button
                  onClick={() => handleNavigate('/app/heats')}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 hover:bg-slate-800 transition-all touch-target text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                      <Database className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Heat Inventory &amp; Mass Balance</div>
                      <div className="text-xs text-slate-400 font-mono">
                        Ladle Tracking, Allocation &amp; Scrap
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </button>
              </div>
            </div>

            {/* 3. System & Tools */}
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2 font-semibold">
                Tools &amp; Telemetry
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    onClose();
                    onOpenSecurity();
                  }}
                  className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 hover:bg-slate-800 text-left transition-all touch-target cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400 mb-1.5" />
                  <div className="text-xs font-bold text-white">Security Telemetry</div>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">Live Hash Verification</div>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onOpenPinModal();
                  }}
                  className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 hover:bg-slate-800 text-left transition-all touch-target cursor-pointer"
                >
                  <KeyRound className="w-4 h-4 text-amber-400 mb-1.5" />
                  <div className="text-xs font-bold text-white">Inspector PIN</div>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">Passkey Step-Up 2FA</div>
                </button>

                <button
                  onClick={toggleTheme}
                  className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 hover:bg-slate-800 text-left transition-all touch-target cursor-pointer"
                >
                  {theme === 'dark' ? (
                    <Sun className="w-4 h-4 text-amber-400 mb-1.5" />
                  ) : (
                    <Moon className="w-4 h-4 text-sky-400 mb-1.5" />
                  )}
                  <div className="text-xs font-bold text-white">Toggle Theme</div>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">
                    {theme === 'dark' ? 'Obsidian Forge (Dark)' : 'Precision Daylight (Light)'}
                  </div>
                </button>

                <button
                  onClick={() => handleNavigate('/app/settings')}
                  className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 hover:bg-slate-800 text-left transition-all touch-target cursor-pointer"
                >
                  <Sliders className="w-4 h-4 text-slate-400 mb-1.5" />
                  <div className="text-xs font-bold text-white">Settings</div>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">API Keys &amp; Webhooks</div>
                </button>
              </div>
            </div>

            {/* 4. Language & Documentation (Prompt D10: English, Hindi, Bengali) */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-xs font-mono">
              <div className="flex items-center gap-2 text-slate-300">
                <Globe className="w-4 h-4 text-emerald-400" />
                <span>Interface Language:</span>
              </div>
              <LanguageSwitcher />
            </div>

            {/* 5. User Profile & Sign Out Bar */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-white uppercase text-xs">
                    {user?.name?.[0] || 'U'}
                  </div>
                  <div className="truncate">
                    <div className="font-semibold text-white truncate">{user?.name || 'Authorized User'}</div>
                    <div className="text-slate-400 font-mono text-xs">{user?.role || 'SANDBOX'} · {user?.emp_id || 'ID-ACTIVE'}</div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs font-mono text-slate-400">{expiryTimerString}</div>
                  {isAuthenticated ? (
                    <button
                      onClick={logout}
                      className="text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1 mt-0.5 touch-target ml-auto"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  ) : null}
                </div>
              </div>

              {/* Return to Public Site Link */}
              <button
                onClick={() => handleNavigate('/')}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-700/80 bg-slate-800 text-xs font-mono text-slate-300 hover:text-white hover:bg-slate-700 transition-all touch-target"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Public Marketing Site</span>
              </button>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
