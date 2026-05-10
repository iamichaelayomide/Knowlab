import { useNavigate } from 'react-router';
import { Activity, AlertTriangle, BarChart3, Clock3, TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { useDepartment } from '../../context/DepartmentContext';
import { ALERTS, CAPA_ITEMS, QC_LOGS, TRAINING_RECORDS, TRAINING_MODULES, USERS, getStaffUsers } from '../../data/mockData';
import { EmptyState } from '../../components/ui/empty-state';
import { isDepartmentVisible } from '../../services/dataScope';

export default function HODDashboard() {
  const { user } = useAuth();
  const { activeDepartment } = useDepartment();
  const navigate = useNavigate();

  const scopedStaff = getStaffUsers().filter(staff => isDepartmentVisible(user, `${staff.department} ${staff.unit}`));
  const scopedQcLogs = QC_LOGS.filter(log => {
    const staff = USERS.find(u => u.id === log.staffId);
    return isDepartmentVisible(user, `${staff?.department ?? ''} ${staff?.unit ?? ''}`);
  });
  const scopedTraining = TRAINING_RECORDS.filter(record => {
    const staff = USERS.find(u => u.id === record.staffId);
    return isDepartmentVisible(user, `${staff?.department ?? ''} ${staff?.unit ?? ''}`);
  });
  const scopedCapas = CAPA_ITEMS.filter(capa => isDepartmentVisible(user, capa.title));
  const scopedAlerts = ALERTS.filter(alert => alert.targetRoles.includes('hod'));

  const openCAPAs = scopedCapas.filter(c => c.status !== 'completed');
  const completedTraining = scopedTraining.filter(r => r.status === 'completed').length;
  const totalTraining = Math.max(scopedStaff.length * TRAINING_MODULES.length, 1);
  const trainingCompliance = Math.round((completedTraining / totalTraining) * 100);
  const qcPassed = scopedQcLogs.filter(q => q.overallStatus === 'passed').length;
  const qcTotal = scopedQcLogs.length || 1;
  const qcRate = Math.round((qcPassed / qcTotal) * 100);

  const testsByDepartment = ['Haematology', 'Chemistry', 'Microbiology', 'Histopathology', 'Blood Group & Serology'].map(dept => ({
    department: dept,
    tests: scopedQcLogs.filter(log => {
      const staff = USERS.find(u => u.id === log.staffId);
      return `${staff?.department ?? ''}`.toLowerCase().includes(dept.toLowerCase().split(' ')[0]);
    }).length,
  })).filter(row => row.tests > 0);

  const pendingVsValidated = [
    { name: 'Pending', value: scopedQcLogs.filter(log => !log.supervisorReviewed).length },
    { name: 'Validated', value: scopedQcLogs.filter(log => log.supervisorReviewed).length },
  ];

  const monthlyVolumes = [
    { month: 'Jan', volume: 34 },
    { month: 'Feb', volume: 41 },
    { month: 'Mar', volume: 38 },
    { month: 'Apr', volume: 47 },
    { month: 'May', volume: 52 },
  ];

  return (
    <div className="app-container mx-auto max-w-7xl">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Department Overview</h1>
          <p className="text-sm text-muted-foreground">{activeDepartment.name} analytics scoped to your permissions.</p>
        </div>
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Volume', value: scopedQcLogs.length, sub: 'Tests this month', icon: <BarChart3 size={16} /> },
          { label: 'Accuracy', value: `${qcRate}%`, sub: 'Validated QC pass rate', icon: <Activity size={16} /> },
          { label: 'Turnaround', value: '92 min', sub: 'Median completion time', icon: <Clock3 size={16} /> },
          { label: 'Staff Efficiency', value: `${trainingCompliance}%`, sub: `${scopedStaff.length} active staff`, icon: <TrendingUp size={16} /> },
        ].map(card => (
          <div key={card.label} className="rounded-lg border border-border bg-card p-4">
            <div className="mb-2 flex items-center justify-between text-muted-foreground">
              <span className="text-sm">{card.label}</span>
              {card.icon}
            </div>
            <p className="text-2xl font-bold text-foreground">{card.value}</p>
            <p className="text-xs text-muted-foreground">{card.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-4 xl:col-span-1">
          <h2 className="mb-3 text-base font-semibold text-foreground">Tests by Department</h2>
          {testsByDepartment.length === 0 ? (
            <EmptyState title="No departmental tests yet" description="Tests will appear here once QC logs are available." />
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={testsByDepartment}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="department" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="tests" fill="var(--color-primary)" radius={6} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="rounded-lg border border-border bg-card p-4 xl:col-span-1">
          <h2 className="mb-3 text-base font-semibold text-foreground">Pending vs Validated</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pendingVsValidated} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80}>
                  <Cell fill="var(--color-chart-4)" />
                  <Cell fill="var(--color-chart-2)" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-4 xl:col-span-1">
          <h2 className="mb-3 text-base font-semibold text-foreground">Monthly Volume</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyVolumes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line dataKey="volume" stroke="var(--color-chart-1)" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {scopedAlerts.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            title="No alerts in this scope"
            description="Critical alerts and CAPA escalations for your current department scope appear here."
            ctaLabel="Open Reports"
            onCta={() => navigate('/hod/reports')}
            icon={AlertTriangle}
          />
        </div>
      ) : null}
    </div>
  );
}
