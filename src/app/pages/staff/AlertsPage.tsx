import { useState } from 'react';
import { Notification as Bell, Warning2 as AlertTriangle, InfoCircle as Info, TickCircle as CheckCircle2, CloseCircle as X } from 'iconsax-react';
import { ALERTS, Alert } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { getWorkflowState, markNotificationRead } from '../../services/workflowStore';

const TYPE_CONFIG = {
  danger: { icon: <AlertTriangle size={15} />, color: 'text-[#b14343] dark:text-[#fca5a5]', bg: 'bg-[#fde9e9] dark:bg-[rgba(177,67,67,0.18)]', border: 'border-[#f5c0c0]' },
  warning: { icon: <AlertTriangle size={15} />, color: 'text-[#9a6115] dark:text-[#f3c26f]', bg: 'bg-[#fff0db] dark:bg-[rgba(154,97,21,0.18)]', border: 'border-[#f5d99a] dark:border-[rgba(245,217,154,0.25)]' },
  info: { icon: <Info size={15} />, color: 'text-[var(--text-primary)]', bg: 'bg-[var(--kl-surface-tinted)]', border: 'border-[var(--surface-border-strong)]' },
  success: { icon: <CheckCircle2 size={15} />, color: 'text-[#1c7b56] dark:text-[#88e0ba]', bg: 'bg-[#e8f8f1] dark:bg-[rgba(28,123,86,0.18)]', border: 'border-[#a3d9c0]' },
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
    <div className="kl-page">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[var(--kl-text)] font-semibold text-[24px] mb-1">Alerts</h1>
          <p className="text-[var(--kl-text-muted)] text-[14px]">
            {unreadCount > 0 ? `${unreadCount} unread alert${unreadCount > 1 ? 's' : ''}` : 'All caught up'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="text-[var(--text-primary)] text-[13px] font-medium hover:underline"
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
                ? 'bg-[var(--kl-surface-tinted)] text-[var(--text-primary)] border-[var(--surface-border-strong)]'
                : 'bg-[var(--kl-surface)] text-[var(--kl-text-muted)] border-[var(--kl-border)] hover:border-[var(--kl-primary)]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="bg-[var(--kl-surface)] rounded-[20px] border border-[var(--kl-border)] p-8 text-center">
                    <Bell size={32} className="text-[var(--text-tertiary)] mx-auto mb-3" />
            <p className="text-[var(--kl-text-muted)] font-medium">No alerts</p>
            <p className="text-[var(--kl-text-muted)] text-[13px]">Check back later</p>
          </div>
        )}
        {filtered.map(alert => {
          const isRead = readIds.has(alert.id);
          const config = TYPE_CONFIG[alert.type];
          return (
            <div
              key={alert.id}
              className={`bg-[var(--kl-surface)] rounded-[18px] border p-5 transition-all ${
                !isRead ? 'border-l-4 shadow-[0px_4px_12px_0px_rgba(15,40,90,0.06)]' : 'border-[var(--kl-border)]'
              } ${!isRead ? `border-l-[${alert.type === 'danger' ? '#b14343' : alert.type === 'warning' ? '#9a6115' : alert.type === 'success' ? '#1c7b56' : 'var(--text-primary)'}]` : ''}`}
              style={!isRead ? { borderLeftColor: alert.type === 'danger' ? '#b14343' : alert.type === 'warning' ? '#9a6115' : alert.type === 'success' ? '#1c7b56' : 'var(--text-primary)' } : {}}
            >
              <div className="flex items-start gap-3">
                <div className={`rounded-[10px] p-2 flex-shrink-0 ${config.bg}`}>
                  <span className={config.color}>{config.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className={`font-semibold text-[14px] leading-snug ${isRead ? 'text-[var(--kl-text-muted)]' : 'text-[var(--kl-text)]'}`}>{alert.title}</h3>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${config.bg} ${config.color}`}>{alert.category}</span>
                      {!isRead && (
                        <button
                          onClick={() => markRead(alert.id)}
                          className="text-[var(--kl-text-muted)] hover:text-[var(--kl-text-muted)] p-0.5"
                          title="Mark as read"
                        >
                          <X size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-[var(--kl-text-muted)] text-[13px] leading-relaxed">{alert.message}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[var(--kl-text-muted)] text-[11px]">
                      {new Date(alert.date).toLocaleDateString('en-GB', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })} at {new Date(alert.date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {!isRead && (
                      <span className="w-2 h-2 bg-[var(--text-primary)] rounded-full" />
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
