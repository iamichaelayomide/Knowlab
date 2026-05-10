import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Eye, EyeOff, FlaskConical, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getUserByEmail } from '../data/mockData';

const DEMO_USERS = [
  { email: 'adaeze@knowlab.ng', password: 'staff123', role: 'Staff', name: 'Adaeze Nwosu', unit: 'Haematology · FBC Bench', color: '#b91c1c', initials: 'AN' },
  { email: 'emeka.eze@knowlab.ng', password: 'staff123', role: 'Staff', name: 'Chukwuemeka Eze', unit: 'Chemistry · LFT Bench', color: '#0284c7', initials: 'CE' },
  { email: 'ibrahim@knowlab.ng', password: 'staff123', role: 'Staff', name: 'Ibrahim Suleiman', unit: 'Microbiology · Bacteriology', color: '#15803d', initials: 'IS' },
  { email: 'chisom@knowlab.ng', password: 'staff123', role: 'Staff', name: 'Chisom Nwachukwu', unit: 'Histopathology · Cytology', color: '#7c3aed', initials: 'CN' },
  { email: 'tunde@knowlab.ng', password: 'staff123', role: 'Staff', name: 'Tunde Abiodun', unit: 'BGS · ABO/Rh Grouping', color: '#b45309', initials: 'TA' },
  { email: 'fatima@knowlab.ng', password: 'super123', role: 'Supervisor', name: 'Fatima Bello', unit: 'Haematology Supervisor', color: '#1d4ed8', initials: 'FB' },
  { email: 'seun@knowlab.ng', password: 'super123', role: 'Supervisor', name: 'Dr. Seun Adebayo', unit: 'Chemistry Supervisor', color: '#0369a1', initials: 'SA' },
  { email: 'ngozi@knowlab.ng', password: 'hod123', role: 'HOD', name: 'Dr. Ngozi Adeyemi', unit: 'Head of Department', color: '#dc2626', initials: 'NA' },
];

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [detectedUser, setDetectedUser] = useState<null | { name: string; unit: string; role: string }>(null);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);
    setError('');
    // Workspace detection
    if (val.includes('@')) {
      const found = getUserByEmail(val);
      if (found) {
        const roleLabel = found.role === 'staff' ? 'Staff' : found.role === 'supervisor' ? 'Unit Supervisor' : 'Head of Department';
        setDetectedUser({ name: found.name, unit: found.unit, role: roleLabel });
      } else {
        setDetectedUser(null);
      }
    } else {
      setDetectedUser(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    setTimeout(() => {
      const result = login(email, password);
      if (result.success) {
        const user = getUserByEmail(email)!;
        if (user.role === 'staff') navigate('/staff/dashboard');
        else if (user.role === 'supervisor') navigate('/supervisor/dashboard');
        else navigate('/hod/dashboard');
      } else {
        setError(result.error || 'Login failed.');
        setIsLoading(false);
      }
    }, 600);
  };

  const fillDemo = (demo: typeof DEMO_USERS[0]) => {
    setEmail(demo.email);
    setPassword(demo.password);
    setDetectedUser({ name: demo.name, unit: demo.unit, role: demo.role });
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#eef4ff] flex items-center justify-center p-4">
      <div className="w-full max-w-[480px]">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-[#1c5eff] rounded-[18px] size-[48px] flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-[15px]">LK</span>
          </div>
          <div>
            <div className="text-[#11203b] font-bold text-[20px] leading-tight">Knowlab</div>
            <div className="text-[#73839f] text-[13px]">Laboratory Knowledge Management</div>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-[28px] border border-[#d3def5] shadow-[0px_12px_30px_0px_rgba(15,40,90,0.08)] p-8">
          <h1 className="text-[#11203b] font-semibold text-[26px] mb-1">Sign in to continue.</h1>
          <p className="text-[#73839f] text-[14px] mb-6">Secure workspace sign in — your bench context loads automatically.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-[#11203b] font-medium text-[13px] mb-1.5">Work email</label>
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="you@knowlab.ng"
                required
                className="w-full bg-white border border-[#d3def5] rounded-[14px] px-4 py-3.5 text-[14px] text-[#11203b] placeholder:text-[#73839f] focus:outline-none focus:border-[#1c5eff] focus:ring-2 focus:ring-[#1c5eff]/10 transition-all"
              />
            </div>

            {/* Workspace detected */}
            {detectedUser && (
              <div className="bg-[#eef5ff] border border-[#bdd3ff] rounded-[18px] p-4 flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-[#1c5eff] font-semibold text-[10px] tracking-[1.5px] uppercase mb-0.5">Workspace Detected</p>
                  <p className="text-[#11203b] font-semibold text-[14px]">{detectedUser.unit}</p>
                  <p className="text-[#73839f] text-[12px]">{detectedUser.name}</p>
                </div>
                <div className="bg-[#e8f0ff] text-[#1a56db] font-medium text-[11px] px-3 py-1 rounded-full flex-shrink-0">
                  {detectedUser.role}
                </div>
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-[#11203b] font-medium text-[13px] mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  placeholder="Enter your password"
                  required
                  className="w-full bg-white border border-[#d3def5] rounded-[14px] px-4 py-3.5 text-[14px] text-[#11203b] placeholder:text-[#73839f] focus:outline-none focus:border-[#1c5eff] focus:ring-2 focus:ring-[#1c5eff]/10 transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#73839f] hover:text-[#475a7d]"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 bg-[#fde9e9] text-[#b14343] text-[13px] rounded-[12px] px-4 py-3">
                <AlertCircle size={14} />
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1c5eff] hover:bg-[#1548e8] text-white font-medium text-[14px] py-4 rounded-[16px] transition-colors shadow-[0px_8px_20px_0px_rgba(28,94,255,0.24)] disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? 'Signing in…' : 'Sign in to Knowlab'}
            </button>
          </form>
        </div>

        {/* Demo Accounts */}
        <div className="mt-6">
          <p className="text-[#73839f] text-[12px] font-medium text-center mb-3 tracking-[0.8px] uppercase">Demo Accounts — Click to fill</p>
          <div className="space-y-1.5 max-h-[320px] overflow-y-auto pr-1">
            {DEMO_USERS.map(demo => (
              <button
                key={demo.email}
                onClick={() => fillDemo(demo)}
                className="w-full bg-white border border-[#d3def5] rounded-[16px] px-4 py-3 flex items-center gap-3 hover:border-[#1c5eff] hover:bg-[#f4f8ff] transition-all text-left group"
              >
                <div
                  className="rounded-full size-[34px] flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0"
                  style={{ backgroundColor: demo.color }}
                >
                  {demo.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[#11203b] font-semibold text-[12px]">{demo.name}</div>
                  <div className="text-[#73839f] text-[10px] truncate">{demo.unit}</div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span
                    className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: demo.role === 'HOD' ? '#fde9e9' : demo.role === 'Supervisor' ? '#e3edff' : '#ecfdf5',
                      color: demo.role === 'HOD' ? '#b14343' : demo.role === 'Supervisor' ? '#1c5eff' : '#15803d',
                    }}
                  >
                    {demo.role}
                  </span>
                  <span className="text-[#73839f] text-[10px] font-mono">{demo.password}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[#73839f] text-[11px] mt-6">
          Knowlab — Hospital Laboratory Knowledge Management Platform
        </p>
      </div>
    </div>
  );
}
