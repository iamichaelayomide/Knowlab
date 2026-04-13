import { useState } from 'react';
import { Bell, AlertTriangle, Info, CheckCircle2, X } from 'lucide-react';
import { ALERTS, Alert } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { getWorkflowState, markNotificationRead } from '../../services/workflowStore';

const TYPE_CONFIG = {
  danger: { icon: <AlertTriangle size={15} />, color: 'text-[#b14343]', bg: 'bg-[#fde9e9]', border: 'border-[#f5c0c0]' },
  warning: { icon: <AlertTriangle size={15} />, color: 'text-[#9a6115]', bg: 'bg-[#fff0db]', border: 'border-[#f5d99a]' },
  info: { icon: <Info size={15} />, color: 'text-[#1c5eff]', bg: 'bg-[#e3edff]', border: 'border-[#bdd3ff]' },
  success: { icon: <CheckCircle2 size={15} />, color: 'text-[#1c7b56]', bg: 'bg-[#e8f8f1]', border: 'border-[#a3d9c0]' },
};

export default function AlertsPage() {
  const { user } = useAuth();
  const [readIds, setReadIds] = useState<Set<string>>(new Set(ALERTS.filter(a => a.read).map(a => a.id)));
  const [filter, setFilter] = useState<'all' | 'unread' | 'danger' | 'warning' | 'info' | 'success'>('all');

  if (!user) return null;

  const workflow = getWorkflowState();
  const workflowAlerts: Alert[] = workflow.notifications
    .filter(n => n.roleTargets.includes(user.role))
    .map(n => ({
      id: n.id,
      type: n.level,
      title: n.title,
      message: n.message,
      date: n.createdAt,
      read: n.readBy.includes(user.id),
      targetRoles: n.roleTargets,
      category: 'Workflow',
    }));
  const myAlerts = [...workflowAlerts, ...ALERTS.filter(a => a.targetRoles.includes(user.role))]
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));
  const unreadCount = myAlerts.filter(a => !readIds.has(a.id)).length;

  const filtered = myAlerts.filter(a => {
    if (filter === 'unread') return !readIds.has(a.id);
    if (filter !== 'all') return a.type === filter;
    return true;
  });

  const markRead = (id: string) => {
    setReadIds(prev => new Set([...prev, id]));
    markNotificationRead(id, user.id);
  };
  const markAllRead = () => {
    setReadIds(new Set(myAlerts.map(a => a.id)));
    myAlerts.forEach(a => markNotificationRead(a.id, user.id));
  };

  return (
    <div className="p-4 sm:p-6 max-w-[800px]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[#11203b] font-semibold text-[24px] mb-1">Alerts</h1>
          <p className="text-[#73839f] text-[14px]">
            {unreadCount > 0 ? `${unreadCount} unread alert${unreadCount > 1 ? 's' : ''}` : 'All caught up'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="text-[#1c5eff] text-[13px] font-medium hover:underline"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap mb-5">
        {[
          { key: 'all', label: 'All' },
          { key: 'unread', label: `Unread (${unreadCount})` },
          { key: 'danger', label: 'Critical' },
          { key: 'warning', label: 'Warnings' },
          { key: 'info', label: 'Info' },
          { key: 'success', label: 'Updates' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key as any)}
            className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors border ${
              filter === key
                ? 'bg-[#e3edff] text-[#1c5eff] border-[#1c5eff]'
                : 'bg-white text-[#475a7d] border-[#d3def5] hover:border-[#9bb3e5]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="bg-white rounded-[20px] border border-[#d3def5] p-8 text-center">
            <Bell size={32} className="text-[#c4d2ef] mx-auto mb-3" />
            <p className="text-[#475a7d] font-medium">No alerts</p>
            <p className="text-[#73839f] text-[13px]">Check back later</p>
          </div>
        )}
        {filtered.map(alert => {
          const isRead = readIds.has(alert.id);
          const config = TYPE_CONFIG[alert.type];
          return (
            <div
              key={alert.id}
              className={`bg-white rounded-[18px] border p-5 transition-all ${
                !isRead ? 'border-l-4 shadow-[0px_4px_12px_0px_rgba(15,40,90,0.06)]' : 'border-[#d3def5]'
              } ${!isRead ? `border-l-[${alert.type === 'danger' ? '#b14343' : alert.type === 'warning' ? '#9a6115' : alert.type === 'success' ? '#1c7b56' : '#1c5eff'}]` : ''}`}
              style={!isRead ? { borderLeftColor: alert.type === 'danger' ? '#b14343' : alert.type === 'warning' ? '#9a6115' : alert.type === 'success' ? '#1c7b56' : '#1c5eff' } : {}}
            >
              <div className="flex items-start gap-3">
                <div className={`rounded-[10px] p-2 flex-shrink-0 ${config.bg}`}>
                  <span className={config.color}>{config.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className={`font-semibold text-[14px] leading-snug ${isRead ? 'text-[#475a7d]' : 'text-[#11203b]'}`}>{alert.title}</h3>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${config.bg} ${config.color}`}>{alert.category}</span>
                      {!isRead && (
                        <button
                          onClick={() => markRead(alert.id)}
                          className="text-[#73839f] hover:text-[#475a7d] p-0.5"
                          title="Mark as read"
                        >
                          <X size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-[#475a7d] text-[13px] leading-relaxed">{alert.message}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[#73839f] text-[11px]">
                      {new Date(alert.date).toLocaleDateString('en-GB', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })} at {new Date(alert.date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {!isRead && (
                      <span className="w-2 h-2 bg-[#1c5eff] rounded-full" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
