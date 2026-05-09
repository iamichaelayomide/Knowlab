import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { getUserByEmail } from '../data/mockData';
import { TEXT_TOKENS } from '../utils/textTokens';
import { AppIcon } from '../components/icons/AppIcon';

type AuthMode = 'signin' | 'forgot' | 'reset';
type DemoRole = 'Staff' | 'Supervisor' | 'HOD';

const DEMO_CREDENTIALS: Record<DemoRole, { email: string; password: string }> = {
  Staff: { email: 'staff123@knowlab.com', password: 'staff123' },
  Supervisor: { email: 'supervisor123@knowlab.com', password: 'supervisor123' },
  HOD: { email: 'hod123@knowlab.com', password: 'hod123' },
};

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

  const handleRoleSelect = (role: DemoRole) => {
    const credentials = DEMO_CREDENTIALS[role];
    setPassword(credentials.password);
    setShowPassword(false);
    handleEmailChange(credentials.email);
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
        <div className="kl-page-enter flex items-center gap-3 mb-8">
          <div className="auth-logo-mark bg-[linear-gradient(180deg,#2c2c2c,#050505)] rounded-[22px] size-[52px] flex items-center justify-center flex-shrink-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_10px_24px_rgba(0,0,0,0.2)] dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.14),rgba(255,255,255,0.07))]">
            <span className="text-white font-bold text-[15px]">KL</span>
          </div>
          <div>
            <div className="text-[var(--text-primary)] font-bold text-[20px] leading-tight">Knowlab</div>
            <div className="text-[var(--text-secondary)] text-[13px]">Laboratory Knowledge Management</div>
          </div>
        </div>

        <div className="auth-card kl-page-enter bg-[var(--surface-card)] rounded-[32px] border border-[var(--surface-border)] shadow-xl p-8 sm:p-10 backdrop-blur-xl">
          {mode !== 'signin' && (
            <button
              onClick={() => {
                setMode('signin');
                setError('');
                setMessage('');
              }}
              className="kl-button-soft mb-4 inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-[var(--text-secondary)] text-[13px] hover:text-[var(--text-primary)] transition-colors"
            >
              <AppIcon name="arrowRight" size={14} className="rotate-180" /> Back to sign in
            </button>
          )}

          {mode === 'signin' && (
            <>
              <h1 className="auth-heading text-[var(--text-primary)] font-bold text-[28px] mb-1">Sign in to Knowlab</h1>
              <p className="auth-subheading text-[var(--text-secondary)] text-[14px] mb-6 leading-[1.5]">Secure workspace sign in with role-aware access.</p>
              <div className="role-tabs mb-6 flex gap-1 rounded-full bg-[var(--surface-base)] p-1">
                {(['Staff', 'Supervisor', 'HOD'] as DemoRole[]).map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleRoleSelect(role)}
                    className={`role-tab flex-1 rounded-full px-3 py-2 text-center text-[13px] font-medium transition-all duration-base ease-soft ${
                      visibleRole === role
                        ? 'bg-[var(--surface-card)] text-[var(--text-primary)] shadow-sm border border-[var(--surface-border)]'
                        : 'text-[var(--text-secondary)]'
                    }`}
                    aria-current={visibleRole === role ? 'true' : undefined}
                    aria-label={`Use ${role} demo account`}
                  >
                    {role}
                  </button>
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
                    className="input w-full h-[44px] rounded-full px-4 text-[15px]"
                  />
                </div>

                {detectedUser && (
                  <div className="kl-card bg-[var(--accent-glow)] border border-[var(--surface-border)] rounded-[24px] p-4 flex items-start gap-3">
                    <AppIcon name="tests" size={16} className="text-[var(--text-primary)] mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[var(--text-primary)] font-semibold text-[14px]">{detectedUser.unit}</p>
                      <p className="text-[var(--text-secondary)] text-[12px]">{detectedUser.name}</p>
                    </div>
                    <div className="bg-[var(--surface-card)] text-[var(--text-primary)] font-medium text-[11px] px-3 py-1 rounded-full flex-shrink-0 border border-[var(--surface-border)]">
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
                      className="input w-full h-[44px] rounded-full px-4 pr-12 text-[15px]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      className="kl-icon-button absolute right-2 top-1/2 flex size-8 min-h-8 min-w-8 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--surface-border)] bg-[var(--glass-bg)] text-[var(--text-tertiary)] backdrop-blur-sm transition-all hover:bg-[var(--surface-base)] hover:text-[var(--text-secondary)]"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      <AppIcon name={showPassword ? 'eyeSlash' : 'eye'} size={16} />
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-[var(--text-primary)] text-[12px] font-medium hover:underline"
                    onClick={() => setMode('forgot')}
                  >
                    Forgot password?
                  </button>
                </div>

                {error && (
                  <div className="flex items-center gap-2 bg-[rgba(255,59,48,0.12)] text-[var(--destructive)] text-[13px] rounded-[20px] px-4 py-3">
                    <AppIcon name="warning" size={14} />
                    {error}
                  </div>
                )}
                {message && (
                  <div className="flex items-center gap-2 bg-[rgba(52,199,89,0.12)] text-[var(--success)] text-[13px] rounded-[20px] px-4 py-3">
                    <AppIcon name="key" size={14} />
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full h-[48px] justify-center rounded-full px-4 text-[14px] font-semibold disabled:opacity-60 disabled:cursor-not-allowed mt-2"
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
                    className="input w-full h-[44px] rounded-full px-4 text-[14px]"
                  />
                </div>
                {message && (
                  <div className="flex items-center gap-2 bg-[#e8f8f1] dark:bg-[rgba(28,123,86,0.18)] text-[#1c7b56] dark:text-[#88e0ba] text-[13px] rounded-[12px] px-4 py-3">
                    <AppIcon name="key" size={14} />
                    {message}
                  </div>
                )}
                <button type="submit" className="btn-primary w-full h-[48px] rounded-full text-[14px] font-medium">
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
                    className="input w-full h-[44px] rounded-full px-4 text-[14px] text-[var(--text-secondary)]"
                  />
                </div>
                <div>
                  <label className="block text-[var(--kl-text)] font-medium text-[13px] mb-1.5">New password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="input w-full h-[44px] rounded-full px-4 text-[14px]"
                  />
                </div>
                <div>
                  <label className="block text-[var(--kl-text)] font-medium text-[13px] mb-1.5">Confirm password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                    className="input w-full h-[44px] rounded-full px-4 text-[14px]"
                  />
                </div>
                {error && (
                  <div className="flex items-center gap-2 bg-[#fde9e9] dark:bg-[rgba(177,67,67,0.18)] text-[#b14343] dark:text-[#fca5a5] text-[13px] rounded-[12px] px-4 py-3">
                    <AppIcon name="warning" size={14} />
                    {error}
                  </div>
                )}
                <button type="submit" className="btn-primary w-full h-[48px] rounded-full text-[14px] font-medium">
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
