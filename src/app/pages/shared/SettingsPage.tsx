import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Settings, User, Bell, Shield, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState({
    criticalValues: true,
    qcAlerts: true,
    trainingReminders: true,
    capaUpdates: true,
    documentUpdates: false,
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleLabel = user?.role === 'staff' ? 'Lab Scientist' : user?.role === 'supervisor' ? 'Unit Supervisor' : 'Head of Department';

  return (
    <div className="p-6 max-w-[700px]">
      <div className="mb-6">
        <h1 className="text-[#11203b] font-semibold text-[24px] mb-1">Settings</h1>
        <p className="text-[#73839f] text-[14px]">Manage your workspace preferences</p>
      </div>

      {/* Profile */}
      <div className="bg-white rounded-[24px] border border-[#d3def5] shadow-[0px_6px_18px_0px_rgba(15,40,90,0.05)] p-6 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <User size={16} className="text-[#1c5eff]" />
          <h2 className="text-[#11203b] font-semibold text-[16px]">Profile</h2>
        </div>
        <div className="flex items-center gap-4">
          <div
            className="size-[56px] rounded-full flex items-center justify-center text-white font-bold text-[18px] flex-shrink-0"
            style={{ backgroundColor: user?.color }}
          >
            {user?.initials}
          </div>
          <div>
            <p className="text-[#11203b] font-semibold text-[17px]">{user?.name}</p>
            <p className="text-[#73839f] text-[13px]">{roleLabel} · {user?.unit}</p>
            <p className="text-[#73839f] text-[12px]">{user?.email}</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="bg-[#f4f8ff] rounded-[12px] px-3 py-2">
            <p className="text-[#73839f] text-[10px] font-semibold uppercase tracking-[0.8px] mb-0.5">Department</p>
            <p className="text-[#11203b] font-medium text-[13px]">{user?.department}</p>
          </div>
          <div className="bg-[#f4f8ff] rounded-[12px] px-3 py-2">
            <p className="text-[#73839f] text-[10px] font-semibold uppercase tracking-[0.8px] mb-0.5">Joined</p>
            <p className="text-[#11203b] font-medium text-[13px]">
              {user?.joinDate ? new Date(user.joinDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-[24px] border border-[#d3def5] p-6 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <Bell size={16} className="text-[#1c5eff]" />
          <h2 className="text-[#11203b] font-semibold text-[16px]">Notification Preferences</h2>
        </div>
        <div className="space-y-3">
          {Object.entries({
            criticalValues: 'Critical Value Notifications',
            qcAlerts: 'QC Failure & Warning Alerts',
            trainingReminders: 'Training Due Date Reminders',
            capaUpdates: 'CAPA Status Updates',
            documentUpdates: 'Document Approval Notifications',
          }).map(([key, label]) => (
            <div key={key} className="flex items-center justify-between py-2 border-b border-[#f4f8ff] last:border-0">
              <div>
                <p className="text-[#11203b] font-medium text-[13px]">{label}</p>
              </div>
              <button
                onClick={() => setNotifications(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  notifications[key as keyof typeof notifications] ? 'bg-[#1c5eff]' : 'bg-[#d3def5]'
                }`}
              >
                <div className={`absolute top-0.5 size-4 bg-white rounded-full shadow transition-transform ${
                  notifications[key as keyof typeof notifications] ? 'translate-x-5' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className="bg-white rounded-[24px] border border-[#d3def5] p-6 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <Shield size={16} className="text-[#1c5eff]" />
          <h2 className="text-[#11203b] font-semibold text-[16px]">Security</h2>
        </div>
        <button className="w-full text-left flex items-center justify-between py-3 border-b border-[#f4f8ff] hover:bg-[#f9fbff] rounded-[10px] px-2 -mx-2 transition-colors">
          <div>
            <p className="text-[#11203b] font-medium text-[13px]">Change Password</p>
            <p className="text-[#73839f] text-[12px]">Update your account password</p>
          </div>
          <span className="text-[#1c5eff] text-[13px] font-medium">Change →</span>
        </button>
        <button className="w-full text-left flex items-center justify-between py-3 hover:bg-[#f9fbff] rounded-[10px] px-2 -mx-2 transition-colors">
          <div>
            <p className="text-[#11203b] font-medium text-[13px]">Active Sessions</p>
            <p className="text-[#73839f] text-[12px]">1 active session (this device)</p>
          </div>
          <span className="text-[#1c5eff] text-[13px] font-medium">View →</span>
        </button>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full bg-[#fde9e9] text-[#b14343] font-semibold text-[14px] py-4 rounded-[18px] hover:bg-[#f5c0c0] transition-colors flex items-center justify-center gap-2"
      >
        <LogOut size={16} />
        Sign out of Knowlab
      </button>
    </div>
  );
}
