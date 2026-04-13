import { useMemo, useState } from 'react';
import { Send } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { createUserRequest, getWorkflowState } from '../../services/workflowStore';
import type { UserRole } from '../../types/workflow';

export default function UserRequestPage() {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [unit, setUnit] = useState(user?.unit ?? '');
  const [role, setRole] = useState<UserRole>('staff');
  const [refreshToken, setRefreshToken] = useState(0);

  const requests = useMemo(
    () => getWorkflowState().userRequests.filter(r => r.requesterId === user?.id),
    [refreshToken, user?.id]
  );

  if (!user) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    createUserRequest({
      requester: user,
      requestedUserName: name,
      requestedUserEmail: email,
      requestedUserRole: role,
      requestedUnit: unit,
    });
    setName('');
    setEmail('');
    setUnit(user.unit);
    setRole('staff');
    setRefreshToken(prev => prev + 1);
  };

  return (
    <div className="p-4 sm:p-6 max-w-[920px]">
      <div className="mb-5">
        <h1 className="text-[#11203b] text-[24px] font-semibold mb-1">Supervisor User Requests</h1>
        <p className="text-[#73839f] text-[13px]">Supervisors can request account creation. HOD approval is required.</p>
      </div>

      <form onSubmit={submit} className="bg-white border border-[#d3def5] rounded-[18px] p-4 sm:p-5 mb-5">
        <div className="grid sm:grid-cols-2 gap-3">
          <input value={name} onChange={e => setName(e.target.value)} required placeholder="Full name" className="border border-[#d3def5] rounded-[12px] px-3 py-2 text-[13px]" />
          <input value={email} onChange={e => setEmail(e.target.value)} required type="email" placeholder="Email" className="border border-[#d3def5] rounded-[12px] px-3 py-2 text-[13px]" />
          <input value={unit} onChange={e => setUnit(e.target.value)} required placeholder="Unit" className="border border-[#d3def5] rounded-[12px] px-3 py-2 text-[13px]" />
          <select value={role} onChange={e => setRole(e.target.value as UserRole)} className="border border-[#d3def5] rounded-[12px] px-3 py-2 text-[13px]">
            <option value="staff">Staff</option>
            <option value="supervisor">Supervisor</option>
          </select>
        </div>
        <button type="submit" className="mt-3 inline-flex items-center gap-1.5 bg-[#1c5eff] text-white rounded-[10px] px-3 py-2 text-[12px]">
          <Send size={13} /> Submit request
        </button>
      </form>

      <div className="space-y-2">
        {requests.map(req => (
          <div key={req.id} className="bg-white border border-[#d3def5] rounded-[14px] p-3 flex flex-wrap items-center gap-2 justify-between">
            <div>
              <p className="text-[#11203b] text-[13px] font-medium">{req.requestedUserName} ({req.requestedUserEmail})</p>
              <p className="text-[#73839f] text-[11px]">{req.requestedUnit} · {req.requestedUserRole}</p>
            </div>
            <span className={`text-[11px] px-2 py-0.5 rounded-full ${
              req.decision === 'approved' ? 'bg-[#e8f8f1] text-[#1c7b56]' :
              req.decision === 'rejected' ? 'bg-[#fde9e9] text-[#b14343]' :
              'bg-[#eef5ff] text-[#1c5eff]'
            }`}>
              {req.decision}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

