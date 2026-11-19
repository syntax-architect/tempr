import React from 'react';
import { ResponsiveSheet } from '../common/ResponsiveSheet';
import { Bell, Stamp, CheckCircle2, FileCheck2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NotificationItem {
  id: string;
  type: 'sign-off' | 'mtc' | 'cbam' | 'heat';
  title: string;
  description: string;
  timestamp: string;
  isUnread: boolean;
  route: string;
}

const SAMPLE_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'sign-off',
    title: '3 Shipments Awaiting Clause 6 Sign-Off',
    description: 'Consignments for Rotterdam Port require authorized QA Inspector signature and Passkey step-up.',
    timestamp: '12m ago',
    isUnread: true,
    route: '/app/sign-off',
  },
  {
    id: 'notif-2',
    type: 'cbam',
    title: 'CBAM Dossier Ready: Shipment #SHP-2026-0881',
    description: 'XML datasheet successfully validated against EU CBAM Transitional Schema. Ready for customs clearance.',
    timestamp: '45m ago',
    isUnread: true,
    route: '/app/dossiers',
  },
  {
    id: 'notif-3',
    type: 'heat',
    title: 'Heat #H-7821 Carbon Resolution Approved',
    description: 'Optical emission spectrometer confirmed Ladle Carbon at 0.22% C, within EN 10025-2 S355JR limits.',
    timestamp: '2h ago',
    isUnread: false,
    route: '/app/heats',
  },
  {
    id: 'notif-4',
    type: 'mtc',
    title: 'SAIL Bhilai MTC #TC-2026-9041 Extracted',
    description: 'PyMuPDF parsed 14 chemical elements and 4 mechanical values with 99.4% confidence.',
    timestamp: '5h ago',
    isUnread: false,
    route: '/app/certificates',
  },
];

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleSelectNotification = (route: string) => {
    onClose();
    navigate(route);
  };

  return (
    <ResponsiveSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Factory QA & Compliance Alerts"
      description="Live notifications for certificate validation, Clause 6 digital sign-offs, and CBAM customs packages."
    >
      <div className="space-y-3">
        {SAMPLE_NOTIFICATIONS.map((item) => {
          let Icon = Bell;
          let iconColor = 'text-slate-400';
          let iconBg = 'bg-slate-100 dark:bg-slate-800';

          if (item.type === 'sign-off') {
            Icon = Stamp;
            iconColor = 'text-rose-500';
            iconBg = 'bg-rose-500/10 border-rose-500/20';
          } else if (item.type === 'cbam') {
            Icon = FileCheck2;
            iconColor = 'text-emerald-500';
            iconBg = 'bg-emerald-500/10 border-emerald-500/20';
          } else if (item.type === 'heat') {
            Icon = CheckCircle2;
            iconColor = 'text-amber-500';
            iconBg = 'bg-amber-500/10 border-amber-500/20';
          }

          return (
            <button
              key={item.id}
              onClick={() => handleSelectNotification(item.route)}
              className={`w-full text-left p-3.5 rounded-xl border transition-all touch-target cursor-pointer flex items-start gap-3 ${
                item.isUnread
                  ? 'bg-slate-50 dark:bg-slate-800/90 border-slate-300 dark:border-slate-700 shadow-sm'
                  : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800/60 opacity-80 hover:opacity-100'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${iconBg} ${iconColor}`}
              >
                <Icon className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-xs text-slate-900 dark:text-white truncate">
                    {item.title}
                  </span>
                  <span className="text-xs font-mono text-slate-400 shrink-0">{item.timestamp}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-2">
                  {item.description}
                </p>
                <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1.5">
                  <span>View Details</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>

              {item.isUnread && (
                <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
              )}
            </button>
          );
        })}
      </div>
    </ResponsiveSheet>
  );
};
