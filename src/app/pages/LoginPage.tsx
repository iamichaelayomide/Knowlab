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
    <div className="min-h-screen bg-[var(--kl-bg)] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-[520px]">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-[var(--kl-primary)] rounded-[18px] size-[48px] flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-[15px]">LK</span>
          </div>
          <div>
            <div className="text-[var(--kl-text)] font-bold text-[20px] leading-tight">Knowlab</div>
            <div className="text-[var(--kl-text-muted)] text-[13px]">Laboratory Knowledge Management</div>
          </div>
        </div>

        <div className="bg-[var(--kl-surface)] rounded-[24px] border border-[var(--kl-border)] shadow-[var(--kl-shadow)] p-5 sm:p-8">
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
              <h1 className="text-[var(--kl-text)] font-semibold text-[26px] mb-1">Sign in to continue.</h1>
              <p className="text-[var(--kl-text-muted)] text-[14px] mb-6">Secure workspace sign in with role-aware access.</p>
              <form onSubmit={handleSignIn} className="space-y-4">
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

                {detectedUser && (
                  <div className="bg-[var(--kl-surface-tinted)] border border-[var(--kl-border)] rounded-[18px] p-4 flex items-start gap-3">
                    <FlaskConical size={16} className="text-[var(--kl-primary)] mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[var(--kl-text)] font-semibold text-[14px]">{detectedUser.unit}</p>
                      <p className="text-[var(--kl-text-muted)] text-[12px]">{detectedUser.name}</p>
                    </div>
                    <div className="bg-[var(--kl-surface)] text-[var(--kl-primary)] font-medium text-[11px] px-3 py-1 rounded-full flex-shrink-0 border border-[var(--kl-border)]">
                      {detectedUser.role}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[var(--kl-text)] font-medium text-[13px] mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => { setPassword(e.target.value); setError(''); }}
                      placeholder="Enter your password"
                      required
                      className="w-full bg-[var(--kl-surface)] border border-[var(--kl-border)] rounded-[14px] px-4 py-3.5 text-[14px] text-[var(--kl-text)] placeholder:text-[var(--kl-text-muted)] focus:outline-none focus:border-[var(--kl-primary)] focus:ring-2 focus:ring-[var(--kl-primary)]/10 transition-all pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--kl-text-muted)] hover:text-[var(--kl-text)]"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-[var(--kl-primary)] text-[12px] font-medium hover:underline"
                    onClick={() => setMode('forgot')}
                  >
                    Forgot password?
                  </button>
                </div>

                {error && (
                  <div className="flex items-center gap-2 bg-[#fde9e9] text-[#b14343] text-[13px] rounded-[12px] px-4 py-3">
                    <AlertCircle size={14} />
                    {error}
                  </div>
                )}
                {message && (
                  <div className="flex items-center gap-2 bg-[#e8f8f1] text-[#1c7b56] text-[13px] rounded-[12px] px-4 py-3">
                    <KeyRound size={14} />
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[var(--kl-primary)] hover:bg-[var(--kl-primary-hover)] text-white font-medium text-[14px] py-4 rounded-[16px] transition-colors shadow-[0px_8px_20px_0px_rgba(28,94,255,0.24)] disabled:opacity-60 disabled:cursor-not-allowed mt-2"
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
                  <div className="flex items-center gap-2 bg-[#e8f8f1] text-[#1c7b56] text-[13px] rounded-[12px] px-4 py-3">
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
                  <div className="flex items-center gap-2 bg-[#fde9e9] text-[#b14343] text-[13px] rounded-[12px] px-4 py-3">
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

