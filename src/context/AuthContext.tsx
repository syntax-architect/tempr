import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ApiService, AuthUser } from '../services/api';

export type UserRole = 'OWNER' | 'QA_INSPECTOR' | 'DISPATCH' | 'VIEWER' | 'QA_HEAD';

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  role: UserRole;
  isAuthenticated: boolean;
  isQaInspector: boolean;
  isStepUpActive: boolean;
  stepUpRemainingSeconds: number;
  stepUpTimerString: string;
  sessionMode: 'SANDBOX_DEMO' | 'AUTHENTICATED_QA';
  expiresAt: number | null;
  expiryTimerString: string;
  login: (email: string, password: string) => Promise<boolean>;
  loginDemo: () => Promise<boolean>;
  loginWithPin: (pin: string) => Promise<boolean>;
  verifyStepUp: (code: string) => Promise<boolean>;
  logout: () => void;
  isPinModalOpen: boolean;
  openPinModal: () => void;
  closePinModal: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_TOKEN_KEY = 'hl_auth_token_v1';
const STORAGE_USER_KEY = 'hl_auth_user_v1';

const isUiPreview = import.meta.env.VITE_UI_PREVIEW_MODE === 'true';

const MOCK_PREVIEW_USER: AuthUser = {
  id: 'usr_qa_04',
  sub: 'usr_qa_04',
  name: 'R. K. Chatterjee',
  email: 'r.chatterjee@howrahforgings.example.com',
  designation: 'Head of Quality Assurance & Certification',
  role: 'QA_INSPECTOR',
  plant_id: 'plant-howrah-01',
  plant_name: 'Howrah Precision Forgings Pvt. Ltd.',
  organization_id: 'org_howrah_steel_01',
  organization_name: 'Howrah Precision Forgings Pvt. Ltd.',
  is_sandbox: false,
  emp_id: 'EMP-HOW-4409',
  works_location: 'Liluah Works, Howrah',
  nabl_code: 'NABL-TC-8819',
  en10204_authority: 'EN 10204 3.1 Authorized Works Inspection Representative',
  last_step_up_at: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + 86400 * 30,
};
const MOCK_PREVIEW_TOKEN = 'preview_jwt_mock_token_for_aistudio_ui';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    if (isUiPreview) return MOCK_PREVIEW_TOKEN;
    return localStorage.getItem(STORAGE_TOKEN_KEY) || localStorage.getItem('heatledger_token');
  });

  const [user, setUser] = useState<AuthUser | null>(() => {
    if (isUiPreview) return MOCK_PREVIEW_USER;
    const raw = localStorage.getItem(STORAGE_USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  });

  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [nowSec, setNowSec] = useState<number>(Math.floor(Date.now() / 1000));

  // Periodic clock for countdown timer (1s interval for smooth step-up timer)
  useEffect(() => {
    const interval = setInterval(() => {
      setNowSec(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const role: UserRole = (user?.role as UserRole) || 'VIEWER';
  const isQaInspector = role === 'QA_INSPECTOR' || role === 'QA_HEAD';
  const isAuthenticated = !!(token && user);
  const sessionMode: 'SANDBOX_DEMO' | 'AUTHENTICATED_QA' =
    isAuthenticated && isQaInspector && !user?.is_sandbox ? 'AUTHENTICATED_QA' : 'SANDBOX_DEMO';
  const expiresAt = user?.exp || null;

  // 10-Minute Step-Up MFA Calculations
  const lastStepUpAt = user?.last_step_up_at || 0;
  const stepUpRemainingSeconds = Math.max(0, 600 - (nowSec - lastStepUpAt));
  const isStepUpActive = isQaInspector && stepUpRemainingSeconds > 0;
  const stepUpTimerString = isStepUpActive
    ? `${Math.floor(stepUpRemainingSeconds / 60)}:${(stepUpRemainingSeconds % 60).toString().padStart(2, '0')}`
    : 'Expired';

  // Compute remaining session time string
  const expiryTimerString = (() => {
    if (!isAuthenticated || !expiresAt) return 'Session: Active';
    const remainingSec = expiresAt - nowSec;
    if (remainingSec <= 0) return 'Session Expired';
    const hours = Math.floor(remainingSec / 3600);
    const mins = Math.floor((remainingSec % 3600) / 60);
    return `${hours}h ${mins.toString().padStart(2, '0')}m left`;
  })();

  const loginWithPin = useCallback(async (pin: string): Promise<boolean> => {
    try {
      const res = await ApiService.verifyInspectorPin(pin);
      if (res && res.token && res.user) {
        const enrichedUser = {
          ...res.user,
          last_step_up_at: Math.floor(Date.now() / 1000),
        };
        setToken(res.token);
        setUser(enrichedUser);
        localStorage.setItem(STORAGE_TOKEN_KEY, res.token);
        localStorage.setItem('heatledger_token', res.token);
        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(enrichedUser));
        setIsPinModalOpen(false);
        return true;
      }
      return false;
    } catch (err) {
      throw err;
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await ApiService.login(email, password);
      if (res && res.token && res.user) {
        setToken(res.token);
        setUser(res.user);
        localStorage.setItem(STORAGE_TOKEN_KEY, res.token);
        localStorage.setItem('heatledger_token', res.token);
        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(res.user));
        return true;
      }
      return false;
    } catch (err) {
      throw err;
    }
  }, []);

  const loginDemo = useCallback(async (): Promise<boolean> => {
    try {
      const res = await ApiService.loginDemo();
      if (res && res.token && res.user) {
        setToken(res.token);
        setUser(res.user);
        localStorage.setItem(STORAGE_TOKEN_KEY, res.token);
        localStorage.setItem('heatledger_token', res.token);
        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(res.user));
        return true;
      }
      return false;
    } catch (err) {
      throw err;
    }
  }, []);

  const verifyStepUp = useCallback(async (code: string): Promise<boolean> => {
    try {
      const res = await ApiService.verifyStepUp(code);
      if (res && res.status === 'step_up_verified') {
        const now = Math.floor(Date.now() / 1000);
        setUser((prev) => {
          if (!prev) return prev;
          const updated = { ...prev, last_step_up_at: now };
          localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(updated));
          return updated;
        });
        setIsPinModalOpen(false);
        return true;
      }
      return false;
    } catch (err) {
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(STORAGE_TOKEN_KEY);
    localStorage.removeItem('heatledger_token');
    localStorage.removeItem(STORAGE_USER_KEY);
  }, []);

  const openPinModal = useCallback(() => {
    setIsPinModalOpen(true);
  }, []);

  const closePinModal = useCallback(() => {
    setIsPinModalOpen(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role,
        isAuthenticated,
        isQaInspector,
        isStepUpActive,
        stepUpRemainingSeconds,
        stepUpTimerString,
        sessionMode,
        expiresAt,
        expiryTimerString,
        login,
        loginDemo,
        loginWithPin,
        verifyStepUp,
        logout,
        isPinModalOpen,
        openPinModal,
        closePinModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
