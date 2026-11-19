import React from 'react';
import { ResponsiveSheet } from '../common/ResponsiveSheet';
import { Building2, Check, MapPin, Shield, Zap } from 'lucide-react';

export interface PlantProfile {
  id: string;
  name: string;
  shortName: string;
  installationId: string;
  unLocode: string;
  location: string;
  furnaceRoute: string;
  activeEmissionsScope: string;
}

export const REGISTERED_PLANTS: PlantProfile[] = [
  {
    id: 'howrah-plant-1',
    name: 'Howrah Precision Forgings Pvt. Ltd.',
    shortName: 'Plant 1 · Liluah',
    installationId: 'IN-WB-4409',
    unLocode: 'IN CCU',
    location: 'Howrah, West Bengal',
    furnaceRoute: 'Induction Furnace + Gas-Fired Reheating',
    activeEmissionsScope: 'CBAM Annex II Steel (7326 / 7214)',
  },
  {
    id: 'raipur-sms-2',
    name: 'Central India Steel & Alloys Ltd.',
    shortName: 'SMS-2 · Raipur Works',
    installationId: 'IN-CG-8821',
    unLocode: 'IN RPR',
    location: 'Raipur, Chhattisgarh',
    furnaceRoute: 'Direct Reduced Iron (DRI) + Electric Arc Furnace',
    activeEmissionsScope: 'CBAM Annex I Billets & Wire Rod (7207)',
  },
  {
    id: 'kalinganagar-mill-4',
    name: 'Coastal Strip & Bar Mills Corp.',
    shortName: 'Plant 4 · Kalinganagar',
    installationId: 'IN-OD-1092',
    unLocode: 'IN PRT',
    location: 'Jajpur, Odisha',
    furnaceRoute: 'Basic Oxygen Furnace (BOF) Route',
    activeEmissionsScope: 'CBAM Hot-Rolled Coil (7208)',
  },
  {
    id: 'jamshedpur-unit-3',
    name: 'Chotanagpur Heavy Forgings Unit',
    shortName: 'Unit 3 · Jamshedpur',
    installationId: 'IN-JH-5530',
    unLocode: 'IN IXW',
    location: 'Jamshedpur, Jharkhand',
    furnaceRoute: 'Secondary Metallurgy + Heavy Hydraulic Press',
    activeEmissionsScope: 'Engineered Forged Flanges (7307)',
  },
];

interface PlantSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  activePlantId: string;
  onSelectPlant: (plant: PlantProfile) => void;
}

export const PlantSwitcherModal: React.FC<PlantSwitcherModalProps> = ({
  isOpen,
  onClose,
  activePlantId,
  onSelectPlant,
}) => {
  return (
    <ResponsiveSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Switch Factory Installation"
      description="Select the registered manufacturing plant to scope MTC verification, heat inventory, and CBAM customs dossiers."
    >
      <div className="space-y-3">
        {REGISTERED_PLANTS.map((plant) => {
          const isSelected = plant.id === activePlantId;

          return (
            <button
              key={plant.id}
              onClick={() => {
                onSelectPlant(plant);
                onClose();
              }}
              className={`w-full text-left p-4 rounded-xl border transition-all touch-target cursor-pointer flex items-start justify-between gap-3 ${
                isSelected
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-slate-900 dark:text-white shadow-sm ring-1 ring-emerald-500/30'
                  : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
              }`}
            >
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-xs text-slate-900 dark:text-white truncate">
                    {plant.name}
                  </span>
                  <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                    {plant.shortName}
                  </span>
                </div>

                <div className="text-xs text-slate-500 dark:text-slate-400 font-mono flex items-center gap-3 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5 text-slate-400" />
                    ID: <strong className="text-slate-700 dark:text-slate-200">{plant.installationId}</strong>
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    UN/LOCODE: <strong className="text-slate-700 dark:text-slate-200">{plant.unLocode}</strong>
                  </span>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5 pt-0.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span className="truncate">{plant.furnaceRoute}</span>
                </div>

                <div className="text-xs text-emerald-600 dark:text-emerald-400 font-mono">
                  Scope: {plant.activeEmissionsScope}
                </div>
              </div>

              {isSelected && (
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shrink-0 mt-1">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </ResponsiveSheet>
  );
};
