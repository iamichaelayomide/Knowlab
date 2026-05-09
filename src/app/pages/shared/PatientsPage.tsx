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
        
        // Validation view restricted to their dept
        const isDeptMatch = getPatientOrders(p.id).some(o => o.department.toLowerCase().includes(activeDepartment.name.toLowerCase()) || activeDepartment.name.toLowerCase().includes(o.department.toLowerCase()));
            
        return isDeptMatch;
    }).length;
  }, [scopedPatients, drafts, activeDepartment.name]);
  
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
        const isDeptMatch = getPatientOrders(patient.id).some(o => o.department.toLowerCase().includes(activeDepartment.name.toLowerCase()) || activeDepartment.name.toLowerCase().includes(o.department.toLowerCase()));
        return isDeptMatch && drafts.some(d => d.patientId === patient.id && d.status === 'pending_approval');
    }

    return true;
  });

  const selectedPatient = PATIENTS.find((patient) => patient.id === patientId) ?? filteredPatients[0];
  const orders = selectedPatient ? getPatientOrders(selectedPatient.id) : [];
  
  // Cross-bench visibility: Staff sees all orders in their active department
  const allowedOrders = user?.role === "staff" && activeDepartment.name !== "Laboratory"
    ? orders.filter(o => o.department.toLowerCase().includes(activeDepartment.name.toLowerCase()) || activeDepartment.name.toLowerCase().includes(o.department.toLowerCase()))
    : orders;
    
  const selectedOrder = allowedOrders.find((order) => order.id === selectedOrderId) ?? allowedOrders[0];
  
  // Find test definition for parameters
  const testDefinition = useMemo(() => {
    if (!selectedOrder) return null;
    return LAB_TESTS.find(t => t.code === selectedOrder.testCode) || null;
  }, [selectedOrder]);

  const allPatientResults = orders.flatMap(o => getOrderResults(o.id));
  const notes = selectedPatient ? getPatientNotes(selectedPatient.id) : [];
  
  const patientDrafts = selectedPatient ? drafts.filter((draft) => draft.patientId === selectedPatient.id && draft.status !== 'approved') : [];
  const approvedDrafts = selectedPatient ? drafts.filter((draft) => draft.patientId === selectedPatient.id && draft.status === 'approved') : [];

  // Reset draft values when order changes
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
                    <SelectValue placeholder="Filter Workload" />
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
          <section className="kl-gradient-card kl-premium-card min-w-0 p-8 sm:p-10 shadow-2xl">
            <div className="flex min-w-0 flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)]">Patient Identity</span>
                  <span className="rounded-full bg-white bg-opacity-40 dark:bg-black dark:bg-opacity-20 px-4 py-1.5 text-[12px] font-bold text-[var(--text-primary)] border border-[var(--surface-border)] backdrop-blur-sm shadow-sm">HOSP: {selectedPatient.hospitalNumber}</span>
                  <span className="rounded-full bg-white bg-opacity-40 dark:bg-black dark:bg-opacity-20 px-4 py-1.5 text-[12px] font-bold text-[var(--text-primary)] border border-[var(--surface-border)] backdrop-blur-sm shadow-sm">LAB: {selectedPatient.labNumber}</span>
                </div>
                <h2 className="kl-text-contain text-[38px] font-black leading-none text-[var(--text-primary)] tracking-tight mb-5">{selectedPatient.name}</h2>
                <div className="flex flex-wrap items-center gap-4">
                  <span className="kl-text-contain text-[16px] text-[var(--text-secondary)] font-bold">
                    {selectedPatient.age} years
                  </span>
                  <span className="text-[var(--surface-border-strong)] opacity-30">•</span>
                  <span className="kl-text-contain text-[16px] text-[var(--text-secondary)] font-bold">
                    {selectedPatient.sex}
                  </span>
                  <span className="text-[var(--surface-border-strong)] opacity-30">•</span>
                  <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--surface-raised)] border border-[var(--surface-border)]">
                    <Box size={16} className="text-[var(--text-tertiary)]" />
                    <span className="kl-text-contain text-[14px] text-[var(--text-primary)] font-bold uppercase tracking-tight">
                        {selectedPatient.ward}
                    </span>
                  </div>
                </div>
              </div>
              <div className="grid w-full min-w-0 grid-cols-2 gap-6 lg:w-[320px] lg:shrink-0">
                <div className="rounded-[28px] border border-[var(--surface-border)] bg-[var(--glass-bg)] p-6 shadow-sm backdrop-blur-md">
                  <p className="text-[12px] font-black uppercase tracking-widest text-[var(--text-tertiary)] mb-2">Tests</p>
                  <p className="text-[40px] font-black text-[var(--text-primary)] leading-none">{orders.length}</p>
                </div>
                <div className="rounded-[28px] border border-[var(--surface-border)] bg-[var(--glass-bg)] p-6 shadow-sm backdrop-blur-md">
                  <p className="text-[12px] font-black uppercase tracking-widest text-[var(--text-tertiary)] mb-2">Queue</p>
                  <p className="text-[40px] font-black text-[#9a6115] leading-none">{patientDrafts.length}</p>
                </div>
              </div>
            </div>
          </section>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-8 p-2 bg-[var(--surface-raised)] rounded-full w-fit border border-[var(--surface-border)]">
              <TabsTrigger value="overview" className="rounded-full px-8 py-2.5 text-[14px] font-black tracking-tight">Overview</TabsTrigger>
              <TabsTrigger value="patient-info" className="rounded-full px-8 py-2.5 text-[14px] font-black tracking-tight">Info</TabsTrigger>
              <TabsTrigger value="results-entry" className="rounded-full px-8 py-2.5 text-[14px] font-black tracking-tight">Result Entry</TabsTrigger>
              <TabsTrigger value="results-dashboard" className="rounded-full px-8 py-2.5 text-[14px] font-black tracking-tight">Dashboard</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-0 outline-none">
              <div className="grid min-w-0 gap-8 lg:grid-cols-2">
                <section className="kl-premium-card min-w-0 p-8 sm:p-10 shadow-xl border-[var(--surface-border)] rounded-[40px]">
                  <h3 className="mb-6 text-[18px] font-black text-[var(--text-primary)] flex items-center gap-3">
                    <div className="size-2.5 rounded-full bg-[var(--kl-primary)] shadow-glow"></div>
                    Suspected Diagnosis
                  </h3>
                  <div className="space-y-8">
                    <p className="text-[15px] font-medium leading-relaxed text-[var(--text-secondary)] italic border-l-4 border-[var(--surface-border)] pl-5">
                      "{selectedPatient.summary}"
                    </p>
                    <div className="space-y-4">
                      <div>
                        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)] mb-3">Clinical Context</p>
                        {selectedPatient.diagnoses.map((item) => (
                          <div key={item.label} className="flex items-center justify-between py-4 border-b border-[var(--surface-border)] last:border-0 border-opacity-50">
                            <span className="text-[15px] font-bold text-[var(--text-primary)]">{item.label}</span>
                            <span className="text-[11px] font-black text-white px-3 py-1.5 bg-[var(--text-tertiary)] rounded-full uppercase tracking-[0.15em]">{item.status}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                <section className="kl-premium-card min-w-0 p-8 sm:p-10 shadow-xl border-[var(--surface-border)] rounded-[40px]">
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-[18px] font-black text-[var(--text-primary)]">Clinical Notes</h3>
                    <button className="kl-icon-button flex items-center justify-center bg-[var(--surface-raised)] size-12 rounded-[20px] border border-[var(--surface-border)] hover:bg-[var(--surface-card)] transition-all shadow-sm" aria-label="Attach case note" onClick={() => setActiveTab("patient-info")}>
                      <NoteText size={20} />
                    </button>
                  </div>
                  <div className="space-y-5">
                    {notes.map((note) => (
                      <div key={note.id} className="rounded-[28px] bg-[var(--surface-raised)] p-6 border border-[var(--surface-border)] shadow-xs transition-all hover:bg-white dark:hover:bg-black dark:hover:bg-opacity-10">
                        <div className="mb-4 flex items-center justify-between">
                          <span className="text-[13px] font-black text-[var(--text-primary)] tracking-tight">{note.author}</span>
                          <span className="text-[11px] font-bold text-[var(--text-tertiary)] uppercase">{formatDate(note.createdAt)}</span>
                        </div>
                        <p className="kl-text-contain text-[14px] font-medium leading-relaxed text-[var(--text-secondary)]">{note.text}</p>
                        {note.attachmentName && (
                          <div className="mt-5 flex items-center gap-3 bg-[var(--surface-card)] p-4 rounded-[20px] border border-[var(--surface-border)] border-opacity-60 shadow-xs">
                            <Gallery size={18} className="text-[var(--kl-primary)]" />
                            <p className="text-[13px] font-bold text-[var(--text-primary)] tracking-tight">{note.attachmentName}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </TabsContent>

            <TabsContent value="patient-info" className="mt-0 outline-none">
              <section className="kl-premium-card min-w-0 p-8 sm:p-12 shadow-2xl border-[var(--surface-border)] rounded-[40px]">
                <h3 className="mb-8 text-[24px] font-black text-[var(--text-primary)] border-b border-[var(--surface-border)] pb-6 tracking-tighter">Medical Summary</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
                  <div className="space-y-4">
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)] ml-2">Vital Signs</span>
                    <div className="bg-[var(--surface-raised)] p-6 rounded-[32px] border border-[var(--surface-border)] shadow-sm">
                      <div className="flex justify-between py-3 border-b border-[var(--surface-border)] last:border-0 border-opacity-40">
                        <span className="text-[14px] font-medium text-[var(--text-secondary)]">Height</span>
                        <span className="text-[15px] font-black text-[var(--text-primary)]">{selectedPatient.height || "Not recorded"}</span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-[var(--surface-border)] last:border-0 border-opacity-40">
                        <span className="text-[14px] font-medium text-[var(--text-secondary)]">Weight</span>
                        <span className="text-[15px] font-black text-[var(--text-primary)]">{selectedPatient.weight || "Not recorded"}</span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-[var(--surface-border)] last:border-0 border-opacity-40">
                        <span className="text-[14px] font-medium text-[var(--text-secondary)]">Blood Pressure</span>
                        <span className="text-[15px] font-black text-[var(--text-primary)]">{selectedPatient.bloodPressure || "Not recorded"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)] ml-2">Drug Reactions</span>
                    <div className="bg-[var(--surface-raised)] p-6 rounded-[32px] border border-[var(--surface-border)] min-h-[140px] shadow-sm">
                      {selectedPatient.allergies.map(reaction => (
                        <div key={reaction} className="flex items-start gap-4 mb-4 last:mb-0 bg-white bg-opacity-50 dark:bg-black dark:bg-opacity-10 p-3.5 rounded-[20px] border border-[var(--surface-border)] border-opacity-50 shadow-xs">
                          <Warning2 size={18} variant="Bold" className="text-[#b14343] shrink-0 mt-0.5" />
                          <span className="text-[14px] font-bold text-[var(--text-primary)] leading-snug">{reaction}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)] ml-2">Case Identifiers</span>
                    <div className="bg-[var(--surface-raised)] p-6 rounded-[32px] border border-[var(--surface-border)] shadow-sm">
                      <div className="mb-5">
                        <p className="text-[11px] font-black uppercase text-[var(--text-tertiary)] mb-1.5 opacity-60">Hospital Record</p>
                        <p className="text-[18px] font-black text-[var(--text-primary)] tracking-tight">{selectedPatient.hospitalNumber}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-black uppercase text-[var(--text-tertiary)] mb-1.5 opacity-60">LIMS Tracker</p>
                        <p className="text-[18px] font-black text-[var(--text-primary)] tracking-tight">{selectedPatient.labNumber}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10">
                  <div className="space-y-4">
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)] ml-2">Clinical History</span>
                    <div className="bg-[var(--surface-raised)] p-8 rounded-[36px] border border-[var(--surface-border)] text-[16px] font-medium text-[var(--text-primary)] leading-relaxed shadow-sm min-h-[250px] transition-all hover:bg-white dark:hover:bg-black dark:hover:bg-opacity-10">
                      {selectedPatient.detailedHistory || "Detailed clinical history has not been fully documented in the LIMS yet."}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)] ml-2">Current Medications</span>
                    <div className="bg-[var(--surface-raised)] p-8 rounded-[36px] border border-[var(--surface-border)] shadow-sm">
                      {selectedPatient.medications.map((item) => (
                        <div key={item.name} className="mb-6 last:mb-0 pb-5 border-b border-[var(--surface-border)] border-opacity-40 last:border-0 last:pb-0">
                          <p className="text-[16px] font-black text-[var(--text-primary)]">{item.name}</p>
                          <p className="text-[14px] text-[var(--text-secondary)] font-bold mt-1.5 uppercase tracking-tighter">{item.dose}</p>
                          {item.note && <p className="text-[11px] text-[var(--text-tertiary)] mt-3 bg-[var(--surface-card)] p-4 rounded-[16px] italic border border-[var(--surface-border)] border-opacity-30 shadow-xs">Note: {item.note}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            </TabsContent>

            <TabsContent value="results-entry" className="mt-0 outline-none">
              <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(340px,400px)_minmax(0,1fr)]">
                <section className="kl-premium-card min-w-0 p-6 sm:p-8 shadow-xl border-[var(--surface-border)] rounded-[40px]">
                  <div className="mb-6 border-b border-[var(--surface-border)] pb-5">
                    <h3 className="text-[20px] font-black text-[var(--text-primary)] tracking-tight">Active Bench</h3>
                    <p className="kl-text-contain text-[14px] font-medium text-[var(--text-secondary)] mt-1.5 opacity-80 uppercase tracking-wide">
                      {activeDepartment.name} Queue
                    </p>
                  </div>

                  <div className="space-y-5">
                    {allowedOrders.map((order) => {
                      const active = selectedOrder?.id === order.id;
                      return (
                        <button
                          key={order.id}
                          onClick={() => setSelectedOrderId(order.id)}
                          className="kl-card-interactive w-full min-w-0 rounded-[32px] border p-6 text-left transition-all"
                          style={{
                            background: active ? "var(--surface-raised)" : "transparent",
                            borderColor: active ? "var(--kl-primary)" : "var(--surface-border)",
                            boxShadow: active ? "0 15px 40px rgba(0,0,0,0.08)" : "none",
                          }}
                        >
                          <div className="flex min-w-0 flex-wrap items-start justify-between gap-4">
                            <div className="min-w-0">
                              <p className="kl-text-contain text-[16px] font-black text-[var(--text-primary)] leading-tight">{order.testName}</p>
                              <p className="kl-text-contain text-[11px] font-black text-[var(--text-tertiary)] mt-1.5 uppercase tracking-[0.2em]">
                                {order.testCode} • {order.bench}
                              </p>
                            </div>
                            <span className="shrink-0 rounded-full bg-[var(--surface-card)] border border-[var(--surface-border)] px-4 py-1.5 text-[11px] font-black uppercase tracking-widest text-[var(--text-secondary)] shadow-xs">
                              {statusLabel(order.status)}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </section>

                <section className="kl-premium-card min-w-0 p-8 sm:p-12 shadow-2xl border-[var(--surface-border)] rounded-[40px]">
                  {selectedOrder ? (
                    <div>
                      <h3 className="mb-8 text-[26px] font-black text-[var(--text-primary)] flex items-center gap-4 tracking-tighter">
                        <div className="size-3.5 rounded-full bg-[var(--kl-primary)] shadow-glow"></div>
                        Entry Mode: <span className="opacity-60 font-bold">{selectedOrder.testName}</span>
                      </h3>
                      <div className="bg-[var(--surface-raised)] p-10 rounded-[40px] border border-[var(--surface-border)] shadow-md">
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 mb-12 border-b border-[var(--surface-border)] border-opacity-50 pb-10">
                          <div className="space-y-2">
                            <p className="text-[11px] font-black uppercase tracking-[0.25em] text-[var(--text-tertiary)] ml-1">Laboratory</p>
                            <p className="text-[16px] font-bold text-[var(--text-primary)]">{selectedOrder.department}</p>
                          </div>
                          <div className="space-y-2">
                            <p className="text-[11px] font-black uppercase tracking-[0.25em] text-[var(--text-tertiary)] ml-1">Specimen</p>
                            <p className="text-[16px] font-bold text-[var(--text-primary)]">{selectedOrder.specimen}</p>
                          </div>
                          <div className="space-y-2">
                            <p className="text-[11px] font-black uppercase tracking-[0.25em] text-[var(--text-tertiary)] ml-1">Urgency</p>
                            <div className="flex items-center gap-2.5">
                              <span className={`size-3 rounded-full ${selectedOrder.priority === 'stat' ? 'bg-[#b14343]' : 'bg-[#9a6115]'} shadow-sm`}></span>
                              <p className="text-[16px] font-black uppercase text-[var(--text-primary)] tracking-[0.2em]">{selectedOrder.priority}</p>
                            </div>
                          </div>
                        </div>

                        {canEnterResults ? (
                          <div className="pt-2">
                            <div className="mb-10">
                                <h4 className="text-[17px] font-black text-[var(--text-primary)] mb-2 uppercase tracking-tight">Parameter Definitions</h4>
                                <p className="text-[14px] font-medium text-[var(--text-tertiary)]">Record numeric or qualitative values for verification.</p>
                            </div>
                            
                            <div className="space-y-8">
                                {testDefinition?.parameters.map(param => (
                                    <div key={param.name} className="grid grid-cols-1 md:grid-cols-[1.5fr_1.2fr_auto] gap-8 items-center bg-[var(--surface-card)] p-7 rounded-[32px] border border-[var(--surface-border)] border-opacity-60 transition-all hover:bg-white dark:hover:bg-black dark:hover:bg-opacity-10 shadow-xs">
                                        <div className="min-w-0">
                                            <p className="text-[16px] font-black text-[var(--text-primary)] tracking-tight">{param.name}</p>
                                            <p className="text-[12px] font-bold text-[var(--kl-primary)] mt-1 opacity-70 uppercase tracking-widest">Normal: {param.maleRange} {param.unit}</p>
                                        </div>
                                        <div className="relative">
                                            <input 
                                                className="input h-14 w-full rounded-[22px] bg-[var(--surface-raised)] border-[var(--surface-border)] focus:bg-white dark:focus:bg-black focus:border-[var(--kl-primary)] focus:ring-8 focus:ring-[var(--kl-primary)] focus:ring-opacity-5 text-[16px] font-black px-6 transition-all shadow-inner"
                                                value={draftValues[param.name] || ""}
                                                onChange={(e) => handleValueChange(param.name, e.target.value)}
                                                placeholder="0.00"
                                            />
                                            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[12px] font-black text-[var(--text-tertiary)] pointer-events-none opacity-40 uppercase tracking-tighter">
                                                {param.unit}
                                            </div>
                                        </div>
                                        <div className="hidden lg:block">
                                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--surface-raised)] border border-[var(--surface-border)] border-opacity-60 shadow-xs">
                                                <div className="size-2 rounded-full bg-[var(--text-tertiary)] opacity-30"></div>
                                                <span className="text-[11px] font-black text-[var(--text-tertiary)] uppercase tracking-widest">Awaiting</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-12 flex flex-col xl:flex-row items-center justify-between gap-8 bg-[var(--surface-card)] p-8 rounded-[36px] border-2 border-[var(--surface-border)] border-opacity-50 shadow-lg">
                                <div className="flex items-start gap-4">
                                    <div className="size-12 rounded-[18px] bg-[var(--kl-primary)] bg-opacity-10 flex items-center justify-center text-[var(--kl-primary)] shadow-sm shrink-0">
                                        <TickCircle size={24} variant="Bold" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[14px] font-black text-[var(--text-primary)] uppercase tracking-tight">Ready for Validation?</p>
                                        <p className="text-[12px] font-medium text-[var(--text-secondary)] leading-snug max-w-[320px]">
                                            Check all parameter values. Submitted results will appear in the supervisor's dashboard for final release.
                                        </p>
                                    </div>
                                </div>
                                <button 
                                    onClick={saveAllDrafts} 
                                    disabled={Object.keys(draftValues).length === 0}
                                    className="btn-primary h-16 px-12 rounded-[24px] text-[16px] font-black shadow-glow hover:translate-y-[-3px] active:translate-y-[0px] active:scale-[0.98] transition-all disabled:opacity-20 disabled:translate-y-0 disabled:scale-100 w-full xl:w-auto"
                                >
                                    Submit Batch for Approval
                                </button>
                            </div>
                          </div>
                        ) : (
                          <div className="p-12 bg-[var(--surface-card)] rounded-[40px] text-center border border-[var(--surface-border)] mt-6 shadow-inner opacity-60">
                            <Warning2 size={48} className="mx-auto mb-4 text-[var(--text-tertiary)] opacity-40" />
                            <p className="text-[18px] font-black text-[var(--text-secondary)] tracking-tight">Access Restricted</p>
                            <p className="text-[14px] font-medium text-[var(--text-tertiary)] mt-1">Validation mode requires staff credentials.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center flex-col text-[var(--text-tertiary)] py-32 opacity-10">
                      <DocumentUpload size={80} className="mb-6" />
                      <p className="text-[24px] font-black uppercase tracking-[0.3em]">Selection Required</p>
                    </div>
                  )}
                </section>
              </div>
            </TabsContent>

            <TabsContent value="results-dashboard" className="mt-0 outline-none">
              <section className="kl-premium-card min-w-0 p-8 sm:p-12 shadow-2xl border-[var(--surface-border)] rounded-[40px]">
                <div className="flex justify-between items-center mb-10 border-b border-[var(--surface-border)] pb-8 border-opacity-50">
                  <div>
                    <h3 className="text-[26px] font-black text-[var(--text-primary)] tracking-tighter uppercase">LIMS Registry</h3>
                    <p className="text-[15px] font-medium text-[var(--text-secondary)] mt-1.5 opacity-60">Review department-wide validation queue and finalized audits.</p>
                  </div>
                  {canApproveResults && (
                    <div className="bg-[var(--surface-raised)] px-6 py-3 rounded-full border-2 border-[var(--surface-border)] flex items-center gap-3 shadow-md">
                        <StatusUp size={20} className="text-[#9a6115]" />
                        <span className="text-[15px] font-black text-[var(--text-primary)] uppercase tracking-tight">{validatingCount} <span className="font-bold opacity-40 text-[12px] ml-1">in registry</span></span>
                    </div>
                  )}
                </div>

                <div className="space-y-12">
                  {/* PENDING APPROVALS */}
                  <div>
                    <div className="flex items-center gap-4 mb-8">
                      <h4 className="text-[18px] font-black text-[#9a6115] flex items-center gap-3 uppercase tracking-tighter">
                        <Timer size={22} variant="Bold" />
                        Verification Queue
                      </h4>
                      <span className="bg-[#9a6115] text-white px-4 py-1 rounded-full flex items-center justify-center text-[12px] font-black shadow-lg">{patientDrafts.length}</span>
                    </div>
                    {patientDrafts.length > 0 ? (
                      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {patientDrafts.map(draft => (
                          <div key={draft.id} className="bg-[#fff0db] dark:bg-[rgba(154,97,21,0.08)] border-2 border-[#f3c26f] border-opacity-50 p-8 rounded-[40px] shadow-sm flex flex-col justify-between hover:border-opacity-100 hover:shadow-xl transition-all group">
                            <div>
                              <div className="flex justify-between items-start mb-4">
                                <span className="text-[13px] font-black uppercase tracking-[0.2em] text-[#9a6115] group-hover:tracking-[0.25em] transition-all">{draft.parameter}</span>
                                <span className="text-[10px] font-black bg-[#f3c26f] bg-opacity-50 text-[#9a6115] px-3 py-1.5 rounded-full uppercase tracking-[0.1em]">Verification</span>
                              </div>
                              <div className="text-[44px] font-black text-[var(--text-primary)] mb-6 leading-none tracking-tighter">{draft.value} <span className="text-[14px] opacity-40 uppercase ml-1">{draft.unit}</span></div>
                            </div>
                            {canApproveResults ? (
                              <button onClick={() => approveDraft(draft.id)} className="w-full bg-[#9a6115] hover:bg-[#805010] text-white py-4 rounded-[22px] text-[15px] font-black transition-all shadow-glow active:scale-95 hover:shadow-xl">
                                Approve & Release
                              </button>
                            ) : (
                              <div className="text-[13px] font-bold text-[#9a6115] opacity-50 italic border-t border-[#f3c26f] border-opacity-20 pt-5 flex items-center gap-3">
                                <Timer size={16} />
                                Pending supervisor review
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-20 bg-[var(--surface-raised)] rounded-[40px] border-2 border-dashed border-[var(--surface-border)] border-opacity-60">
                        <TickCircle size={64} className="mb-4 text-[var(--kl-primary)] opacity-20" />
                        <p className="text-[18px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em]">Cleared</p>
                        <p className="text-[15px] font-medium text-[var(--text-tertiary)] mt-2">No pending results for this patient.</p>
                      </div>
                    )}
                  </div>

                  {/* FINALIZED RESULTS */}
                  <div>
                    <h4 className="text-[18px] font-black text-[var(--text-primary)] flex items-center gap-3 mb-8 uppercase tracking-tighter">
                      <TickCircle size={22} variant="Bold" className="text-[#1c7b56]" />
                      Certified Audit Log
                    </h4>
                    
                    <div className="bg-[var(--surface-raised)] border border-[var(--surface-border)] rounded-[40px] overflow-hidden shadow-inner border-opacity-60">
                      <table className="w-full text-left text-[15px]">
                        <thead>
                          <tr className="border-b border-[var(--surface-border)] bg-[var(--surface-card)] text-[var(--text-tertiary)] border-opacity-50">
                            <th className="font-black p-7 text-[11px] uppercase tracking-[0.3em]">Parameter</th>
                            <th className="font-black p-7 text-[11px] uppercase tracking-[0.3em]">Analyzed Value</th>
                            <th className="font-black p-7 hidden sm:table-cell text-[11px] uppercase tracking-[0.3em]">Biological Ref</th>
                            <th className="font-black p-7 text-[11px] uppercase tracking-[0.3em]">Flag</th>
                            <th className="font-black p-7 hidden md:table-cell text-[11px] uppercase tracking-[0.3em]">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--surface-border)] divide-opacity-30">
                          {[...allPatientResults, ...approvedDrafts.map(d => ({ ...d, flag: 'normal' as ResultFlag }))].map((result, idx) => (
                            <tr key={'id' in result ? result.id : idx} className="hover:bg-white dark:hover:bg-black dark:hover:bg-opacity-20 transition-colors group">
                              <td className="p-7 font-black text-[var(--text-primary)] group-hover:text-[var(--kl-primary)] transition-colors tracking-tight">{result.parameter}</td>
                              <td className="p-7 text-[var(--text-primary)] font-black text-[22px] tracking-tight">{result.value} <span className="text-[14px] font-bold opacity-30 ml-1 uppercase">{result.unit}</span></td>
                              <td className="p-7 text-[var(--text-secondary)] font-bold hidden sm:table-cell tracking-tighter">{result.referenceRange}</td>
                              <td className="p-7">
                                <span className={`px-4 py-1.5 rounded-[12px] text-[11px] font-black uppercase tracking-[0.15em] ${FLAG_CLASS[result.flag]} shadow-sm`}>
                                  {result.flag}
                                </span>
                              </td>
                              <td className="p-7 hidden md:table-cell">
                                <div className="flex items-center gap-2.5 text-[#1c7b56] font-black text-[12px] uppercase tracking-tighter">
                                  <div className="size-2 rounded-full bg-[#1c7b56] shadow-sm"></div>
                                  CERTIFIED
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </section>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
