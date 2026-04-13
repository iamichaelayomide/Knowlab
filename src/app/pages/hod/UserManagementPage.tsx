import { useMemo, useState } from 'react';
import { CheckCircle2, UserPlus, XCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { createUserByHod, decideUserRequest, getWorkflowState } from '../../services/workflowStore';
import type { UserRole } from '../../types/workflow';

export default function UserManagementPage() {
  const { user } = useAuth();
  const [refreshToken, setRefreshToken] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [unit, setUnit] = useState('');
  const [role, setRole] = useState<UserRole>('staff');
  const [notesByReq, setNotesByReq] = useState<Record<string, string>>({});

  const pendingRequests = useMemo(
    () => getWorkflowState().userRequests.filter(r => r.decision === 'pending'),
    [refreshToken]
  );
  const createdOrDecided = useMemo(
    () => getWorkflowState().userRequests.filter(r => r.decision !== 'pending').slice(0, 10),
    [refreshToken]
  );

  if (!user) return null;

  const directCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createUserByHod({
      hod: user,
      requestedUserName: name,
      requestedUserEmail: email,
      requestedUserRole: role,
      requestedUnit: unit,
    });
    setName('');
    setEmail('');
    setUnit('');
    setRole('staff');
    setRefreshToken(prev => prev + 1);
  };

  const handleDecision = (requestId: string, decision: 'approved' | 'rejected') => {
    decideUserRequest({
      requestId,
      hod: user,
      decision,
      notes: notesByReq[requestId] ?? '',
    });
    setRefreshToken(prev => prev + 1);
  };

  return (
    <div className="p-4 sm:p-6 max-w-[1080px]">
      <div className="mb-5">
        <h1 className="text-[#11203b] text-[24px] font-semibold mb-1">HOD User Management</h1>
        <p className="text-[#73839f] text-[13px]">
          HOD can create users directly and approve/reject supervisor user requests.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-white border border-[#d3def5] rounded-[18px] p-4 sm:p-5">
          <h2 className="text-[#11203b] font-semibold text-[16px] mb-3">Create User (HOD direct)</h2>
          <form onSubmit={directCreate} className="space-y-3">
            <input value={name} onChange={e => setName(e.target.value)} required placeholder="Full name" className="w-full border border-[#d3def5] rounded-[12px] px-3 py-2 text-[13px]" />
            <input value={email} onChange={e => setEmail(e.target.value)} required type="email" placeholder="Email" className="w-full border border-[#d3def5] rounded-[12px] px-3 py-2 text-[13px]" />
            <input value={unit} onChange={e => setUnit(e.target.value)} required placeholder="Unit" className="w-full border border-[#d3def5] rounded-[12px] px-3 py-2 text-[13px]" />
            <select value={role} onChange={e => setRole(e.target.value as UserRole)} className="w-full border border-[#d3def5] rounded-[12px] px-3 py-2 text-[13px]">
              <option value="staff">Staff</option>
              <option value="supervisor">Supervisor</option>
              <option value="hod">HOD</option>
            </select>
            <button type="submit" className="inline-flex items-center gap-1.5 bg-[#1c5eff] text-white rounded-[10px] px-3 py-2 text-[12px]">
              <UserPlus size={13} /> Create user
            </button>
          </form>
        </div>

        <div className="bg-white border border-[#d3def5] rounded-[18px] p-4 sm:p-5">
          <h2 className="text-[#11203b] font-semibold text-[16px] mb-3">Supervisor Requests Pending Approval</h2>
          <div className="space-y-3 max-h-[380px] overflow-auto pr-1">
            {pendingRequests.length === 0 && (
              <p className="text-[#73839f] text-[13px]">No pending user requests.</p>
            )}
            {pendingRequests.map(req => (
              <div key={req.id} className="border border-[#e3edff] rounded-[12px] p-3">
                <p className="text-[#11203b] text-[13px] font-medium">{req.requestedUserName} ({req.requestedUserEmail})</p>
                <p className="text-[#73839f] text-[11px] mb-2">
                  {req.requestedUnit} · {req.requestedUserRole} · requested by {req.requesterName}
                </p>
                <textarea
                  rows={2}
                  value={notesByReq[req.id] ?? ''}
                  onChange={e => setNotesByReq(prev => ({ ...prev, [req.id]: e.target.value }))}
                  placeholder="Decision notes…"
                  className="w-full border border-[#d3def5] rounded-[10px] px-2.5 py-2 text-[12px]"
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleDecision(req.id, 'approved')}
                    className="inline-flex items-center gap-1 text-[12px] rounded-[10px] px-2.5 py-1.5 bg-[#e8f8f1] text-[#1c7b56]"
                  >
                    <CheckCircle2 size={12} /> Approve
                  </button>
                  <button
                    onClick={() => handleDecision(req.id, 'rejected')}
                    className="inline-flex items-center gap-1 text-[12px] rounded-[10px] px-2.5 py-1.5 bg-[#fde9e9] text-[#b14343]"
                  >
                    <XCircle size={12} /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#d3def5] rounded-[18px] p-4 sm:p-5 mt-5">
        <h2 className="text-[#11203b] font-semibold text-[16px] mb-3">Recent User Decisions</h2>
        <div className="space-y-2">
          {createdOrDecided.map(req => (
            <div key={req.id} className="border border-[#e3edff] rounded-[10px] p-2.5 flex items-center justify-between">
              <div>
                <p className="text-[#11203b] text-[12px] font-medium">{req.requestedUserEmail}</p>
                <p className="text-[#73839f] text-[10px]">{req.requestedUserRole} · {req.requestedUnit}</p>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                req.decision === 'approved' ? 'bg-[#e8f8f1] text-[#1c7b56]' : 'bg-[#fde9e9] text-[#b14343]'
              }`}>
                {req.decision}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

