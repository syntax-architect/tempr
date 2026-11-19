import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  ShieldCheck,
  KeyRound,
  Lock,
  ArrowLeft,
  ArrowRight,
  Zap,
  Mail,
  Users,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/app/shipments';

  const { loginWithPin, login, loginDemo } = useAuth();
  const [authTab, setAuthTab] = useState<'pin' | 'credentials'>('pin');
  const [pin, setPin] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length < 4) {
      setErrorMsg('PIN must be at least 4 digits');
      return;
    }
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const ok = await loginWithPin(pin);
      if (ok) {
        navigate(returnUrl);
      } else {
        setErrorMsg('Invalid inspector PIN. (Demo default: 440926)');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Authentication error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Email and password are required');
      return;
    }
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const ok = await login(email, password);
      if (ok) {
        navigate(returnUrl);
      } else {
        setErrorMsg('Invalid email or password');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Authentication error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectRolePreset = (pEmail: string, pPass: string) => {
    setEmail(pEmail);
    setPassword(pPass);
    setErrorMsg(null);
  };

  const handleDemoAccess = async () => {
    setIsLoading(true);
    try {
      await loginDemo();
      navigate(returnUrl);
    } catch {
      navigate('/app/shipments');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Landing Page
        </Link>

        <div className="flex items-center gap-2 mb-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Lock className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            HeatLedger Access Gateway
          </span>
        </div>
        <p className="text-xs text-slate-400 font-mono">
          Database-Backed RBAC · EN 10204 Clause 6 · 10-Minute Step-Up MFA
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-5">
          {/* Tab Selector */}
          <div className="grid grid-cols-2 p-1 bg-slate-950/80 rounded-xl border border-slate-800 text-xs font-mono">
            <button
              onClick={() => {
                setAuthTab('pin');
                setErrorMsg(null);
              }}
              className={`py-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                authTab === 'pin'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Floor PIN (QA)</span>
            </button>
            <button
              onClick={() => {
                setAuthTab('credentials');
                setErrorMsg(null);
              }}
              className={`py-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                authTab === 'credentials'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Database Roles</span>
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs font-mono text-rose-300">
              {errorMsg}
            </div>
          )}

          {authTab === 'pin' ? (
            /* Quick Floor PIN Login */
            <form onSubmit={handlePinSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1 font-semibold">
                  Factory Floor Inspector PIN
                </label>
                <div className="relative">
                  <input
                    type="password"
                    maxLength={6}
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6-digit PIN (e.g. 440926)"
                    className="w-full px-4 py-3 bg-slate-950/80 border border-slate-700 rounded-xl text-center font-mono text-lg tracking-[0.3em] text-emerald-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    autoFocus
                  />
                </div>
                <div className="text-[12px] text-slate-500 font-mono mt-1 text-center">
                  Authorized Plant QA Head PIN · Default: 440926
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || pin.length < 4}
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-98 disabled:opacity-50 text-slate-950 font-bold text-xs font-mono tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                {isLoading ? (
                  <span>VERIFYING PIN...</span>
                ) : (
                  <>
                    <span>STEP-UP AUTHENTICATE</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Database RBAC Email/Password Login */
            <form onSubmit={handleCredentialsSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1 font-semibold">
                  Work Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. inspector@howrahsteel.in"
                  className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl font-mono text-xs text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1 font-semibold">
                  Account Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl font-mono text-xs text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              {/* Quick Role Fill Presets */}
              <div className="space-y-1.5">
                <span className="text-xs font-mono text-slate-500 uppercase tracking-wider block">
                  Quick Role Fill (Demo):
                </span>
                <div className="grid grid-cols-2 gap-1.5 text-xs font-mono">
                  <button
                    type="button"
                    onClick={() =>
                      handleSelectRolePreset('owner@howrahsteel.in', 'OwnerSecretPassword2026!')
                    }
                    className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-750 border border-slate-700 text-left text-slate-300 transition-colors cursor-pointer"
                  >
                    <span className="font-bold text-amber-300 block">OWNER</span>
                    <span className="text-xs text-slate-400">P. K. Banerjee</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleSelectRolePreset('inspector@howrahsteel.in', 'InspectorPassword2026!')
                    }
                    className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-750 border border-slate-700 text-left text-slate-300 transition-colors cursor-pointer"
                  >
                    <span className="font-bold text-emerald-300 block">QA_INSPECTOR</span>
                    <span className="text-xs text-slate-400">R. K. Chatterjee</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleSelectRolePreset('dispatch@howrahsteel.in', 'DispatchPassword2026!')
                    }
                    className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-750 border border-slate-700 text-left text-slate-300 transition-colors cursor-pointer"
                  >
                    <span className="font-bold text-sky-300 block">DISPATCH</span>
                    <span className="text-xs text-slate-400">A. K. Sen</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleSelectRolePreset('auditor@howrahsteel.in', 'AuditorPassword2026!')
                    }
                    className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-750 border border-slate-700 text-left text-slate-300 transition-colors cursor-pointer"
                  >
                    <span className="font-bold text-purple-300 block">VIEWER</span>
                    <span className="text-xs text-slate-400">Customs Auditor</span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-98 disabled:opacity-50 text-slate-950 font-bold text-xs font-mono tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                {isLoading ? (
                  <span>AUTHENTICATING...</span>
                ) : (
                  <>
                    <span>SIGN IN WITH ROLE</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs font-mono uppercase">
              <span className="bg-slate-900 px-3 text-slate-500">Or Demo Sandbox</span>
            </div>
          </div>

          {/* Sandbox Access */}
          <button
            onClick={handleDemoAccess}
            disabled={isLoading}
            className="w-full py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-750 text-slate-200 font-mono text-xs border border-slate-700/80 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Launch Sandbox Demo Plant (Demo Mode)</span>
          </button>

          <div className="pt-1 text-center text-xs font-mono text-slate-500">
            Protected by In-Memory Rate Limiting · OWASP ASVS 4.0
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
