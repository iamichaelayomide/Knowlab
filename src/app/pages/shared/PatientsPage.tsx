import { useMemo, useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router";
import {
  Add,
  DocumentUpload,
  Gallery,
  Health,
  NoteText,
  Profile2User,
  SearchNormal1,
  TickCircle,
  Warning2,
  Timer1 as Timer,
  StatusUp,
  Box,
  ArrowDown2,
} from "iconsax-react";
import { useAuth } from "../../context/AuthContext";
import { useDepartment } from "../../context/DepartmentContext";
import {
  getOrderResults,
  getPatientNotes,
  getPatientOrders,
  type LabOrder,
  PATIENTS,
  scopePatients,
  type ResultFlag,
} from "../../data/patients";
import { LAB_TESTS } from "../../data/mockData";
import { readOfflineResultDrafts, saveOfflineResultDraft, removeOfflineResultDraft } from "../../services/offlineDrafts";
import { openFloatingAI } from "../../services/aiWidget";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

const FLAG_CLASS: Record<ResultFlag, string> = {
  normal: "bg-[#e8f8f1] text-[#1c7b56] dark:bg-[rgba(28,123,86,0.18)] dark:text-[#88e0ba]",
  high: "bg-[#fff0db] text-[#9a6115] dark:bg-[rgba(154,97,21,0.18)] dark:text-[#f3c26f]",
  low: "bg-[#fff0db] text-[#9a6115] dark:bg-[rgba(154,97,21,0.18)] dark:text-[#f3c26f]",
  critical: "bg-[#fde9e9] text-[#b14343] dark:bg-[rgba(177,67,67,0.18)] dark:text-[#fca5a5]",
  pending: "bg-[var(--kl-surface-tinted)] text-[var(--text-secondary)]",
};

function statusLabel(status: LabOrder["status"]) {
  return status.replace("_", " ");
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

export default function PatientsPage() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { activeDepartment, activeBench } = useDepartment();
  const location = useLocation();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All"); // "All", "Pending", "Validating"
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [draftValues, setDraftValues] = useState<Record<string, string>>({});
  const [drafts, setDrafts] = useState(() => readOfflineResultDrafts());
  const [activeTab, setActiveTab] = useState("overview");

  const base = location.pathname.startsWith("/supervisor") ? "/supervisor" : location.pathname.startsWith("/hod") ? "/hod" : "/staff";
  
  const scopedPatients = useMemo(
    () => (user ? scopePatients(user.role, user.unit, activeDepartment.name) : []),
    [activeDepartment.name, user],
  );

  // GLOBAL COUNTS for notification-style badges
  const pendingCount = useMemo(() => {
    return scopedPatients.filter(p => {
        const orders = getPatientOrders(p.id);
        return orders.some(o => {
            const isDeptMatch = o.department.toLowerCase().includes(activeDepartment.name.toLowerCase()) || activeDepartment.name.toLowerCase().includes(o.department.toLowerCase());
            return isDeptMatch && ['ordered', 'collected', 'processing', 'held'].includes(o.status);
        });
    }).length;
  }, [scopedPatients, activeDepartment.name]);

  const validatingCount = useMemo(() => {
    return scopedPatients.filter(p => {
        const pDrafts = drafts.filter(d => d.patientId === p.id && d.status === 'pending_approval');
        if (pDrafts.length === 0) return false;
        
        // For staff, we still restrict validation view to their dept
        const isDeptMatch = user?.role === 'staff' 
            ? getPatientOrders(p.id).some(o => o.department.toLowerCase().includes(activeDepartment.name.toLowerCase()) || activeDepartment.name.toLowerCase().includes(o.department.toLowerCase()))
            : true;
            
        return isDeptMatch;
    }).length;
  }, [scopedPatients, drafts, user?.role, activeDepartment.name]);
  
  const filteredPatients = scopedPatients.filter((patient) => {
    const term = search.toLowerCase();
    const matchesSearch = 
      patient.name.toLowerCase().includes(term) ||
      patient.hospitalNumber.toLowerCase().includes(term) ||
      patient.labNumber.toLowerCase().includes(term) ||
      patient.ward.toLowerCase().includes(term) ||
      patient.summary.toLowerCase().includes(term);
    
    if (!matchesSearch) return false;

    // Filter Logic: If filter is active, strictly only show matching patients for THAT LAB
    if (activeFilter === "Pending") {
      const patientOrders = getPatientOrders(patient.id);
      return patientOrders.some(o => {
        const isDeptMatch = o.department.toLowerCase().includes(activeDepartment.name.toLowerCase()) || activeDepartment.name.toLowerCase().includes(o.department.toLowerCase());
        return isDeptMatch && ['ordered', 'collected', 'processing', 'held'].includes(o.status);
      });
    }

    if (activeFilter === "Validating") {
        const isDeptMatch = user?.role === 'staff' 
            ? getPatientOrders(patient.id).some(o => o.department.toLowerCase().includes(activeDepartment.name.toLowerCase()) || activeDepartment.name.toLowerCase().includes(o.department.toLowerCase()))
            : true;
        return isDeptMatch && drafts.some(d => d.patientId === patient.id && d.status === 'pending_approval');
    }

    return true;
  });

  const selectedPatient = PATIENTS.find((patient) => patient.id === patientId) ?? filteredPatients[0];
  const orders = selectedPatient ? getPatientOrders(selectedPatient.id) : [];
  
  const allowedOrders = user?.role === "staff" && activeDepartment.name !== "Laboratory"
    ? orders.filter(o => o.department.toLowerCase().includes(activeDepartment.name.toLowerCase()) || activeDepartment.name.toLowerCase().includes(o.department.toLowerCase()))
    : orders;
    
  const selectedOrder = allowedOrders.find((order) => order.id === selectedOrderId) ?? allowedOrders[0];
  
  const testDefinition = useMemo(() => {
    if (!selectedOrder) return null;
    return LAB_TESTS.find(t => t.code === selectedOrder.testCode) || null;
  }, [selectedOrder]);

  const allPatientResults = orders.flatMap(o => getOrderResults(o.id));
  const notes = selectedPatient ? getPatientNotes(selectedPatient.id) : [];
  
  const patientDrafts = selectedPatient ? drafts.filter((draft) => draft.patientId === selectedPatient.id && draft.status !== 'approved') : [];
  const approvedDrafts = selectedPatient ? drafts.filter((draft) => draft.patientId === selectedPatient.id && draft.status === 'approved') : [];

  useEffect(() => {
    setDraftValues({});
  }, [selectedOrderId]);

  const handleValueChange = (parameterName: string, value: string) => {
    setDraftValues(prev => ({ ...prev, [parameterName]: value }));
  };

  const saveAllDrafts = () => {
    if (!selectedPatient || !selectedOrder || !testDefinition) return;
    
    let updatedDrafts = drafts;
    testDefinition.parameters.forEach(param => {
      const value = draftValues[param.name];
      if (value && value.trim()) {
        updatedDrafts = saveOfflineResultDraft({
          id: `draft_${Date.now()}_${param.name.replace(/\s+/g, '')}`,
          patientId: selectedPatient.id,
          orderId: selectedOrder.id,
          parameter: param.name,
          value: value.trim(),
          unit: param.unit || "",
          referenceRange: param.maleRange || "N/A",
          flag: "pending",
          status: "pending_approval",
          createdAt: new Date().toISOString(),
        });
      }
    });
    
    setDrafts(updatedDrafts);
    setDraftValues({});
  };

  const approveDraft = (draftId: string) => {
    const draft = drafts.find(d => d.id === draftId);
    if (!draft) return;
    
    const updatedDraft = { ...draft, status: "approved" as const, flag: "normal" as const };
    removeOfflineResultDraft(draftId);
    const next = saveOfflineResultDraft(updatedDraft);
    setDrafts(next);
  };

  if (!user || !selectedPatient) return null;

  const canEnterResults = user.role === "staff";
  const canApproveResults = user.role === "supervisor" || user.role === "hod";
  
  const scopeCopy =
    user.role === "hod"
      ? "Lab-wide patient, order, and result visibility."
      : user.role === "supervisor"
        ? `${activeDepartment.shortName} oversight focused on bench workload and validation queue.`
        : `${activeDepartment.name} LIMS workspace for result entry and validation.`;

  return (
    <div className="kl-page min-h-full max-w-full overflow-x-hidden p-6 sm:p-8 lg:p-10">
      <div className="mb-10 flex min-w-0 flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-4 mb-2">
             <h1 className="text-[32px] font-bold tracking-tight text-[var(--text-primary)]">LIMS Portal</h1>
             <div className="flex items-center gap-3">
                <div className="relative">
                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--surface-raised)] border border-[var(--surface-border)] shadow-sm">
                        <div className="size-2 rounded-full bg-[#007aff]"></div>
                        <span className="text-[13px] font-bold text-[var(--text-primary)]">{pendingCount} <span className="font-medium text-[var(--text-tertiary)]">pending</span></span>
                    </div>
                </div>
                <div className="relative">
                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--surface-raised)] border border-[var(--surface-border)] shadow-sm">
                        <div className="size-2 rounded-full bg-[#9a6115] animate-pulse"></div>
                        <span className="text-[13px] font-bold text-[var(--text-primary)]">{validatingCount} <span className="font-medium text-[var(--text-tertiary)]">validating</span></span>
                    </div>
                </div>
             </div>
          </div>
          <p className="kl-text-contain text-[16px] text-[var(--text-secondary)] font-medium">{scopeCopy}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="kl-button-soft h-12 px-6 rounded-full text-[14px] font-bold shadow-xs hover:bg-[var(--surface-raised)] transition-all"
            onClick={() => openFloatingAI(`Summarize patient laboratory priorities and detailed history for ${selectedPatient.name}.`)}
          >
            <Health size={18} variant="Bold" className="mr-2 text-[var(--kl-primary)]" />
            AI Case Summary
          </button>
        </div>
      </div>

      <div className="grid min-w-0 gap-8 xl:grid-cols-[minmax(320px,380px)_minmax(0,1fr)]">
        <aside className="kl-premium-card min-w-0 p-5 h-[calc(100vh-180px)] overflow-y-auto shadow-md border-[var(--surface-border)]">
          <div className="flex flex-col gap-3 mb-5">
            <div className="relative w-full">
              <SearchNormal1 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="input h-12 w-full rounded-[22px] bg-[var(--surface-raised)] border-transparent focus:bg-[var(--surface-card)] focus:border-[var(--surface-border-strong)] pl-12 pr-4 text-[14px] transition-all"
                placeholder="Hospital/Lab # or name..."
              />
            </div>
            
            <Select value={activeFilter} onValueChange={setActiveFilter}>
                <SelectTrigger className="h-11 rounded-[20px] bg-[var(--surface-raised)] border-transparent shadow-none font-bold text-[13px] px-5">
                    <div className="flex items-center gap-2">
                        <Timer size={18} variant={activeFilter !== "All" ? "Bold" : "Linear"} className={activeFilter === "Pending" ? "text-[#007aff]" : activeFilter === "Validating" ? "text-[#9a6115]" : "text-[var(--text-secondary)]"} />
                        <SelectValue placeholder="Filter Workload" />
                    </div>
                </SelectTrigger>
                <SelectContent className="rounded-[20px]">
                    <SelectItem value="All">All Patients</SelectItem>
                    <SelectItem value="Pending">Pending (Unentered)</SelectItem>
                    <SelectItem value="Validating">Validating (Awaiting Review)</SelectItem>
                </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {filteredPatients.map((patient) => {
              const active = patient.id === selectedPatient.id;
              const patientOrders = getPatientOrders(patient.id);
              const count = patientOrders.length;
              
              const isValidationMode = activeFilter === "Validating";
              const isPendingMode = activeFilter === "Pending";
              
              // Dynamic indicators based on filter mode
              const showValidating = drafts.some(d => d.patientId === patient.id && d.status === 'pending_approval');
              const showPending = patientOrders.some(o => {
                  const isDeptMatch = o.department.toLowerCase().includes(activeDepartment.name.toLowerCase()) || activeDepartment.name.toLowerCase().includes(o.department.toLowerCase());
                  return isDeptMatch && ['ordered', 'collected', 'processing', 'held'].includes(o.status);
              });

              return (
                <a
                  key={patient.id}
                  href={`${base}/patients/${patient.id}`}
                  onClick={(e) => { e.preventDefault(); navigate(`${base}/patients/${patient.id}`); }}
                  className="kl-card-interactive relative flex items-center gap-4 rounded-[28px] border p-5 no-underline transition-all"
                  style={{
                    background: active ? "var(--surface-card)" : "transparent",
                    borderColor: active ? "var(--surface-border-strong)" : "transparent",
                    boxShadow: active ? "0 10px 30px rgba(0,0,0,0.05)" : "none",
                  }}
                >
                  <div className="absolute top-4 right-4">
                    {isValidationMode && showValidating && (
                        <div className="flex items-center justify-center size-2 rounded-full bg-[#9a6115] animate-pulse shadow-glow"></div>
                    )}
                    {isPendingMode && showPending && (
                        <div className="flex items-center justify-center size-2 rounded-full bg-[#007aff] shadow-glow"></div>
                    )}
                  </div>
                  <span className="grid size-14 place-items-center rounded-[22px] border border-[var(--surface-border)] bg-[var(--surface-raised)] text-[var(--text-primary)] shadow-sm">
                    <Profile2User size={24} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[15px] font-bold text-[var(--text-primary)]">{patient.name}</span>
                    <span className="block truncate text-[13px] font-medium text-[var(--text-tertiary)] mt-1">
                      {patient.hospitalNumber} • {count} tests
                    </span>
                  </span>
                </a>
              );
            })}
          </div>
        </aside>

        <main className="min-w-0 space-y-8">
...