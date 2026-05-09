import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Eye, EyeOff, FlaskConical, AlertCircle, KeyRound, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getUserByEmail } from '../data/mockData';
import { TEXT_TOKENS } from '../utils/textTokens';

type AuthMode = 'signin' | 'forgot' | 'reset';

export default function LoginPage() {
  const { login, requestPasswordReset, resetPassword } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [detectedUser, setDetectedUser] = useState<null | { name: string; unit: string; role: string }>(null);
  const visibleRole = detectedUser?.role || 'Staff';

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setError('');
    setMessage('');
    if (value.includes('@')) {
      const found = getUserByEmail(value);
      if (found) {
        const roleLabel = found.role === 'staff' ? 'Staff' : found.role === 'supervisor' ? 'Supervisor' : 'HOD';
        setDetectedUser({ name: found.name, unit: found.unit, role: roleLabel });
      } else {
        setDetectedUser(null);
      }
    } else {
      setDetectedUser(null);
    }
  };

  const routeByRole = (emailAddress: string) => {
    const user = getUserByEmail(emailAddress);
    if (!user) return;
    if (user.role === 'staff') navigate('/staff/dashboard');
    else if (user.role === 'supervisor') navigate('/supervisor/dashboard');
    else navigate('/hod/dashboard');
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);
    setTimeout(() => {
      const result = login(email, password);
      if (result.success) {
        routeByRole(email);
      } else {
        setError(result.error || 'Login failed.');
        setIsLoading(false);
      }
    }, 500);
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = requestPasswordReset(email);
    setMessage(res.message);
    if (getUserByEmail(email)) {
      setMode('reset');
    }
  };

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    const result = resetPassword(email, password);
    if (!result.success) {
      setError(result.error || 'Unable to reset password.');
      return;
    }
    setMessage('Password updated. You can now sign in.');
    setPassword('');
    setConfirmPassword('');
    setMode('signin');
  };

  return (
    <div className="auth-page min-h-screen bg-[var(--surface-base)] flex items-center justify-center p-6">
      <div className="w-full max-w-[420px]">
        <div className="flex items-center gap-3 mb-8">
          <div className="auth-logo-mark bg-[linear-gradient(135deg,var(--accent-primary),#6366f1)] rounded-lg size-[52px] flex items-center justify-center flex-shrink-0 shadow-[0_4px_16px_rgba(58,110,232,0.30)]">
            <span className="text-white font-bold text-[15px]">LK</span>
          </div>
          <div>
            <div className="text-[var(--text-primary)] font-bold text-[20px] leading-tight">Knowlab</div>
            <div className="text-[var(--text-secondary)] text-[13px]">Laboratory Knowledge Management</div>
          </div>
        </div>

        <div className="auth-card bg-[var(--surface-card)] rounded-2xl border border-[var(--surface-border)] shadow-xl p-8 sm:p-10">
          {mode !== 'signin' && (
            <button
              onClick={() => {
                setMode('signin');
                setError('');
                setMessage('');
              }}
              className="mb-4 inline-flex items-center gap-1.5 text-[var(--kl-text-muted)] text-[13px] hover:text-[var(--kl-primary)] transition-colors"
            >
              <ArrowLeft size={14} /> Back to sign in
            </button>
          )}

          {mode === 'signin' && (
            <>
              <h1 className="auth-heading text-[var(--text-primary)] font-bold text-[28px] mb-1">Sign in to Knowlab</h1>
              <p className="auth-subheading text-[var(--text-secondary)] text-[14px] mb-6 leading-[1.5]">Secure workspace sign in with role-aware access.</p>
              <div className="role-tabs mb-6 flex gap-0.5 rounded-md bg-[var(--surface-base)] p-[3px]">
                {['Staff', 'Supervisor', 'HOD'].map((role) => (
                  <div
                    key={role}
                    className={`role-tab flex-1 rounded-[10px] px-3 py-2 text-center text-[13px] font-medium transition-all duration-base ease-spring ${
                      visibleRole === role
                        ? 'bg-[var(--surface-card)] text-[var(--text-primary)] shadow-sm'
                        : 'text-[var(--text-secondary)]'
                    }`}
                    aria-current={visibleRole === role ? 'true' : undefined}
                  >
                    {role}
                  </div>
                ))}
              </div>
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label className="block text-[var(--text-secondary)] font-medium text-[13px] mb-1.5">Work email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => handleEmailChange(e.target.value)}
                    placeholder="you@knowlab.com"
                    required
                    className="input w-full h-[42px] rounded-md px-[14px] text-[15px]"
                  />
                </div>

                {detectedUser && (
                  <div className="bg-[var(--accent-glow)] border border-[var(--surface-border)] rounded-lg p-4 flex items-start gap-3">
                    <FlaskConical size={16} className="text-[var(--accent-primary)] mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[var(--text-primary)] font-semibold text-[14px]">{detectedUser.unit}</p>
                      <p className="text-[var(--text-secondary)] text-[12px]">{detectedUser.name}</p>
                    </div>
                    <div className="bg-[var(--surface-card)] text-[var(--accent-primary)] font-medium text-[11px] px-3 py-1 rounded-full flex-shrink-0 border border-[var(--surface-border)]">
                      {detectedUser.role}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[var(--text-secondary)] font-medium text-[13px] mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => { setPassword(e.target.value); setError(''); }}
                      placeholder="Enter your password"
                      required
                      className="input w-full h-[42px] rounded-md px-[14px] pr-12 text-[15px]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      className="absolute right-2.5 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-xs border border-[var(--surface-border)] bg-[var(--glass-bg)] text-[var(--text-tertiary)] backdrop-blur-sm transition-all hover:bg-[var(--surface-base)] hover:text-[var(--text-secondary)]"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-[var(--accent-primary)] text-[12px] font-medium hover:underline"
                    onClick={() => setMode('forgot')}
                  >
                    Forgot password?
                  </button>
                </div>

                {error && (
                  <div className="flex items-center gap-2 bg-[rgba(255,59,48,0.12)] text-[var(--destructive)] text-[13px] rounded-md px-4 py-3">
                    <AlertCircle size={14} />
                    {error}
                  </div>
                )}
                {message && (
                  <div className="flex items-center gap-2 bg-[rgba(52,199,89,0.12)] text-[var(--success)] text-[13px] rounded-md px-4 py-3">
                    <KeyRound size={14} />
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full h-[46px] justify-center rounded-lg px-4 text-[14px] font-semibold disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                >
                  {isLoading ? `Signing in${TEXT_TOKENS.ellipsis}` : 'Sign in to Knowlab'}
                </button>
              </form>
            </>
          )}

          {mode === 'forgot' && (
            <>
              <h1 className="text-[var(--kl-text)] font-semibold text-[24px] mb-1">Reset your password</h1>
              <p className="text-[var(--kl-text-muted)] text-[14px] mb-6">Enter your email to begin password reset.</p>
              <form onSubmit={handleForgot} className="space-y-4">
                <div>
                  <label className="block text-[var(--kl-text)] font-medium text-[13px] mb-1.5">Work email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => handleEmailChange(e.target.value)}
                    placeholder="you@knowlab.com"
                    required
                    className="w-full bg-[var(--kl-surface)] border border-[var(--kl-border)] rounded-[14px] px-4 py-3.5 text-[14px] text-[var(--kl-text)] placeholder:text-[var(--kl-text-muted)] focus:outline-none focus:border-[var(--kl-primary)] focus:ring-2 focus:ring-[var(--kl-primary)]/10 transition-all"
                  />
                </div>
                {message && (
                  <div className="flex items-center gap-2 bg-[#e8f8f1] dark:bg-[rgba(28,123,86,0.18)] text-[#1c7b56] dark:text-[#88e0ba] text-[13px] rounded-[12px] px-4 py-3">
                    <KeyRound size={14} />
                    {message}
                  </div>
                )}
                <button type="submit" className="w-full bg-[var(--kl-primary)] hover:bg-[var(--kl-primary-hover)] text-white font-medium text-[14px] py-4 rounded-[16px] transition-colors">
                  Continue
                </button>
              </form>
            </>
          )}

          {mode === 'reset' && (
            <>
              <h1 className="text-[var(--kl-text)] font-semibold text-[24px] mb-1">Set new password</h1>
              <p className="text-[var(--kl-text-muted)] text-[14px] mb-6">Create a new password for this account.</p>
              <form onSubmit={handleReset} className="space-y-4">
                <div>
                  <label className="block text-[var(--kl-text)] font-medium text-[13px] mb-1.5">Work email</label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full bg-[var(--kl-surface-tinted)] border border-[var(--kl-border)] rounded-[14px] px-4 py-3.5 text-[14px] text-[var(--kl-text-muted)]"
                  />
                </div>
                <div>
                  <label className="block text-[var(--kl-text)] font-medium text-[13px] mb-1.5">New password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="w-full bg-[var(--kl-surface)] border border-[var(--kl-border)] rounded-[14px] px-4 py-3.5 text-[14px] text-[var(--kl-text)] focus:outline-none focus:border-[var(--kl-primary)] focus:ring-2 focus:ring-[var(--kl-primary)]/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[var(--kl-text)] font-medium text-[13px] mb-1.5">Confirm password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                    className="w-full bg-[var(--kl-surface)] border border-[var(--kl-border)] rounded-[14px] px-4 py-3.5 text-[14px] text-[var(--kl-text)] focus:outline-none focus:border-[var(--kl-primary)] focus:ring-2 focus:ring-[var(--kl-primary)]/10 transition-all"
                  />
                </div>
                {error && (
                  <div className="flex items-center gap-2 bg-[#fde9e9] dark:bg-[rgba(177,67,67,0.18)] text-[#b14343] dark:text-[#fca5a5] text-[13px] rounded-[12px] px-4 py-3">
                    <AlertCircle size={14} />
                    {error}
                  </div>
                )}
                <button type="submit" className="w-full bg-[var(--kl-primary)] hover:bg-[var(--kl-primary-hover)] text-white font-medium text-[14px] py-4 rounded-[16px] transition-colors">
                  Update password
                </button>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-[var(--kl-text-muted)] text-[11px] mt-6">
          Knowlab - Hospital Laboratory Knowledge Management Platform
        </p>
      </div>
    </div>
  );
}
