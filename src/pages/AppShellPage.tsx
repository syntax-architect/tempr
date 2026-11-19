import React, { useMemo } from 'react';
import { useNavigate, useLocation, useParams, useSearchParams } from 'react-router-dom';
import { DashboardShell } from '../components/dashboard/DashboardShell';
import { DashboardView } from '../types';

export const AppShellPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const params = useParams();

  // Map URL path or query parameter to DashboardView
  const currentView: DashboardView = useMemo(() => {
    const queryView = searchParams.get('view') as DashboardView;
    if (
      queryView &&
      [
        'command-center',
        'mtc-workbench',
        'sign-off-queue',
        'heat-inventory',
        'cbam-dossier',
        'supplier-intelligence',
        'supplier-requests',
        'intake-channels',
        'settings',
      ].includes(queryView)
    ) {
      return queryView;
    }

    const path = location.pathname.toLowerCase();
    if (path.includes('/supplier-requests') || path.includes('/requests')) return 'supplier-requests';
    if (path.includes('/suppliers')) return 'supplier-intelligence';
    if (path.includes('/intake') || path.includes('/channels') || path.includes('/whatsapp'))
      return 'intake-channels';
    if (path.includes('/certificates') || path.includes('/review'))
      return 'mtc-workbench';
    if (path.includes('/sign-off') || path.includes('/queue')) return 'sign-off-queue';
    if (path.includes('/heats')) return 'heat-inventory';
    if (path.includes('/cbam') || path.includes('/dossiers') || path.includes('/reports'))
      return 'cbam-dossier';
    if (path.includes('/settings')) return 'settings';

    // Default /app or /app/shipments
    return 'command-center';
  }, [location.pathname, searchParams]);

  const presetId = searchParams.get('preset') || undefined;

  const handleSelectView = (view: DashboardView) => {
    switch (view) {
      case 'command-center':
        navigate('/app/shipments');
        break;
      case 'mtc-workbench':
        navigate('/app/certificates');
        break;
      case 'sign-off-queue':
        navigate('/app/sign-off');
        break;
      case 'heat-inventory':
        navigate('/app/heats');
        break;
      case 'cbam-dossier':
        navigate('/app/dossiers');
        break;
      case 'supplier-intelligence':
        navigate('/app/suppliers');
        break;
      case 'supplier-requests':
        navigate('/app/supplier-requests');
        break;
      case 'intake-channels':
        navigate('/app/intake');
        break;
      case 'settings':
        navigate('/app/settings');
        break;
      default:
        navigate('/app');
    }
  };

  const handleReturnToMarketing = () => {
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <DashboardShell
      currentView={currentView}
      onSelectView={handleSelectView}
      onReturnToMarketing={handleReturnToMarketing}
      initialPresetId={presetId}
    />
  );
};

export default AppShellPage;
