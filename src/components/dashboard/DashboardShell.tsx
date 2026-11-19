import React, { useState, useEffect, useCallback } from 'react';
import { DashboardView, ShipmentRecord } from '../../types';
import { CommandCenterView } from './views/CommandCenterView';
import { MtcWorkbenchView } from './views/MtcWorkbenchView';
import { HeatInventoryView } from './views/HeatInventoryView';
import { SignOffQueueView } from './views/SignOffQueueView';
import { CbamDossierView } from './views/CbamDossierView';
import { SupplierIntelligenceView } from './views/SupplierIntelligenceView';
import { SupplierRequestsView } from './views/SupplierRequestsView';
import { IntakeChannelsView } from './views/IntakeChannelsView';
import { Logo } from '../brand/Logo';
import { useAuth } from '../../context/AuthContext';
import { InspectorPinChallengeModal } from './modals/InspectorPinChallengeModal';
import { SecurityTelemetryDrawer } from './modals/SecurityTelemetryDrawer';
import { PlantSwitcherModal, PlantProfile, REGISTERED_PLANTS } from './PlantSwitcherModal';
import { NotificationsModal } from './NotificationsModal';
import { CaptureChoiceModal } from './CaptureChoiceModal';
import { CommandPalette } from './CommandPalette';
import { MobileMoreSheet } from './MobileMoreSheet';
import { PullToRefresh } from '../common/PullToRefresh';
import { subscribeToOfflineQueue, isDeviceOnline } from '../../lib/offlineQueue';
import {
  LayoutDashboard,
  FlaskConical,
  Database,
  Stamp,
  FileCode,
  Building2,
  MessageSquare,
  Send,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  Menu,
  Search,
  Bell,
  PanelLeftClose,
  PanelLeft,
  Camera,
  WifiOff,
} from 'lucide-react';

interface DashboardShellProps {
  currentView: DashboardView;
  onSelectView: (view: DashboardView) => void;
  onReturnToMarketing: () => void;
  initialPresetId?: string;
}

export const DashboardShell: React.FC<DashboardShellProps> = ({
  currentView,
  onSelectView,
  onReturnToMarketing,
  initialPresetId,
}) => {
  const {
    isAuthenticated,
    user,
    expiryTimerString,
    openPinModal,
    isPinModalOpen,
    closePinModal,
    logout,
  } = useAuth();

  // Active Factory Plant State
  const [activePlant, setActivePlant] = useState<PlantProfile>(() => {
    try {
      const saved = localStorage.getItem('hl_active_plant');
      if (saved) {
        const found = REGISTERED_PLANTS.find((p) => p.id === saved);
        if (found) return found;
      }
    } catch {
      // localStorage may fail in private mode
    }
    return REGISTERED_PLANTS[0];
  });

  // Collapsible Sidebar State (Desktop >= lg)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('hl_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const [selectedPresetIdForWorkbench, setSelectedPresetIdForWorkbench] = useState<
    string | undefined
  >(initialPresetId);
  const [selectedShipment, setSelectedShipment] = useState<ShipmentRecord | null>(null);
  const [uploadedFileForWorkbench, setUploadedFileForWorkbench] = useState<File | null>(null);

  // Modals & Drawers States
  const [isCaptureModalOpen, setIsCaptureModalOpen] = useState(false);
  const [isPlantSwitcherOpen, setIsPlantSwitcherOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isSecurityDrawerOpen, setIsSecurityDrawerOpen] = useState(false);
  const [isMobileMoreOpen, setIsMobileMoreOpen] = useState(false);
  const [offlineCount, setOfflineCount] = useState<number>(0);
  const [isOnline, setIsOnline] = useState<boolean>(isDeviceOnline());

  useEffect(() => {
    const unsub = subscribeToOfflineQueue((items) => {
      const pending = items.filter((i) => i.status === 'pending' || i.status === 'failed');
      setOfflineCount(pending.length);
    });
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      unsub();
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (initialPresetId) {
      setSelectedPresetIdForWorkbench(initialPresetId);
    }
  }, [initialPresetId]);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('hl_sidebar_collapsed', String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const handleSelectPlant = (plant: PlantProfile) => {
    setActivePlant(plant);
    try {
      localStorage.setItem('hl_active_plant', plant.id);
    } catch {
      // ignore
    }
  };

  const handleFileCaptured = useCallback(
    (file: File) => {
      setUploadedFileForWorkbench(file);
      onSelectView('mtc-workbench');
    },
    [onSelectView]
  );

  const handlePresetSelected = useCallback(
    (presetId: string) => {
      setSelectedPresetIdForWorkbench(presetId);
      onSelectView('mtc-workbench');
    },
    [onSelectView]
  );

  const handleOpenShipmentDossier = (shipment: ShipmentRecord) => {
    setSelectedShipment(shipment);
    onSelectView('cbam-dossier');
  };

  const sidebarItems: {
    id: DashboardView;
    label: string;
    icon: React.FC<{ className?: string }>;
    badge?: string;
  }[] = [
    { id: 'command-center', label: 'Command Center', icon: LayoutDashboard },
    { id: 'mtc-workbench', label: 'MTC Workbench', icon: FlaskConical },
    { id: 'heat-inventory', label: 'Heat Inventory', icon: Database },
    { id: 'sign-off-queue', label: 'Clause 6 Sign-Off', icon: Stamp, badge: '3' },
    { id: 'cbam-dossier', label: 'Customs Dossier', icon: FileCode },
    { id: 'supplier-intelligence', label: 'Supplier Intelligence', icon: Building2 },
    { id: 'supplier-requests', label: 'CBAM Data Requests', icon: Send },
    { id: 'intake-channels', label: 'Intake Channels', icon: MessageSquare },
  ];

  const isStepUpActive = (user as any)?.step_up_valid ?? false;
  const role = user?.role || 'SANDBOX';

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#F8FAFC] dark:bg-slate-950 flex flex-col lg:flex-row font-sans text-slate-900 dark:text-slate-100 selection:bg-emerald-500 selection:text-slate-950">
      {/* 1. DESKTOP LEFT SIDEBAR (Hidden on mobile/tablet below lg, sticky on desktop, collapsible) */}
      <aside
        className={`hidden lg:flex flex-col justify-between shrink-0 h-screen sticky top-0 select-none z-30 transition-all duration-200 bg-[#090D16] border-r border-slate-800/80 ${
          isSidebarCollapsed ? 'w-[72px]' : 'w-64'
        }`}
      >
        {/* Sidebar Top: Brand & Menu */}
        <div className="p-3.5 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            {isSidebarCollapsed ? (
              <div className="mx-auto">
                <Logo size="sm" />
              </div>
            ) : (
              <>
                <Logo size="sm" />
                <span className="text-xs font-mono font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  v2.4
                </span>
              </>
            )}
          </div>

          {/* Quick Search / Command Palette Button */}
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className={`w-full flex items-center rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-slate-400 hover:text-white transition-all text-xs font-mono touch-target cursor-pointer ${
              isSidebarCollapsed ? 'justify-center p-2' : 'justify-between px-3 py-2'
            }`}
            title="Search commands, views, heats... (Ctrl+K)"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-emerald-400" />
              {!isSidebarCollapsed && <span>Search...</span>}
            </div>
            {!isSidebarCollapsed && (
              <kbd className="text-xs bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">
                ⌘K
              </kbd>
            )}
          </button>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {!isSidebarCollapsed && (
              <div className="px-3 pb-2 text-xs font-mono uppercase tracking-wider text-slate-500 font-medium">
                Factory QA Workspace
              </div>
            )}
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onSelectView(item.id)}
                  title={isSidebarCollapsed ? item.label : undefined}
                  className={`w-full flex items-center rounded-xl text-xs font-medium transition-all duration-150 min-h-[44px] cursor-pointer ${
                    isSidebarCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2.5'
                  } ${
                    isActive
                      ? 'bg-white/[0.08] text-white shadow-sm font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`}
                    />
                    {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
                  </div>

                  {!isSidebarCollapsed && item.badge && (
                    <span className="text-xs font-mono px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-medium">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Bottom: Collapse Toggle & Inspector Status */}
        <div className="p-3.5 border-t border-white/[0.08] space-y-2.5">
          {/* Collapse / Expand Toggle Button */}
          <button
            onClick={toggleSidebar}
            className="w-full flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.04] transition-all touch-target cursor-pointer"
            title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isSidebarCollapsed ? (
              <PanelLeft className="w-4 h-4 text-emerald-400" />
            ) : (
              <div className="w-full flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="flex items-center gap-2">
                  <PanelLeftClose className="w-4 h-4" />
                  <span>Collapse Sidebar</span>
                </span>
              </div>
            )}
          </button>

          {/* User Session Mini Card */}
          {isAuthenticated ? (
            <div
              className={`rounded-xl bg-slate-900/90 border border-slate-800 ${
                isSidebarCollapsed ? 'p-2 text-center' : 'p-3 space-y-2'
              }`}
            >
              {isSidebarCollapsed ? (
                <div
                  className="w-8 h-8 mx-auto rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-white uppercase cursor-pointer"
                  title={`${user?.name || 'User'} (${role})`}
                  onClick={() => setIsMobileMoreOpen(true)}
                >
                  {user?.name?.[0] || 'U'}
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          isStepUpActive ? 'bg-emerald-400 animate-pulse' : 'bg-sky-400'
                        }`}
                      />
                      <span className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
                        {role} SESSION
                      </span>
                    </div>
                    <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {user?.emp_id || 'ACTIVE'}
                    </span>
                  </div>

                  <div className="text-xs text-slate-300 leading-tight">
                    <span className="text-white font-medium block truncate">
                      {user?.name || 'Authorized User'}
                    </span>
                    <span className="text-slate-400 font-mono text-xs truncate block">
                      {activePlant.shortName}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-xs font-mono">
                    <span className="text-slate-500">{expiryTimerString}</span>
                    <button
                      onClick={logout}
                      className="text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            !isSidebarCollapsed && (
              <div className="px-3 py-2 rounded-xl bg-white/[0.03] border border-amber-500/30 space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-xs font-mono font-bold text-amber-300">SANDBOX MODE</span>
                </div>
                <p className="text-xs text-slate-400 leading-snug">
                  Demo mill data. Signatures carry demo watermark.
                </p>
              </div>
            )
          )}

          {/* Return to Public Site */}
          <button
            onClick={onReturnToMarketing}
            className={`w-full flex items-center rounded-xl text-xs font-mono text-slate-400 hover:text-white hover:bg-white/[0.04] transition-all touch-target cursor-pointer ${
              isSidebarCollapsed ? 'justify-center p-2' : 'justify-center gap-2 px-3 py-2'
            }`}
            title="Return to Public Site"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {!isSidebarCollapsed && <span>Return to Public Site</span>}
          </button>
        </div>
      </aside>

      {/* 2. MAIN WORKSPACE AREA */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden pb-28 lg:pb-8">
        {/* DESKTOP TOP HEADER (Hidden on mobile below lg) */}
        <header className="hidden lg:flex bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 px-6 py-3 sticky top-0 z-20 shadow-[0_1px_2px_rgba(0,0,0,0.02)] items-center justify-between gap-4">
          {/* Plant Switcher Selector */}
          <button
            onClick={() => setIsPlantSwitcherOpen(true)}
            className="flex items-center gap-3 p-1.5 -ml-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-left cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-emerald-400 flex items-center justify-center shadow-sm">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {activePlant.name}
                </span>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {activePlant.shortName}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <div className="text-xs font-mono text-slate-400">
                Installation ID: <span className="text-slate-700 dark:text-slate-300 font-medium">{activePlant.installationId}</span> ·
                UN/LOCODE: {activePlant.unLocode}
              </div>
            </div>
          </button>

          {/* Header Action Badges & Buttons */}
          <div className="flex items-center gap-2.5">
            {/* Search / Command Palette Trigger */}
            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-mono transition-all touch-target cursor-pointer border border-slate-200 dark:border-slate-700"
              title="Search commands (Cmd+K)"
            >
              <Search className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>Search (⌘K)</span>
            </button>

            {/* Notifications Bell */}
            <button
              onClick={() => setIsNotificationsOpen(true)}
              className="relative p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all touch-target cursor-pointer border border-slate-200 dark:border-slate-700"
              title="Factory QA & Compliance Alerts"
              aria-label="Factory QA Alerts"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500" />
            </button>

            {/* Offline Queue Badge (if offline or items pending) */}
            {(!isOnline || offlineCount > 0) && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono text-xs font-semibold">
                <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                <span>{isOnline ? `${offlineCount} Queued` : 'Offline Mode'}</span>
              </span>
            )}

            {/* Security Telemetry Pill */}
            <button
              onClick={() => setIsSecurityDrawerOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 font-mono text-xs font-semibold transition-all shadow-sm cursor-pointer group"
              title="Open Live Security & Cryptographic Telemetry Drawer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Security: Tier-1 Enforced</span>
              </span>
            </button>

            {/* Capture / Upload Button */}
            <button
              onClick={() => setIsCaptureModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-medium text-xs transition-all shadow-sm cursor-pointer touch-target"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Capture / Upload MTC</span>
            </button>
          </div>
        </header>

        {/* MOBILE TOP APP BAR (Below lg only, phone-first) */}
        <header className="lg:hidden sticky top-0 z-30 bg-slate-900 border-b border-slate-800 text-white px-4 py-2.5 flex items-center justify-between shadow-md pt-[max(0.625rem,env(safe-area-inset-top))]">
          {/* Plant Switcher Trigger */}
          <button
            onClick={() => setIsPlantSwitcherOpen(true)}
            className="flex items-center gap-2.5 text-left cursor-pointer group touch-target max-w-[210px]"
            aria-label="Switch factory plant"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <Building2 className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="font-bold text-xs text-white leading-tight truncate flex items-center gap-1">
                <span>{activePlant.shortName}</span>
                <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
              </div>
              <div className="text-xs text-slate-400 font-mono leading-none mt-0.5 truncate">
                {activePlant.installationId}
              </div>
            </div>
          </button>

          {/* Action Icons: Search, Notifications, Security, Avatar */}
          <div className="flex items-center gap-1 sm:gap-2">
            {(!isOnline || offlineCount > 0) && (
              <span className="p-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center text-[10px] font-mono">
                <WifiOff className="w-3.5 h-3.5 mr-1 text-amber-400" />
                <span>{offlineCount}</span>
              </span>
            )}

            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white active:scale-95 transition-all touch-target flex items-center justify-center cursor-pointer"
              aria-label="Command search"
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsNotificationsOpen(true)}
              className="relative p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white active:scale-95 transition-all touch-target flex items-center justify-center cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
            </button>

            <button
              onClick={() => setIsSecurityDrawerOpen(true)}
              className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-emerald-400 active:scale-95 transition-all touch-target flex items-center justify-center cursor-pointer"
              aria-label="Security Telemetry"
            >
              <ShieldCheck className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsMobileMoreOpen(true)}
              className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 font-bold text-xs uppercase flex items-center justify-center ml-1 shrink-0 touch-target cursor-pointer border border-emerald-400"
              aria-label="Open More Menu and Profile"
            >
              {user?.name?.[0] || 'U'}
            </button>
          </div>
        </header>

        {/* Workspace Body Area with Pull-to-Refresh */}
        <main id="main-content" className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <PullToRefresh>
            {currentView === 'command-center' && (
              <CommandCenterView
                onOpenShipmentDossier={handleOpenShipmentDossier}
                onNavigateToWorkbench={() => onSelectView('mtc-workbench')}
                onNavigateToInventory={() => onSelectView('heat-inventory')}
                onNavigateToSignOff={() => onSelectView('sign-off-queue')}
                onTriggerUpload={() => setIsCaptureModalOpen(true)}
              />
            )}

            {currentView === 'mtc-workbench' && (
              <MtcWorkbenchView
                initialPresetId={selectedPresetIdForWorkbench}
                initialUploadedFile={uploadedFileForWorkbench}
              />
            )}

            {currentView === 'heat-inventory' && <HeatInventoryView />}

            {currentView === 'sign-off-queue' && <SignOffQueueView />}

            {currentView === 'cbam-dossier' && (
              <CbamDossierView initialShipment={selectedShipment} />
            )}

            {currentView === 'supplier-intelligence' && <SupplierIntelligenceView />}

            {currentView === 'supplier-requests' && <SupplierRequestsView />}

            {currentView === 'intake-channels' && (
              <IntakeChannelsView onNavigateToWorkbench={() => onSelectView('mtc-workbench')} />
            )}
          </PullToRefresh>
        </main>
      </div>

      {/* 3. MOBILE BOTTOM TAB BAR (Below lg only, phone-first navigation) */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-slate-900/95 border-t border-slate-800/90 backdrop-blur-2xl px-2 py-1.5 flex items-center justify-around pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-10px_25px_rgba(0,0,0,0.5)]">
        {/* Tab 1: Home */}
        <button
          onClick={() => onSelectView('command-center')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] rounded-xl transition-all touch-target cursor-pointer ${
            currentView === 'command-center'
              ? 'text-emerald-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="Home Dashboard"
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-xs font-mono mt-0.5">Home</span>
        </button>

        {/* Tab 2: Shipments */}
        <button
          onClick={() => onSelectView('cbam-dossier')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] rounded-xl relative transition-all touch-target cursor-pointer ${
            currentView === 'cbam-dossier'
              ? 'text-emerald-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="Customs Shipments"
        >
          <FileCode className="w-5 h-5" />
          <span className="text-xs font-mono mt-0.5">Shipments</span>
        </button>

        {/* Center Raised Capture Action Button */}
        <div className="relative -top-3">
          <button
            onClick={() => setIsCaptureModalOpen(true)}
            className="w-13 h-13 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.5)] active:scale-95 transition-all border-2 border-slate-900 touch-target cursor-pointer"
            aria-label="Capture MTC or Export Document"
          >
            <Camera className="w-6 h-6 stroke-[2.2]" />
          </button>
        </div>

        {/* Tab 3: Heats */}
        <button
          onClick={() => onSelectView('heat-inventory')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] rounded-xl transition-all touch-target cursor-pointer ${
            currentView === 'heat-inventory'
              ? 'text-emerald-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="Heat Inventory & Mass Balance"
        >
          <Database className="w-5 h-5" />
          <span className="text-xs font-mono mt-0.5">Heats</span>
        </button>

        {/* Tab 4: More Menu Sheet Trigger */}
        <button
          onClick={() => setIsMobileMoreOpen(true)}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] rounded-xl transition-all touch-target cursor-pointer ${
            isMobileMoreOpen ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="More Workspaces and Controls"
        >
          <Menu className="w-5 h-5" />
          <span className="text-xs font-mono mt-0.5">More</span>
        </button>
      </nav>

      {/* 4. MODALS & SHEETS */}
      {/* Capture Choice Modal (Camera, Upload, Presets) */}
      <CaptureChoiceModal
        isOpen={isCaptureModalOpen}
        onClose={() => setIsCaptureModalOpen(false)}
        onSelectFile={handleFileCaptured}
        onSelectPreset={handlePresetSelected}
      />

      {/* Plant Switcher Sheet */}
      <PlantSwitcherModal
        isOpen={isPlantSwitcherOpen}
        onClose={() => setIsPlantSwitcherOpen(false)}
        activePlantId={activePlant.id}
        onSelectPlant={handleSelectPlant}
      />

      {/* Notifications Sheet */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      {/* Command Palette (Cmd+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onTriggerCapture={() => {
          setIsCommandPaletteOpen(false);
          setIsCaptureModalOpen(true);
        }}
        onTriggerPlantSwitch={() => {
          setIsCommandPaletteOpen(false);
          setIsPlantSwitcherOpen(true);
        }}
        onTriggerSecurity={() => {
          setIsCommandPaletteOpen(false);
          setIsSecurityDrawerOpen(true);
        }}
        onTriggerPinModal={() => {
          setIsCommandPaletteOpen(false);
          openPinModal();
        }}
      />

      {/* Full-Screen Mobile "More" Sheet */}
      <MobileMoreSheet
        isOpen={isMobileMoreOpen}
        onClose={() => setIsMobileMoreOpen(false)}
        activePlant={activePlant}
        onOpenPlantSwitcher={() => setIsPlantSwitcherOpen(true)}
        onOpenSecurity={() => setIsSecurityDrawerOpen(true)}
        onOpenPinModal={openPinModal}
      />

      {/* Inspector Passkey / 2FA Challenge Modal */}
      <InspectorPinChallengeModal isOpen={isPinModalOpen} onClose={closePinModal} />

      {/* Security & Cryptographic Telemetry Slide-Over Drawer */}
      <SecurityTelemetryDrawer
        isOpen={isSecurityDrawerOpen}
        onClose={() => setIsSecurityDrawerOpen(false)}
      />
    </div>
  );
};
