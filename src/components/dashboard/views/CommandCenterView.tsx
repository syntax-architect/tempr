import React, { useState, useMemo } from 'react';
import { MOCK_SHIPMENTS } from '../../../data/mockData';
import { ShipmentRecord } from '../../../types';
import {
  Box,
  Flame,
  ShieldCheck,
  AlertOctagon,
  Upload,
  CheckCircle2,
  ChevronRight,
  TrendingDown,
  ArrowUpRight,
  Search,
  Filter,
  XCircle,
  Clock,
} from 'lucide-react';
import { StatusChip, HeatNumberTag } from '../../ui/Badges';
import { FilterBottomSheet } from '../FilterBottomSheet';
import { EmptyState } from '../../ui/DataDisplay';
import { Button } from '../../ui/Button';
import { ReadinessGateCard } from '../../readiness/ReadinessGateCard';
import { ReadinessEvaluation } from '../../../types';

interface CommandCenterViewProps {
  onOpenShipmentDossier: (shipment: ShipmentRecord) => void;
  onNavigateToWorkbench: () => void;
  onNavigateToInventory: () => void;
  onNavigateToSignOff: () => void;
  onTriggerUpload: () => void;
  pendingSignOffCount?: number;
}

export const CommandCenterView: React.FC<CommandCenterViewProps> = ({
  onOpenShipmentDossier,
  onNavigateToWorkbench,
  onNavigateToInventory,
  onNavigateToSignOff,
  onTriggerUpload,
  pendingSignOffCount = 3,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'READY' | 'ACTION_REQUIRED'>('ALL');
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable');
  const [selectedShipmentForReadiness, setSelectedShipmentForReadiness] = useState<ShipmentRecord | null>(
    MOCK_SHIPMENTS.find((s) => s.id === 'shp-102') || MOCK_SHIPMENTS[0]
  );
  const [releaseStatusMap, setReleaseStatusMap] = useState<Record<string, string>>({});

  const readinessEvaluation: ReadinessEvaluation | null = useMemo(() => {
    if (!selectedShipmentForReadiness) return null;
    const isMeltDefect = selectedShipmentForReadiness.meltAndPourStatus === 'UNVERIFIED_DEFECT';
    const isOffSpec = selectedShipmentForReadiness.metallurgyStatus === 'OFF_SPEC_ALERT';
    const isUnsigned = !selectedShipmentForReadiness.qaSigned;
    const isCbamMissing = selectedShipmentForReadiness.cbamXmlStatus === 'PENDING_INPUTS';

    let score = 100;
    if (isMeltDefect) score -= 25;
    if (isOffSpec) score -= 15;
    if (isUnsigned) score -= 10;
    if (isCbamMissing) score -= 10;

    const blockingFails = (isMeltDefect ? 1 : 0) + (isOffSpec ? 1 : 0) + (isUnsigned ? 1 : 0);
    const warningFails = isCbamMissing ? 1 : 0;
    const status = blockingFails > 0 ? 'BLOCKED' : warningFails > 0 ? 'FIX_NEEDED' : 'READY';

    return {
      shipment_id: selectedShipmentForReadiness.containerInvoice,
      score: Math.max(0, score),
      status,
      can_release: blockingFails === 0,
      blocking_failures: blockingFails,
      warning_failures: warningFails,
      total_rules: 9,
      checks: [
        {
          rule_id: 'RULE_MELT_POUR',
          name: 'Melt-and-Pour Country of Origin Attestation',
          severity: 'BLOCK',
          passed: !isMeltDefect,
          message: !isMeltDefect
            ? 'Melt-and-Pour origin certified (India [IN])'
            : 'Missing verified Melt-and-Pour country on upstream certificate.',
          fix_hint: 'Confirm melt country in MTC review workbench.',
          field_link: `/app?view=mtc-workbench&preset=sail&field=country_of_melt`,
        },
        {
          rule_id: 'RULE_CERT_TYPE',
          name: 'EN 10204 3.1 / 3.2 Certificate Type',
          severity: 'BLOCK',
          passed: true,
          message: 'Inspection certificate conforms to EN 10204 3.1',
          fix_hint: 'Upload authentic 3.1 mill certificate from steel producer.',
          field_link: `/app?view=mtc-workbench&preset=sail&field=compliance_mode`,
        },
        {
          rule_id: 'RULE_HEAT_UNIQUE',
          name: 'Heat Number Provenance & Uniqueness',
          severity: 'BLOCK',
          passed: true,
          message: `${selectedShipmentForReadiness.linkedHeatNumbers.length} linked heats verified against mill lots`,
          fix_hint: 'Link verified heat numbers in Heat Inventory.',
          field_link: `/app?view=heat-inventory`,
        },
        {
          rule_id: 'RULE_CHEMISTRY_SPEC',
          name: 'Spectrometric Chemistry In-Spec',
          severity: 'BLOCK',
          passed: !isOffSpec,
          message: !isOffSpec
            ? 'All metallurgical elements conform to grade standard'
            : 'Chemistry contains out-of-spec elements.',
          fix_hint: 'Review highlighted chemical values in MTC Workbench.',
          field_link: `/app?view=mtc-workbench&preset=sail&field=chemistry`,
        },
        {
          rule_id: 'RULE_MASS_BALANCE',
          name: 'Ledger Mass Balance Reconciliation',
          severity: 'BLOCK',
          passed: true,
          message: 'Shipped weight fully reconciled in heat ledger',
          fix_hint: 'Adjust shipment allocation in Heat Inventory.',
          field_link: `/app?view=heat-inventory`,
        },
        {
          rule_id: 'RULE_ORIGINAL_HASHED',
          name: 'Untouched Upstream PDF Cryptographic Hash',
          severity: 'BLOCK',
          passed: true,
          message: 'Unaltered upstream mill PDF hashed with SHA-256',
          fix_hint: 'Attach untouched mill PDF in MTC review workbench.',
          field_link: `/app?view=mtc-workbench&preset=sail&field=document`,
        },
        {
          rule_id: 'RULE_EXPORTER_SIGNED',
          name: 'QA Inspector Digital Signature',
          severity: 'BLOCK',
          passed: !isUnsigned,
          message: !isUnsigned
            ? 'Digitally signed with authorized QA Inspector key'
            : 'Unsigned draft: authorized digital signature required.',
          fix_hint: 'QA Inspector must approve and apply digital signature in Sign-Off Queue.',
          field_link: `/app?view=sign-off-queue`,
        },
        {
          rule_id: 'RULE_CBAM_DATA',
          name: 'CBAM Specific Embedded Emissions Data',
          severity: 'WARN',
          passed: !isCbamMissing,
          message: !isCbamMissing
            ? `Verified Specific Emissions: ${selectedShipmentForReadiness.specificEmissions} tCO2e/t`
            : 'CBAM calculation pending: shipment exposed to statutory EU default markups.',
          fix_hint: 'Run CBAM calculator to compute actual verified specific emissions.',
          field_link: `/app?view=cbam-dossier`,
        },
        {
          rule_id: 'RULE_INVOICE_TOLERANCE',
          name: 'Invoice vs Linked Heat Weight Tolerance (±5%)',
          severity: 'WARN',
          passed: true,
          message: `Container weight (${selectedShipmentForReadiness.netTonnage}t) matches heat allocation`,
          fix_hint: 'Verify container tare weight and net export payload.',
          field_link: `/app?view=heat-inventory`,
        },
      ],
    };
  }, [selectedShipmentForReadiness]);

  const filteredShipments = useMemo(() => {
    return MOCK_SHIPMENTS.filter((shipment) => {
      const matchesSearch =
        shipment.containerInvoice.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shipment.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shipment.destinationPort.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shipment.cnCode.includes(searchQuery) ||
        shipment.linkedHeatNumbers.some((h) => h.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      if (statusFilter === 'READY') {
        return shipment.cbamXmlStatus === 'GENERATED_VALID' && shipment.qaSigned;
      }
      if (statusFilter === 'ACTION_REQUIRED') {
        return !shipment.qaSigned || shipment.cbamXmlStatus === 'PENDING_INPUTS';
      }

      return true;
    });
  }, [searchQuery, statusFilter]);

  const activeFilterCount = (statusFilter !== 'ALL' ? 1 : 0) + (searchQuery ? 1 : 0);

  return (
    <div className="space-y-6 sm:space-y-8 font-sans text-left">
      {/* Sample Data Demo Banner */}
      <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200">
        <div className="flex items-center gap-2.5">
          <span className="px-2 py-0.5 rounded text-xs font-mono font-bold uppercase tracking-wider bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
            Sample Data
          </span>
          <span className="text-xs font-medium">
            Demonstration shipments and verified mill records. PostgreSQL ledger active.
          </span>
        </div>
        <span className="text-xs font-mono text-amber-600 dark:text-amber-400 font-semibold hidden sm:inline">
          DEMO_MODE ACTIVE
        </span>
      </div>

      {/* 4 Interactive KPI Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Metric 1: EU/UK Shipments */}
        <div
          onClick={() => {
            setStatusFilter('ALL');
            const tableEl = document.getElementById('shipments-table');
            if (tableEl) tableEl.scrollIntoView({ behavior: 'smooth' });
          }}
          className="bg-surface rounded-2xl border border-border p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-blue-400 transition-all duration-200 flex flex-col justify-between cursor-pointer group"
          role="button"
          tabIndex={0}
          aria-label="View all EU/UK Shipments"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-text-muted uppercase tracking-wider font-mono group-hover:text-blue-400 transition-colors">
              EU/UK Shipments
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Box className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <div className="text-2xl sm:text-3xl font-semibold tracking-tight text-text">
              12{' '}
              <span className="text-sm sm:text-base font-normal text-text-muted">Containers</span>
            </div>
            <p className="text-xs text-text-muted mt-1">Active EU Regulation 2026/1963 dossiers</p>
          </div>
          <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-text-muted">
            <span>Ports: Hamburg, Rotterdam</span>
            <span className="text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full text-xs border border-emerald-500/30">
              100% On-Track
            </span>
          </div>
        </div>

        {/* Metric 2: Verified Precursors */}
        <div
          onClick={onNavigateToInventory}
          className="bg-surface rounded-2xl border border-border p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-amber-400 transition-all duration-200 flex flex-col justify-between cursor-pointer group"
          role="button"
          tabIndex={0}
          aria-label="View Raw Material Heat Inventory Ledger"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-text-muted uppercase tracking-wider font-mono group-hover:text-amber-400 transition-colors">
              Verified Precursors
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <div className="text-2xl sm:text-3xl font-semibold tracking-tight text-text">
              48{' '}
              <span className="text-sm sm:text-base font-normal text-text-muted">Heat Batches</span>
            </div>
            <p className="text-xs text-text-muted mt-1">SAIL, Tata Steel, JSW allocated</p>
          </div>
          <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-text-muted">
            <span>Melt-and-Pour Status</span>
            <span className="text-amber-400 font-medium bg-amber-500/10 px-2 py-0.5 rounded-full text-xs border border-amber-500/30 flex items-center gap-1">
              <span>View Inventory</span>
              <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Metric 3: Plant Embedded SEE */}
        <div
          onClick={onNavigateToWorkbench}
          className="bg-surface rounded-2xl border border-border p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-emerald-400 transition-all duration-200 flex flex-col justify-between cursor-pointer group"
          role="button"
          tabIndex={0}
          aria-label="Open MTC Metallurgy Verification Workbench"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-text-muted uppercase tracking-wider font-mono group-hover:text-emerald-400 transition-colors">
              Plant Specific SEE
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <div className="text-2xl sm:text-3xl font-semibold tracking-tight text-emerald-400 font-mono">
              2.05{' '}
              <span className="text-xs sm:text-sm font-normal text-text-muted font-sans">
                tCO₂e / tonne
              </span>
            </div>
            <p className="text-xs text-text-muted mt-1">Beat EU Default (3.28 tCO₂e/t)</p>
          </div>
          <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-text-muted">
            <span>Verified 3.1 Actuals</span>
            <span className="text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full text-xs border border-emerald-500/30 flex items-center gap-1">
              <TrendingDown className="w-3 h-3" />
              <span>37% Less Carbon</span>
            </span>
          </div>
        </div>

        {/* Metric 4: Sign-Off Pending */}
        <div
          onClick={onNavigateToSignOff}
          className="bg-surface rounded-2xl border border-border p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-rose-400 transition-all duration-200 flex flex-col justify-between cursor-pointer group"
          role="button"
          tabIndex={0}
          aria-label="Review pending customs dossiers in sign-off queue"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-text-muted uppercase tracking-wider font-mono group-hover:text-rose-400 transition-colors">
              Sign-Off Queue
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <AlertOctagon className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <div className="text-2xl sm:text-3xl font-semibold tracking-tight text-text">
              {pendingSignOffCount}{' '}
              <span className="text-sm sm:text-base font-normal text-text-muted">Dossiers</span>
            </div>
            <p className="text-xs text-text-muted mt-1">Awaiting QA Head PIN attestation</p>
          </div>
          <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-text-muted">
            <span>Melt-and-Pour Lock</span>
            <span className="text-rose-400 font-medium bg-rose-500/10 px-2 py-0.5 rounded-full text-xs border border-rose-500/30 flex items-center gap-1">
              <span>Review Now</span>
              <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>

      {/* Prompt P1: Shipment Readiness & Release Gatekeeper Banner */}
      {readinessEvaluation && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-text-muted font-bold">
                Active Release Gatekeeper
              </span>
              <span className="text-xs text-text-muted">
                (Inspecting: <strong className="text-text font-mono">{selectedShipmentForReadiness?.containerInvoice.split('/')[0].trim()}</strong>)
              </span>
            </div>

            {/* Quick-switch selector among shipments */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono">
              <span className="text-text-muted text-xs hidden sm:inline">Select Shipment:</span>
              {MOCK_SHIPMENTS.slice(0, 3).map((shp) => (
                <button
                  key={shp.id}
                  onClick={() => setSelectedShipmentForReadiness(shp)}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    selectedShipmentForReadiness?.id === shp.id
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold'
                      : 'text-text-muted hover:text-text hover:bg-surface-2 border border-transparent'
                  }`}
                >
                  {shp.containerInvoice.split('/')[0].trim()}
                </button>
              ))}
            </div>
          </div>

          <ReadinessGateCard
            evaluation={readinessEvaluation}
            releaseStatus={releaseStatusMap[selectedShipmentForReadiness?.id || ''] || 'DRAFT'}
            onRequestRelease={() => {
              if (selectedShipmentForReadiness) {
                setReleaseStatusMap((prev) => ({
                  ...prev,
                  [selectedShipmentForReadiness.id]: 'RELEASE_REQUESTED',
                }));
              }
            }}
            onApproveRelease={() => {
              if (selectedShipmentForReadiness) {
                setReleaseStatusMap((prev) => ({
                  ...prev,
                  [selectedShipmentForReadiness.id]: 'RELEASE_APPROVED',
                }));
              }
            }}
            onNavigateToField={(link) => {
              window.location.href = link;
            }}
            userRole="QA_INSPECTOR"
          />
        </div>
      )}

      {/* Main Shipments Table Card */}
      <div
        id="shipments-table"
        className="bg-surface rounded-2xl border border-border shadow-sm overflow-hidden"
      >
        {/* Table Header & Search Filter Bar */}
        <div className="p-4 sm:p-6 border-b border-border flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-text">
                EU &amp; UK Export Shipments
              </h2>
              <p className="text-xs text-text-muted mt-0.5">
                Active commercial invoices and tamper-evident customs clearance bundles
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={onTriggerUpload}
              className="hidden sm:inline-flex"
            >
              <Upload className="w-4 h-4 mr-1.5" />
              <span>Ingest Raw MTC</span>
            </Button>
          </div>
        </div>

        {/* Search, Filter Tabs & Density */}
        <div className="p-4 sm:p-5 border-b border-border flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search container, invoice, port, CN code..."
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-surface-2/60 border border-border text-text text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
                aria-label="Clear search"
              >
                <XCircle className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsFilterSheetOpen(true)}
              className="md:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-2 border border-border text-xs font-mono text-text hover:bg-surface-3 transition-colors"
            >
              <Filter className="w-3.5 h-3.5 text-emerald-400" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-emerald-500 text-obsidian-950 font-bold text-xs flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Desktop Filter Chips */}
            <div className="hidden md:flex items-center gap-1.5 text-xs font-mono">
              <span className="text-text-muted text-xs mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3" /> Filter:
              </span>
              <button
                onClick={() => setStatusFilter('ALL')}
                className={`px-3 py-1 rounded-full text-xs transition-colors ${
                  statusFilter === 'ALL'
                    ? 'bg-emerald-500 text-obsidian-950 font-bold shadow-sm'
                    : 'bg-surface-2 border border-border text-text-muted hover:text-text'
                }`}
              >
                All ({MOCK_SHIPMENTS.length})
              </button>
              <button
                onClick={() => setStatusFilter('READY')}
                className={`px-3 py-1 rounded-full text-xs transition-colors ${
                  statusFilter === 'READY'
                    ? 'bg-emerald-500 text-obsidian-950 font-bold shadow-sm'
                    : 'bg-surface-2 border border-border text-text-muted hover:text-text'
                }`}
              >
                Ready (CBAM)
              </button>
              <button
                onClick={() => setStatusFilter('ACTION_REQUIRED')}
                className={`px-3 py-1 rounded-full text-xs transition-colors ${
                  statusFilter === 'ACTION_REQUIRED'
                    ? 'bg-rose-500 text-obsidian-950 font-bold shadow-sm'
                    : 'bg-surface-2 border border-border text-text-muted hover:text-text'
                }`}
              >
                Action Required ({pendingSignOffCount})
              </button>
            </div>

            {/* Desktop Density Toggle */}
            <div className="hidden md:flex items-center ml-2 pl-2 border-l border-border">
              <button
                onClick={() => setDensity((d) => (d === 'comfortable' ? 'compact' : 'comfortable'))}
                className="px-2.5 py-1 rounded-lg text-xs font-mono text-text-muted hover:text-text bg-surface-2 border border-border"
                title="Toggle Table Density"
              >
                {density === 'comfortable' ? 'Compact' : 'Comfortable'}
              </button>
            </div>
          </div>
        </div>

        {/* Responsive Content: Mobile Cards (< md) / Desktop Table (>= md) */}
        {filteredShipments.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={<Search className="w-6 h-6 text-text-muted" />}
              title="No shipments found"
              description={`We couldn't find any export container matching "${searchQuery}" with the selected filter.`}
              action={
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('ALL');
                  }}
                >
                  Reset Search &amp; Filters
                </Button>
              }
            />
          </div>
        ) : (
          <>
            {/* 1. MOBILE CARD LIST (< md) — Zero horizontal scroll */}
            <div className="md:hidden divide-y divide-border">
              {filteredShipments.map((shipment) => {
                const isReady = shipment.cbamXmlStatus === 'GENERATED_VALID' && shipment.qaSigned;
                return (
                  <div
                    key={shipment.id}
                    onClick={() => onOpenShipmentDossier(shipment)}
                    className="p-4 hover:bg-surface-2/40 active:bg-surface-2 transition-colors cursor-pointer space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-bold text-text truncate">
                        {shipment.containerInvoice.split('/')[0]}
                      </span>
                      {isReady ? (
                        <StatusChip status="Verified" size="sm" />
                      ) : (
                        <StatusChip status="Awaiting sign-off" size="sm" />
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                      <div>
                        <span className="text-text-muted block text-xs">BUYER &amp; PORT</span>
                        <span className="font-semibold text-text truncate block">
                          {shipment.buyerName}
                        </span>
                        <span className="text-text-muted truncate block">
                          {shipment.destinationPort}
                        </span>
                      </div>
                      <div>
                        <span className="text-text-muted block text-xs">TONNAGE &amp; CN CODE</span>
                        <span className="text-text font-bold block">{shipment.netTonnage} MT</span>
                        <span className="text-text-muted block">CN {shipment.cnCode}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-xs font-mono text-text-muted">HEATS:</span>
                      {shipment.linkedHeatNumbers.map((heat, i) => (
                        <span
                          key={i}
                          className="px-1.5 py-0.5 rounded bg-surface-2 text-amber-400 border border-border text-xs font-mono"
                        >
                          #{heat}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs text-text-muted font-mono pt-1 border-t border-border/50">
                      <span className="text-emerald-400 font-semibold">Melt &amp; Pour: India</span>
                      <span className="flex items-center text-emerald-400 font-semibold gap-0.5">
                        <span>Open Dossier</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 2. DESKTOP DATA TABLE (>= md) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-surface-2/80 border-b border-border text-text-muted font-mono text-xs sticky top-0 z-10 backdrop-blur-md">
                    <th
                      className={`${density === 'compact' ? 'py-2.5 px-4' : 'py-3.5 px-6'} font-medium sticky left-0 bg-surface-2/95 z-20`}
                    >
                      Container / Invoice
                    </th>
                    <th
                      className={`${density === 'compact' ? 'py-2.5 px-4' : 'py-3.5 px-6'} font-medium`}
                    >
                      Customer &amp; Port
                    </th>
                    <th
                      className={`${density === 'compact' ? 'py-2.5 px-4' : 'py-3.5 px-6'} font-medium`}
                    >
                      CN Code
                    </th>
                    <th
                      className={`${density === 'compact' ? 'py-2.5 px-4' : 'py-3.5 px-6'} font-medium`}
                    >
                      Linked Heats
                    </th>
                    <th
                      className={`${density === 'compact' ? 'py-2.5 px-4' : 'py-3.5 px-6'} font-medium`}
                    >
                      Metallurgy
                    </th>
                    <th
                      className={`${density === 'compact' ? 'py-2.5 px-4' : 'py-3.5 px-6'} font-medium`}
                    >
                      Melt &amp; Pour
                    </th>
                    <th
                      className={`${density === 'compact' ? 'py-2.5 px-4' : 'py-3.5 px-6'} font-medium`}
                    >
                      CBAM XML
                    </th>
                    <th
                      className={`${density === 'compact' ? 'py-2.5 px-4' : 'py-3.5 px-6'} font-medium text-right`}
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredShipments.map((shipment) => {
                    const isReady =
                      shipment.cbamXmlStatus === 'GENERATED_VALID' && shipment.qaSigned;
                    return (
                      <tr
                        key={shipment.id}
                        className="hover:bg-surface-2/50 transition-colors group"
                      >
                        <td
                          className={`${density === 'compact' ? 'py-2.5 px-4' : 'py-4 px-6'} font-mono font-medium text-text sticky left-0 bg-surface group-hover:bg-surface-2/50 z-10`}
                        >
                          <div>{shipment.containerInvoice.split('/')[0]}</div>
                          <div className="text-xs text-text-muted font-normal">
                            {shipment.containerInvoice.split('/')[1] || '20ft FCL'} ·{' '}
                            {shipment.netTonnage} MT
                          </div>
                        </td>

                        <td className={`${density === 'compact' ? 'py-2.5 px-4' : 'py-4 px-6'}`}>
                          <div className="font-medium text-text">{shipment.buyerName}</div>
                          <div className="text-xs text-text-muted font-mono">
                            {shipment.destinationPort}
                          </div>
                        </td>

                        <td
                          className={`${density === 'compact' ? 'py-2.5 px-4' : 'py-4 px-6'} font-mono`}
                        >
                          <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-surface-2 text-text border border-border">
                            {shipment.cnCode}
                          </span>
                        </td>

                        <td
                          className={`${density === 'compact' ? 'py-2.5 px-4' : 'py-4 px-6'} font-mono text-xs`}
                        >
                          {shipment.linkedHeatNumbers.map((heat, i) => (
                            <span
                              key={i}
                              className="inline-block px-1.5 py-0.5 rounded bg-surface-2 text-amber-400 border border-border text-xs mr-1"
                            >
                              #{heat}
                            </span>
                          ))}
                        </td>

                        <td className={`${density === 'compact' ? 'py-2.5 px-4' : 'py-4 px-6'}`}>
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            <span>In Spec</span>
                          </span>
                        </td>

                        <td className={`${density === 'compact' ? 'py-2.5 px-4' : 'py-4 px-6'}`}>
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            <span>India (IN)</span>
                          </span>
                        </td>

                        <td className={`${density === 'compact' ? 'py-2.5 px-4' : 'py-4 px-6'}`}>
                          {isReady ? (
                            <StatusChip status="Verified" size="sm" />
                          ) : (
                            <StatusChip status="Awaiting sign-off" size="sm" />
                          )}
                        </td>

                        <td
                          className={`${density === 'compact' ? 'py-2.5 px-4' : 'py-4 px-6'} text-right`}
                        >
                          <button
                            onClick={() => onOpenShipmentDossier(shipment)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-text bg-surface-2 hover:bg-emerald-500 hover:text-obsidian-950 transition-all shadow-sm"
                            title={`Open customs dossier for ${shipment.containerInvoice.split('/')[0]}`}
                          >
                            <span>Open Dossier</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Mobile Filter Bottom Sheet */}
      <FilterBottomSheet
        isOpen={isFilterSheetOpen}
        onClose={() => setIsFilterSheetOpen(false)}
        title="Filter Shipments"
        statusOptions={[
          { id: 'ALL', label: 'All Containers', count: MOCK_SHIPMENTS.length },
          {
            id: 'READY',
            label: 'Ready (CBAM Verified)',
            count: MOCK_SHIPMENTS.filter((s) => s.cbamXmlStatus === 'GENERATED_VALID' && s.qaSigned)
              .length,
          },
          { id: 'ACTION_REQUIRED', label: 'Action Required', count: pendingSignOffCount },
        ]}
        selectedStatus={statusFilter}
        onSelectStatus={(st) => {
          setStatusFilter(st as any);
          setIsFilterSheetOpen(false);
        }}
        activeCount={activeFilterCount}
        onReset={() => {
          setStatusFilter('ALL');
          setSearchQuery('');
          setIsFilterSheetOpen(false);
        }}
      />
    </div>
  );
};
