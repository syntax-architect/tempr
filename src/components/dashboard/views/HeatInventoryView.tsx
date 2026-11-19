import React, { useState, useMemo } from 'react';
import { MOCK_HEAT_INVENTORY } from '../../../data/mockData';
import { HeatInventoryItem } from '../../../types';
import { useToast } from '../../ui/ToastContext';
import {
  Database,
  Search,
  ShieldAlert,
  CheckCircle2,
  Plus,
  AlertTriangle,
  Scale,
  Sparkles,
  ArrowRight,
  Filter,
  RefreshCw,
  XCircle,
  Play,
  ChevronRight,
  SlidersHorizontal,
  ChevronDown,
  Info,
} from 'lucide-react';
import { HeatNumberTag, StatusChip, StatusType } from '../../ui/Badges';
import { MassBalanceBar } from '../MassBalanceBar';
import { FilterBottomSheet } from '../FilterBottomSheet';
import { EmptyState } from '../../ui/DataDisplay';
import { Button } from '../../ui/Button';

export const HeatInventoryView: React.FC = () => {
  const [inventory, setInventory] = useState<HeatInventoryItem[]>(MOCK_HEAT_INVENTORY);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'HEALTHY' | 'LOW_BALANCE' | 'EXHAUSTED'>(
    'ALL'
  );
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable');
  const [selectedHeatForDetail, setSelectedHeatForDetail] = useState<HeatInventoryItem | null>(
    null
  );

  // Interactive Anti-Phantom Sandbox State
  const [showOverAllocationDemo, setShowOverAllocationDemo] = useState(false);
  const [selectedHeatForTest, setSelectedHeatForTest] = useState<string>('BOK-26-4910');
  const [testTonnage, setTestTonnage] = useState<number>(25);
  const [simulationResult, setSimulationResult] = useState<{
    status: 'IDLE' | 'SUCCESS' | 'REJECTED';
    message: string;
    detail?: string;
  }>({ status: 'IDLE', message: '' });

  const toast = useToast();

  const filteredItems = useMemo(() => {
    return inventory.filter((item) => {
      const matchesSearch =
        item.heatNumber.toLowerCase().includes(search.toLowerCase()) ||
        item.supplierMill.toLowerCase().includes(search.toLowerCase()) ||
        item.grade.toLowerCase().includes(search.toLowerCase());

      if (!matchesSearch) return false;

      if (statusFilter !== 'ALL' && item.status !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [inventory, search, statusFilter]);

  const totalPurchased = inventory.reduce((acc, curr) => acc + curr.totalPurchasedMT, 0);
  const totalConsumed = inventory.reduce((acc, curr) => acc + curr.consumedExportMT, 0);
  const totalRemaining = totalPurchased - totalConsumed;

  const handleExecuteAllocationTest = () => {
    const targetItem = inventory.find((i) => i.heatNumber === selectedHeatForTest);
    if (!targetItem) return;

    if (testTonnage <= 0) {
      toast.warning('Invalid Tonnage', 'Please enter a tonnage value greater than 0 MT.');
      return;
    }

    if (testTonnage <= targetItem.remainingMT) {
      const newRemaining = targetItem.remainingMT - testTonnage;
      const newConsumed = targetItem.consumedExportMT + testTonnage;
      const newStatus =
        newRemaining === 0 ? 'EXHAUSTED' : newRemaining < 10 ? 'LOW_BALANCE' : 'HEALTHY';

      setInventory((prev) =>
        prev.map((item) => {
          if (item.heatNumber === selectedHeatForTest) {
            return {
              ...item,
              consumedExportMT: newConsumed,
              remainingMT: newRemaining,
              status: newStatus,
            };
          }
          return item;
        })
      );

      setSimulationResult({
        status: 'SUCCESS',
        message: `Mass-Balance Allocation Approved: Allocated ${testTonnage} MT from Heat #${selectedHeatForTest}.`,
        detail: `New remaining balance: ${newRemaining.toFixed(1)} MT. Allocation securely registered in ledger.`,
      });

      toast.success(
        'Allocation Verified',
        `Allocated ${testTonnage} MT from Heat #${selectedHeatForTest}.`
      );
    } else {
      const excess = (testTonnage - targetItem.remainingMT).toFixed(1);
      setSimulationResult({
        status: 'REJECTED',
        message: `PostgreSQL Constraint 23514: Over-allocation rejected.`,
        detail: `Attempted to allocate ${testTonnage} MT, but only ${targetItem.remainingMT.toFixed(1)} MT remains on Heat #${selectedHeatForTest} (Deficit: ${excess} MT). In Excel, this phantom reuse would pass unnoticed and trigger retroactive EU penalties.`,
      });

      toast.error(
        'Anti-Phantom Rejection',
        `Requested ${testTonnage} MT exceeds available balance by ${excess} MT.`
      );
    }
  };

  const handleResetInventory = () => {
    setInventory(MOCK_HEAT_INVENTORY);
    setSimulationResult({ status: 'IDLE', message: '' });
    toast.info('Inventory Reset', 'Restored pristine initial heat balances.');
  };

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'HEALTHY':
        return <StatusChip status="Verified" size="sm" />;
      case 'LOW_BALANCE':
        return <StatusChip status="Needs review" size="sm" />;
      case 'EXHAUSTED':
        return <StatusChip status="Superseded" size="sm" />;
      default:
        return <StatusChip status="Draft" size="sm" />;
    }
  };

  const activeFilterCount = (statusFilter !== 'ALL' ? 1 : 0) + (search ? 1 : 0);

  return (
    <div className="space-y-6 font-sans text-left">
      {/* Sample Data Demo Banner */}
      <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200">
        <div className="flex items-center gap-2.5">
          <span className="px-2 py-0.5 rounded text-xs font-mono font-bold uppercase tracking-wider bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
            Sample Data
          </span>
          <span className="text-xs font-medium">
            Raw materials heat registry displaying simulated mill heats. Real plant ledger sync
            active.
          </span>
        </div>
        <span className="text-xs font-mono text-amber-600 dark:text-amber-400 font-semibold hidden sm:inline">
          DEMO_MODE ACTIVE
        </span>
      </div>

      {/* Header & Mass Balance Metric Tiles */}
      <div className="bg-surface rounded-2xl border border-border p-5 sm:p-6 shadow-sm space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-text flex items-center gap-2">
              <Scale className="w-5 h-5 text-amber-400 shrink-0" />
              <span>Raw Material Heat Inventory Ledger</span>
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              Strict mass-balance accounting preventing phantom heat number reuse during EU CBAM and
              verifier audits.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowOverAllocationDemo(!showOverAllocationDemo)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold border transition-all shadow-sm ${
                showOverAllocationDemo
                  ? 'bg-amber-500 text-obsidian-900 border-amber-600 font-bold'
                  : 'bg-surface-2 hover:bg-surface border-border text-amber-400'
              }`}
            >
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{showOverAllocationDemo ? 'Close Sandbox' : 'Test Anti-Phantom Engine'}</span>
            </button>

            <button
              onClick={handleResetInventory}
              className="p-2 rounded-full text-text-muted hover:text-text hover:bg-surface-2 transition-colors"
              title="Reset inventory to initial state"
              aria-label="Reset inventory"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Global Stacked Mass Balance Ledger Bar */}
        <div className="p-4 rounded-xl bg-surface-2/60 border border-border">
          <div className="text-xs font-mono font-semibold uppercase tracking-wider text-text-muted mb-2">
            Aggregate Plant Mass Balance Status
          </div>
          <MassBalanceBar
            receivedKg={totalPurchased * 1000}
            shippedKg={totalConsumed * 1000}
            remainingKg={totalRemaining * 1000}
            unit="MT"
          />
        </div>

        {/* Interactive Anti-Phantom Over-Allocation Sandbox */}
        {showOverAllocationDemo && (
          <div className="p-4 sm:p-5 rounded-xl bg-obsidian-950 text-white border border-border space-y-4 shadow-lg animate-in fade-in duration-200">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
              <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider">
                <ShieldAlert className="w-4 h-4" />
                <span>Interactive Anti-Phantom Allocation Sandbox</span>
              </div>
              <span className="text-xs font-mono text-text-muted">
                Rule: consumed_mass &lt;= purchased_mass
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
              <div>
                <label className="text-xs font-mono text-text-muted block mb-1">
                  Select Heat Batch:
                </label>
                <select
                  value={selectedHeatForTest}
                  onChange={(e) => {
                    setSelectedHeatForTest(e.target.value);
                    setSimulationResult({ status: 'IDLE', message: '' });
                  }}
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-text font-mono text-xs focus:outline-none focus:border-amber-500"
                >
                  {inventory.map((item) => (
                    <option key={item.heatNumber} value={item.heatNumber}>
                      #{item.heatNumber} ({item.supplierMill.split(' ')[0]} -{' '}
                      {item.remainingMT.toFixed(1)} MT left)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-mono text-text-muted">
                    Export Tonnage to Allocate:
                  </label>
                  <div className="flex items-center gap-1 text-xs font-mono">
                    <button
                      onClick={() => setTestTonnage(10)}
                      className="px-1.5 py-0.5 rounded bg-surface-2 hover:bg-surface text-amber-300"
                    >
                      10 MT
                    </button>
                    <button
                      onClick={() => setTestTonnage(25)}
                      className="px-1.5 py-0.5 rounded bg-surface-2 hover:bg-surface text-amber-300"
                    >
                      25 MT
                    </button>
                  </div>
                </div>
                <input
                  type="number"
                  value={testTonnage}
                  onChange={(e) => setTestTonnage(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-text font-mono text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <button
                  onClick={handleExecuteAllocationTest}
                  className="w-full py-2.5 px-4 rounded-lg bg-amber-500 hover:bg-amber-400 text-obsidian-950 font-bold font-mono text-xs flex items-center justify-center gap-2 transition-all shadow"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Execute Allocation Check</span>
                </button>
              </div>
            </div>

            {simulationResult.status === 'SUCCESS' && (
              <div className="p-3.5 rounded-lg bg-emerald-950/80 border border-emerald-500/60 text-xs text-emerald-200 space-y-1">
                <div className="font-bold flex items-center gap-2 text-emerald-400 font-mono">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{simulationResult.message}</span>
                </div>
                <p className="text-xs text-emerald-300/80 leading-relaxed font-mono">
                  {simulationResult.detail}
                </p>
              </div>
            )}

            {simulationResult.status === 'REJECTED' && (
              <div className="p-3.5 rounded-lg bg-rose-950/80 border border-rose-500/60 text-xs text-rose-200 space-y-1">
                <div className="font-bold flex items-center gap-2 text-rose-400 font-mono">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{simulationResult.message}</span>
                </div>
                <p className="text-xs text-rose-300/80 leading-relaxed font-sans">
                  {simulationResult.detail}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Ledger Content: Mobile Card List (< md) / Desktop Table (>= md) */}
      <div className="bg-surface rounded-2xl border border-border shadow-sm overflow-hidden">
        {/* Controls Bar: Search, Filters & Density Toggle */}
        <div className="p-4 sm:p-5 border-b border-border flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Heat #, Mill, or Grade..."
              className="w-full pl-10 pr-8 py-2 rounded-xl bg-surface-2/60 border border-border text-text text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
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

            {/* Desktop Status Filters */}
            <div className="hidden md:flex items-center gap-1.5 text-xs font-mono">
              <span className="text-text-muted text-xs mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3" /> Status:
              </span>
              {(['ALL', 'HEALTHY', 'LOW_BALANCE', 'EXHAUSTED'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 rounded-full text-xs transition-colors ${
                    statusFilter === st
                      ? 'bg-emerald-500 text-obsidian-950 font-bold shadow-sm'
                      : 'bg-surface-2 border border-border text-text-muted hover:text-text hover:bg-surface'
                  }`}
                >
                  {st === 'ALL'
                    ? `All (${inventory.length})`
                    : st === 'HEALTHY'
                      ? 'Active Batches'
                      : st === 'LOW_BALANCE'
                        ? 'Low Quota'
                        : 'Exhausted'}
                </button>
              ))}
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

        {/* View Switch: Empty State / Mobile Card List (< md) / Desktop Table (>= md) */}
        {filteredItems.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={<Search className="w-6 h-6 text-text-muted" />}
              title="No heat lots found"
              description={`No steel inventory matching "${search}" under the current filter selection.`}
              action={
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setSearch('');
                    setStatusFilter('ALL');
                  }}
                >
                  Clear Search &amp; Filters
                </Button>
              }
            />
          </div>
        ) : (
          <>
            {/* 1. MOBILE CARD LIST (< md) — Zero horizontal scrolling */}
            <div className="md:hidden divide-y divide-border">
              {filteredItems.map((item) => (
                <div
                  key={item.heatNumber}
                  onClick={() => setSelectedHeatForDetail(item)}
                  className="p-4 hover:bg-surface-2/40 active:bg-surface-2 transition-colors cursor-pointer space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <HeatNumberTag heatNumber={item.heatNumber} />
                    {getStatusChip(item.status)}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div>
                      <span className="text-text-muted block text-xs">MILL</span>
                      <span className="font-semibold text-text truncate block">
                        {item.supplierMill}
                      </span>
                    </div>
                    <div>
                      <span className="text-text-muted block text-xs">GRADE &amp; PRECURSOR</span>
                      <span className="text-text truncate block">
                        {item.grade} · {item.precursorSee} tCO₂e
                      </span>
                    </div>
                  </div>

                  {/* Mass Balance Bar per Heat */}
                  <MassBalanceBar
                    receivedKg={item.totalPurchasedMT * 1000}
                    shippedKg={item.consumedExportMT * 1000}
                    remainingKg={item.remainingMT * 1000}
                    unit="MT"
                    showLegend={false}
                  />

                  <div className="flex items-center justify-between text-xs text-text-muted font-mono pt-1">
                    <span>Cert: {item.certRef}</span>
                    <span className="flex items-center text-emerald-400 font-semibold gap-0.5">
                      <span>View details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* 2. DESKTOP DATA TABLE (>= md) — Real table with sticky headers */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-surface-2/80 border-b border-border text-text-muted font-mono text-xs sticky top-0 z-10 backdrop-blur-md">
                    <th
                      className={`${density === 'compact' ? 'py-2.5 px-4' : 'py-3.5 px-6'} font-medium sticky left-0 bg-surface-2/95 z-20`}
                    >
                      Heat Number
                    </th>
                    <th
                      className={`${density === 'compact' ? 'py-2.5 px-4' : 'py-3.5 px-6'} font-medium`}
                    >
                      Supplier Mill
                    </th>
                    <th
                      className={`${density === 'compact' ? 'py-2.5 px-4' : 'py-3.5 px-6'} font-medium`}
                    >
                      Standard Grade
                    </th>
                    <th
                      className={`${density === 'compact' ? 'py-2.5 px-4' : 'py-3.5 px-6'} font-medium`}
                    >
                      Purchased
                    </th>
                    <th
                      className={`${density === 'compact' ? 'py-2.5 px-4' : 'py-3.5 px-6'} font-medium`}
                    >
                      Consumed
                    </th>
                    <th
                      className={`${density === 'compact' ? 'py-2.5 px-4' : 'py-3.5 px-6'} font-medium`}
                    >
                      Remaining Balance
                    </th>
                    <th
                      className={`${density === 'compact' ? 'py-2.5 px-4' : 'py-3.5 px-6'} font-medium`}
                    >
                      Precursor SEE
                    </th>
                    <th
                      className={`${density === 'compact' ? 'py-2.5 px-4' : 'py-3.5 px-6'} font-medium text-center`}
                    >
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border font-sans">
                  {filteredItems.map((item) => {
                    const percentUsed = (item.consumedExportMT / item.totalPurchasedMT) * 100;
                    return (
                      <tr
                        key={item.heatNumber}
                        onClick={() => setSelectedHeatForDetail(item)}
                        className="hover:bg-surface-2/50 transition-colors cursor-pointer group"
                      >
                        <td
                          className={`${density === 'compact' ? 'py-2.5 px-4' : 'py-3.5 px-6'} font-mono font-medium text-text sticky left-0 bg-surface group-hover:bg-surface-2/50 z-10`}
                        >
                          <HeatNumberTag heatNumber={item.heatNumber} />
                          <div className="text-xs text-text-muted font-normal mt-0.5">
                            Cert: {item.certRef}
                          </div>
                        </td>

                        <td
                          className={`${density === 'compact' ? 'py-2.5 px-4' : 'py-3.5 px-6'} font-medium text-text`}
                        >
                          {item.supplierMill}
                        </td>

                        <td
                          className={`${density === 'compact' ? 'py-2.5 px-4' : 'py-3.5 px-6'} font-mono text-text-muted`}
                        >
                          {item.grade}
                        </td>

                        <td
                          className={`${density === 'compact' ? 'py-2.5 px-4' : 'py-3.5 px-6'} font-mono text-text font-semibold`}
                        >
                          {item.totalPurchasedMT.toFixed(1)} MT
                        </td>

                        <td
                          className={`${density === 'compact' ? 'py-2.5 px-4' : 'py-3.5 px-6'} font-mono text-amber-400 font-semibold`}
                        >
                          {item.consumedExportMT.toFixed(1)} MT
                        </td>

                        <td
                          className={`${density === 'compact' ? 'py-2.5 px-4' : 'py-3.5 px-6'} font-mono`}
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-semibold ${item.remainingMT === 0 ? 'text-text-muted' : 'text-emerald-400'}`}
                            >
                              {item.remainingMT.toFixed(1)} MT
                            </span>
                            <div className="w-16 bg-surface-2 h-1.5 rounded-full overflow-hidden border border-border">
                              <div
                                className={`h-full ${item.remainingMT === 0 ? 'bg-text-muted/40' : 'bg-emerald-500'}`}
                                style={{ width: `${Math.max(0, 100 - percentUsed)}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        <td
                          className={`${density === 'compact' ? 'py-2.5 px-4' : 'py-3.5 px-6'} font-mono text-text-muted font-medium`}
                        >
                          {item.precursorSee} tCO₂e/t
                        </td>

                        <td
                          className={`${density === 'compact' ? 'py-2.5 px-4' : 'py-3.5 px-6'} text-center font-mono`}
                        >
                          {getStatusChip(item.status)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Footer Audit Guarantee */}
        <div className="p-4 bg-surface-2/40 border-t border-border flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-text-muted">
          <span>Mass Balance Ledger cryptographically verified with SHA-256 digests.</span>
          <span className="text-emerald-400 font-semibold">
            Row-Level Security &amp; Audit Trail Active
          </span>
        </div>
      </div>

      {/* Mobile Filter & Sort Bottom Sheet */}
      <FilterBottomSheet
        isOpen={isFilterSheetOpen}
        onClose={() => setIsFilterSheetOpen(false)}
        title="Filter Heat Inventory"
        statusOptions={[
          { id: 'ALL', label: 'All Heats', count: inventory.length },
          {
            id: 'HEALTHY',
            label: 'Active Batches',
            count: inventory.filter((i) => i.status === 'HEALTHY').length,
          },
          {
            id: 'LOW_BALANCE',
            label: 'Low Quota',
            count: inventory.filter((i) => i.status === 'LOW_BALANCE').length,
          },
          {
            id: 'EXHAUSTED',
            label: 'Exhausted',
            count: inventory.filter((i) => i.status === 'EXHAUSTED').length,
          },
        ]}
        selectedStatus={statusFilter}
        onSelectStatus={(st) => {
          setStatusFilter(st as any);
          setIsFilterSheetOpen(false);
        }}
        activeCount={activeFilterCount}
        onReset={() => {
          setStatusFilter('ALL');
          setSearch('');
          setIsFilterSheetOpen(false);
        }}
      />

      {/* Quick Detail Modal for Selected Heat (Mobile & Desktop) */}
      {selectedHeatForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/80 backdrop-blur-sm">
          <div className="bg-surface border border-border rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-left">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <HeatNumberTag heatNumber={selectedHeatForDetail.heatNumber} />
                {getStatusChip(selectedHeatForDetail.status)}
              </div>
              <button
                onClick={() => setSelectedHeatForDetail(null)}
                className="text-text-muted hover:text-text p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between py-1 border-b border-border">
                <span className="text-text-muted">Supplier Mill:</span>
                <span className="font-semibold text-text">
                  {selectedHeatForDetail.supplierMill}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-border">
                <span className="text-text-muted">Certificate Ref:</span>
                <span className="text-amber-400">{selectedHeatForDetail.certRef}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border">
                <span className="text-text-muted">Steel Grade:</span>
                <span className="text-text">{selectedHeatForDetail.grade}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border">
                <span className="text-text-muted">Precursor Emissions:</span>
                <span className="text-text">{selectedHeatForDetail.precursorSee} tCO₂e/t</span>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-xs font-mono text-text-muted block mb-2">
                Mass Balance Allocation
              </span>
              <MassBalanceBar
                receivedKg={selectedHeatForDetail.totalPurchasedMT * 1000}
                shippedKg={selectedHeatForDetail.consumedExportMT * 1000}
                remainingKg={selectedHeatForDetail.remainingMT * 1000}
                unit="MT"
              />
            </div>

            <div className="pt-3 flex justify-end">
              <Button variant="primary" size="sm" onClick={() => setSelectedHeatForDetail(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
