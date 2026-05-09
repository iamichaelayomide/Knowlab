import { useMemo, useState } from "react";
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
import { readOfflineResultDrafts, saveOfflineResultDraft, removeOfflineResultDraft } from "../../services/offlineDrafts";
import { openFloatingAI } from "../../services/aiWidget";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";

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
  const [filterPending, setFilterPending] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [draftValue, setDraftValue] = useState("");
  const [draftParameter, setDraftParameter] = useState("Result");
  const [drafts, setDrafts] = useState(() => readOfflineResultDrafts());
  const [activeTab, setActiveTab] = useState("overview");

  const base = location.pathname.startsWith("/supervisor") ? "/supervisor" : location.pathname.startsWith("/hod") ? "/hod" : "/staff";
  const scopedPatients = useMemo(
    () => (user ? scopePatients(user.role, user.unit, activeDepartment.name) : []),
    [activeDepartment.name, user],
  );

  // GLOBAL PENDING COUNTS
  const allDeptDrafts = useMemo(() => {
    return drafts.filter(d => {
      const isDeptMatch = user?.role === 'staff' && activeDepartment.name !== 'Laboratory' 
        ? d.parameter !== '' // Simplification: we usually don't have dept on drafts, but let's filter by status
        : true;
      return d.status !== 'approved';
    });
  }, [drafts, user?.role, activeDepartment.name]);

  const globalPendingCount = useMemo(() => {
    let count = 0;
    scopedPatients.forEach(p => {
      const pOrders = getPatientOrders(p.id);
      const hasUnfinished = pOrders.some(o => {
        const isDeptMatch = user?.role === 'staff' && activeDepartment.name !== 'Laboratory' 
          ? o.department.toLowerCase().includes(activeDepartment.name.toLowerCase()) || activeDepartment.name.toLowerCase().includes(o.department.toLowerCase())
          : true;
        return isDeptMatch && ['ordered', 'collected', 'processing', 'held'].includes(o.status);
      });
      if (hasUnfinished) count++;
    });
    return count;
  }, [scopedPatients, user?.role, activeDepartment.name]);
  
  const filteredPatients = scopedPatients.filter((patient) => {
    const term = search.toLowerCase();
    const matchesSearch = 
      patient.name.toLowerCase().includes(term) ||
      patient.hospitalNumber.toLowerCase().includes(term) ||
      patient.ward.toLowerCase().includes(term) ||
      patient.summary.toLowerCase().includes(term);
    
    if (!matchesSearch) return false;

    if (filterPending) {
      const patientOrders = getPatientOrders(patient.id);
      const hasPendingInDept = patientOrders.some(o => {
        const isDeptMatch = user?.role === 'staff' && activeDepartment.name !== 'Laboratory' 
          ? o.department.toLowerCase().includes(activeDepartment.name.toLowerCase()) || activeDepartment.name.toLowerCase().includes(o.department.toLowerCase())
          : true;
        const isPending = ['ordered', 'collected', 'processing', 'held'].includes(o.status);
        return isDeptMatch && isPending;
      });
      return hasPendingInDept;
    }

    return true;
  });

  const selectedPatient = PATIENTS.find((patient) => patient.id === patientId) ?? filteredPatients[0];
  const orders = selectedPatient ? getPatientOrders(selectedPatient.id) : [];
  
  const allowedOrders = user?.role === "staff" && activeDepartment.name !== "Laboratory"
    ? orders.filter(o => o.department === activeDepartment.name)
    : orders;
    
  const selectedOrder = allowedOrders.find((order) => order.id === selectedOrderId) ?? allowedOrders[0];
  
  const allPatientResults = orders.flatMap(o => getOrderResults(o.id));
  const results = selectedOrder ? getOrderResults(selectedOrder.id) : [];
  const notes = selectedPatient ? getPatientNotes(selectedPatient.id) : [];
  
  const patientDrafts = selectedPatient ? drafts.filter((draft) => draft.patientId === selectedPatient.id && draft.status !== 'approved') : [];
  const approvedDrafts = selectedPatient ? drafts.filter((draft) => draft.patientId === selectedPatient.id && draft.status === 'approved') : [];

  const saveDraft = () => {
    if (!selectedPatient || !selectedOrder || !draftValue.trim()) return;
    const next = saveOfflineResultDraft({
      id: `draft_${Date.now()}`,
      patientId: selectedPatient.id,
      orderId: selectedOrder.id,
      parameter: draftParameter.trim() || "Result",
      value: draftValue.trim(),
      unit: "",
      referenceRange: "Use local range",
      flag: "pending",
      status: "pending_approval",
      createdAt: new Date().toISOString(),
    });
    setDrafts(next);
    setDraftValue("");
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
        ? `${activeDepartment.shortName} oversight focused on bench workload and pending LIMS approvals.`
        : `${activeBench.shortName} LIMS workspace for result entry and validation.`;

  return (
    <div className="kl-page min-h-full max-w-full overflow-x-hidden p-4 sm:p-6 lg:p-8">
      <div className="mb-8 flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-3 mb-1">
             <h1 className="text-[28px] font-bold tracking-tight text-[var(--text-primary)]">LIMS Portal</h1>
             <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--surface-raised)] border border-[var(--surface-border)] shadow-sm">
                <StatusUp size={14} className="text-[var(--kl-primary)]" />
                <span className="text-[13px] font-bold text-[var(--text-primary)]">{globalPendingCount} <span className="font-medium text-[var(--text-tertiary)]">pending tasks</span></span>
             </div>
          </div>
          <p className="kl-text-contain text-[15px] text-[var(--text-secondary)] font-medium">{scopeCopy}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="kl-button-soft h-11 px-5 rounded-full text-[13px] font-bold shadow-xs hover:bg-[var(--surface-raised)] transition-all"
            onClick={() => openFloatingAI(`Summarize patient laboratory priorities and detailed history for ${selectedPatient.name}.`)}
          >
            <Health size={16} variant="Bold" className="mr-2 text-[var(--kl-primary)]" />
            AI Case Summary
          </button>
        </div>
      </div>

      <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(300px,350px)_minmax(0,1fr)]">
        <aside className="kl-premium-card min-w-0 p-4 h-[calc(100vh-160px)] overflow-y-auto shadow-md border-[var(--surface-border)]">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1">
              <SearchNormal1 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="input h-12 w-full rounded-[20px] bg-[var(--surface-raised)] border-transparent focus:bg-[var(--surface-card)] focus:border-[var(--surface-border-strong)] pl-11 pr-4 text-[14px] transition-all"
                placeholder="Find patient..."
              />
            </div>
            <button
              onClick={() => setFilterPending(!filterPending)}
              className={`size-12 flex-shrink-0 rounded-[20px] border flex items-center justify-center transition-all ${
                filterPending 
                ? "bg-[var(--kl-primary)] text-white border-[var(--kl-primary)] shadow-lg" 
                : "bg-[var(--surface-raised)] text-[var(--text-secondary)] border-[var(--surface-border)] hover:bg-[var(--surface-card)]"
              }`}
              title={filterPending ? "Showing pending only" : "Filter pending results"}
            >
              <Timer size={20} variant={filterPending ? "Bold" : "Linear"} />
            </button>
          </div>
          <div className="space-y-3">
            {filteredPatients.map((patient) => {
              const active = patient.id === selectedPatient.id;
              const patientOrders = getPatientOrders(patient.id);
              const count = patientOrders.length;
              const hasPending = patientOrders.some(o => ['ordered', 'collected', 'processing', 'held'].includes(o.status));

              return (
                <a
                  key={patient.id}
                  href={`${base}/patients/${patient.id}`}
                  onClick={(e) => { e.preventDefault(); navigate(`${base}/patients/${patient.id}`); }}
                  className="kl-card-interactive relative flex items-center gap-4 rounded-[24px] border p-4 no-underline transition-all"
                  style={{
                    background: active ? "var(--surface-card)" : "transparent",
                    borderColor: active ? "var(--surface-border-strong)" : "transparent",
                    boxShadow: active ? "0 8px 24px rgba(0,0,0,0.04)" : "none",
                  }}
                >
                  {hasPending && (
                    <div className="absolute top-4 right-4 flex items-center gap-1 bg-[#fff0db] dark:bg-[rgba(154,97,21,0.12)] px-2 py-0.5 rounded-full border border-[#f3c26f] border-opacity-30">
                      <div className="size-1.5 rounded-full bg-[#9a6115] animate-pulse"></div>
                      <span className="text-[9px] font-black text-[#9a6115] uppercase tracking-wider">Pending</span>
                    </div>
                  )}
                  <span className="grid size-12 place-items-center rounded-[20px] border border-[var(--surface-border)] bg-[var(--surface-raised)] text-[var(--text-primary)] shadow-sm">
                    <Profile2User size={20} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14px] font-bold text-[var(--text-primary)]">{patient.name}</span>
                    <span className="block truncate text-[12px] font-medium text-[var(--text-tertiary)] mt-0.5">
                      {patient.hospitalNumber} • {count} order{count === 1 ? "" : "s"}
                    </span>
                  </span>
                </a>
              );
            })}
          </div>
        </aside>

        <main className="min-w-0 space-y-6">
          <section className="kl-gradient-card kl-premium-card min-w-0 p-6 sm:p-8 shadow-xl">
            <div className="flex min-w-0 flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.15em] text-[var(--text-tertiary)]">Patient Summary</span>
                  <span className="rounded-full bg-white bg-opacity-40 dark:bg-black dark:bg-opacity-20 px-3 py-1 text-[11px] font-bold text-[var(--text-primary)] border border-[var(--surface-border)] backdrop-blur-sm shadow-sm">HN: {selectedPatient.hospitalNumber}</span>
                  <span className="rounded-full bg-white bg-opacity-40 dark:bg-black dark:bg-opacity-20 px-3 py-1 text-[11px] font-bold text-[var(--text-primary)] border border-[var(--surface-border)] backdrop-blur-sm shadow-sm">LAB: {selectedPatient.labNumber}</span>
                </div>
                <h2 className="kl-text-contain text-[32px] font-black leading-none text-[var(--text-primary)] tracking-tight mb-3">{selectedPatient.name}</h2>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="kl-text-contain text-[14px] text-[var(--text-secondary)] font-bold">
                    {selectedPatient.age} years
                  </span>
                  <span className="text-[var(--surface-border-strong)] opacity-30">•</span>
                  <span className="kl-text-contain text-[14px] text-[var(--text-secondary)] font-bold">
                    {selectedPatient.sex}
                  </span>
                  <span className="text-[var(--surface-border-strong)] opacity-30">•</span>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--surface-raised)] border border-[var(--surface-border)]">
                    <Box size={14} className="text-[var(--text-tertiary)]" />
                    <span className="kl-text-contain text-[13px] text-[var(--text-primary)] font-semibold">
                        {selectedPatient.ward}
                    </span>
                  </div>
                </div>
              </div>
              <div className="grid w-full min-w-0 grid-cols-2 gap-4 lg:w-[280px] lg:shrink-0">
                <div className="rounded-[24px] border border-[var(--surface-border)] bg-[var(--glass-bg)] p-5 shadow-sm backdrop-blur-md">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] mb-1">Total Orders</p>
                  <p className="text-[32px] font-black text-[var(--text-primary)] leading-none">{orders.length}</p>
                </div>
                <div className="rounded-[24px] border border-[var(--surface-border)] bg-[var(--glass-bg)] p-5 shadow-sm backdrop-blur-md">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] mb-1">To Validate</p>
                  <p className="text-[32px] font-black text-[#9a6115] leading-none">{patientDrafts.length}</p>
                </div>
              </div>
            </div>
          </section>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6 p-1.5 bg-[var(--surface-raised)] rounded-full w-fit">
              <TabsTrigger value="overview" className="rounded-full px-6 py-2 text-[13px] font-bold">Overview</TabsTrigger>
              <TabsTrigger value="patient-info" className="rounded-full px-6 py-2 text-[13px] font-bold">Patient Info</TabsTrigger>
              <TabsTrigger value="results-entry" className="rounded-full px-6 py-2 text-[13px] font-bold">Results Entry</TabsTrigger>
              <TabsTrigger value="results-dashboard" className="rounded-full px-6 py-2 text-[13px] font-bold">Results Dashboard</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-0 outline-none">
              <div className="grid min-w-0 gap-6 lg:grid-cols-2">
                <section className="kl-premium-card min-w-0 p-6 sm:p-8 shadow-lg">
                  <h3 className="mb-5 text-[17px] font-bold text-[var(--text-primary)] flex items-center gap-2">
                    <div className="size-2 rounded-full bg-[var(--kl-primary)]"></div>
                    Suspected Diagnosis & Symptoms
                  </h3>
                  <div className="space-y-6">
                    <p className="text-[14px] font-medium leading-relaxed text-[var(--text-secondary)] italic border-l-4 border-[var(--surface-border)] pl-4">
                      "{selectedPatient.summary}"
                    </p>
                    <div className="space-y-4">
                      <div>
                        <p className="text-[11px] font-black uppercase tracking-[0.1em] text-[var(--text-tertiary)] mb-2">Active Working Diagnoses</p>
                        {selectedPatient.diagnoses.map((item) => (
                          <div key={item.label} className="flex items-center justify-between py-3 border-b border-[var(--surface-border)] last:border-0">
                            <span className="text-[14px] font-bold text-[var(--text-primary)]">{item.label}</span>
                            <span className="text-[10px] font-black text-white px-2.5 py-1 bg-[var(--text-tertiary)] rounded-full uppercase tracking-widest">{item.status}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                <section className="kl-premium-card min-w-0 p-6 sm:p-8 shadow-lg">
                  <div className="mb-5 flex items-center justify-between">
                    <h3 className="text-[17px] font-bold text-[var(--text-primary)]">Case Notes</h3>
                    <button className="kl-icon-button flex items-center justify-center bg-[var(--surface-raised)] size-10 rounded-full border border-[var(--surface-border)] hover:bg-[var(--surface-card)] transition-all shadow-sm" aria-label="Attach case note" onClick={() => setActiveTab("patient-info")}>
                      <NoteText size={18} />
                    </button>
                  </div>
                  <div className="space-y-4">
                    {notes.map((note) => (
                      <div key={note.id} className="rounded-[24px] bg-[var(--surface-raised)] p-5 border border-[var(--surface-border)] shadow-xs">
                        <div className="mb-3 flex items-center justify-between">
                          <span className="text-[12px] font-bold text-[var(--text-primary)]">{note.author}</span>
                          <span className="text-[11px] font-medium text-[var(--text-tertiary)]">{formatDate(note.createdAt)}</span>
                        </div>
                        <p className="kl-text-contain text-[13px] font-medium leading-relaxed text-[var(--text-secondary)]">{note.text}</p>
                        {note.attachmentName && (
                          <div className="mt-4 flex items-center gap-3 bg-[var(--surface-card)] p-3 rounded-[16px] border border-[var(--surface-border)]">
                            <Gallery size={16} className="text-[var(--kl-primary)]" />
                            <p className="text-[12px] font-bold text-[var(--text-primary)]">{note.attachmentName}</p>
                          </div>
                        )}
                      </div>
                    ))}
                    {notes.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-12 opacity-30 bg-[var(--surface-raised)] rounded-[24px] border border-dashed border-[var(--surface-border)]">
                        <NoteText size={32} className="mb-2" />
                        <p className="text-[14px] font-bold text-center">No specific case notes filed.</p>
                      </div>
                    )}
                  </div>
                </section>
              </div>
            </TabsContent>

            <TabsContent value="patient-info" className="mt-0 outline-none">
              <section className="kl-premium-card min-w-0 p-6 sm:p-8 shadow-lg">
                <h3 className="mb-6 text-[20px] font-black text-[var(--text-primary)] border-b border-[var(--surface-border)] pb-4 tracking-tight">Detailed Medical History</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                  <div className="space-y-3">
                    <span className="text-[11px] font-black uppercase tracking-[0.1em] text-[var(--text-tertiary)] ml-1">Key Vitals</span>
                    <div className="bg-[var(--surface-raised)] p-5 rounded-[28px] border border-[var(--surface-border)] shadow-sm">
                      <div className="flex justify-between py-2 border-b border-[var(--surface-border)] last:border-0">
                        <span className="text-[13px] font-medium text-[var(--text-secondary)]">Height</span>
                        <span className="text-[14px] font-black text-[var(--text-primary)]">{selectedPatient.height || "Not recorded"}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-[var(--surface-border)] last:border-0">
                        <span className="text-[13px] font-medium text-[var(--text-secondary)]">Weight</span>
                        <span className="text-[14px] font-black text-[var(--text-primary)]">{selectedPatient.weight || "Not recorded"}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-[var(--surface-border)] last:border-0">
                        <span className="text-[13px] font-medium text-[var(--text-secondary)]">Blood Pressure</span>
                        <span className="text-[14px] font-black text-[var(--text-primary)]">{selectedPatient.bloodPressure || "Not recorded"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <span className="text-[11px] font-black uppercase tracking-[0.1em] text-[var(--text-tertiary)] ml-1">Drug Reactions</span>
                    <div className="bg-[var(--surface-raised)] p-5 rounded-[28px] border border-[var(--surface-border)] min-h-[120px] shadow-sm">
                      {selectedPatient.allergies.map(reaction => (
                        <div key={reaction} className="flex items-start gap-3 mb-3 last:mb-0 bg-white bg-opacity-50 dark:bg-black dark:bg-opacity-10 p-2.5 rounded-[16px] border border-[var(--surface-border)] border-opacity-50">
                          <Warning2 size={16} variant="Bold" className="text-[#b14343] shrink-0 mt-0.5" />
                          <span className="text-[13px] font-bold text-[var(--text-primary)] leading-tight">{reaction}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <span className="text-[11px] font-black uppercase tracking-[0.1em] text-[var(--text-tertiary)] ml-1">Identifiers</span>
                    <div className="bg-[var(--surface-raised)] p-5 rounded-[28px] border border-[var(--surface-border)] shadow-sm">
                      <div className="mb-4">
                        <p className="text-[10px] font-black uppercase text-[var(--text-tertiary)] mb-1">Hospital Number</p>
                        <p className="text-[16px] font-black text-[var(--text-primary)] tracking-tight">{selectedPatient.hospitalNumber}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase text-[var(--text-tertiary)] mb-1">Laboratory Number</p>
                        <p className="text-[16px] font-black text-[var(--text-primary)] tracking-tight">{selectedPatient.labNumber}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
                  <div className="space-y-3">
                    <span className="text-[11px] font-black uppercase tracking-[0.1em] text-[var(--text-tertiary)] ml-1">Full Clinical History</span>
                    <div className="bg-[var(--surface-raised)] p-6 rounded-[28px] border border-[var(--surface-border)] text-[15px] font-medium text-[var(--text-primary)] leading-relaxed shadow-sm min-h-[220px]">
                      {selectedPatient.detailedHistory || "Detailed clinical history has not been fully documented in the LIMS yet."}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <span className="text-[11px] font-black uppercase tracking-[0.1em] text-[var(--text-tertiary)] ml-1">Medication History</span>
                    <div className="bg-[var(--surface-raised)] p-6 rounded-[28px] border border-[var(--surface-border)] shadow-sm">
                      {selectedPatient.medications.map((item) => (
                        <div key={item.name} className="mb-5 last:mb-0 pb-4 border-b border-[var(--surface-border)] border-opacity-50 last:border-0 last:pb-0">
                          <p className="text-[15px] font-black text-[var(--text-primary)]">{item.name}</p>
                          <p className="text-[13px] text-[var(--text-secondary)] font-bold mt-1 uppercase tracking-tight">{item.dose}</p>
                          {item.note && <p className="text-[11px] text-[var(--text-tertiary)] mt-2 bg-[var(--surface-card)] p-3 rounded-[12px] italic border border-[var(--surface-border)] border-opacity-30">Note: {item.note}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            </TabsContent>

            <TabsContent value="results-entry" className="mt-0 outline-none">
              <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(320px,380px)_minmax(0,1fr)]">
                <section className="kl-premium-card min-w-0 p-5 sm:p-6 shadow-lg">
                  <div className="mb-5 border-b border-[var(--surface-border)] pb-4">
                    <h3 className="text-[18px] font-black text-[var(--text-primary)] tracking-tight">Select Order</h3>
                    <p className="kl-text-contain text-[13px] font-medium text-[var(--text-secondary)] mt-1 opacity-80">
                      {user.role === 'staff' ? `Showing ${activeDepartment.name} orders.` : "Select order to enter results."}
                    </p>
                  </div>

                  <div className="space-y-4">
                    {allowedOrders.length === 0 && (
                      <div className="p-10 text-center text-[14px] font-bold text-[var(--text-tertiary)] bg-[var(--surface-raised)] rounded-[24px] border border-dashed border-[var(--surface-border)] opacity-60">
                        No orders available.
                      </div>
                    )}
                    {allowedOrders.map((order) => {
                      const active = selectedOrder?.id === order.id;
                      return (
                        <button
                          key={order.id}
                          onClick={() => setSelectedOrderId(order.id)}
                          className="kl-card-interactive w-full min-w-0 rounded-[28px] border p-5 text-left transition-all"
                          style={{
                            background: active ? "var(--surface-raised)" : "transparent",
                            borderColor: active ? "var(--kl-primary)" : "var(--surface-border)",
                            boxShadow: active ? "0 10px 30px rgba(0,0,0,0.06)" : "none",
                          }}
                        >
                          <div className="flex min-w-0 flex-wrap items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="kl-text-contain text-[15px] font-black text-[var(--text-primary)] leading-snug">{order.testName}</p>
                              <p className="kl-text-contain text-[11px] font-black text-[var(--text-tertiary)] mt-1 uppercase tracking-widest">
                                {order.testCode} • {order.department}
                              </p>
                            </div>
                            <span className="shrink-0 rounded-full bg-[var(--surface-card)] border border-[var(--surface-border)] px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[var(--text-secondary)]">
                              {statusLabel(order.status)}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </section>

                <section className="kl-premium-card min-w-0 p-6 sm:p-10 shadow-xl border-[var(--surface-border)]">
                  {selectedOrder ? (
                    <div>
                      <h3 className="mb-6 text-[22px] font-black text-[var(--text-primary)] flex items-center gap-3 tracking-tight">
                        <div className="size-3 rounded-full bg-[var(--kl-primary)] shadow-glow"></div>
                        Enter Results: <span className="opacity-70 font-medium">{selectedOrder.testName}</span>
                      </h3>
                      <div className="bg-[var(--surface-raised)] p-8 rounded-[32px] border border-[var(--surface-border)] shadow-sm">
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-10">
                          <div className="space-y-1.5">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)]">Department</p>
                            <p className="text-[15px] font-bold text-[var(--text-primary)]">{selectedOrder.department}</p>
                          </div>
                          <div className="space-y-1.5">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)]">Specimen</p>
                            <p className="text-[15px] font-bold text-[var(--text-primary)]">{selectedOrder.specimen}</p>
                          </div>
                          <div className="space-y-1.5">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)]">Priority</p>
                            <div className="flex items-center gap-2">
                              <span className={`size-2.5 rounded-full ${selectedOrder.priority === 'stat' ? 'bg-[#b14343]' : 'bg-[#9a6115]'} shadow-sm`}></span>
                              <p className="text-[15px] font-black uppercase text-[var(--text-primary)] tracking-widest">{selectedOrder.priority}</p>
                            </div>
                          </div>
                        </div>

                        {canEnterResults ? (
                          <div className="border-t border-[var(--surface-border)] border-opacity-50 pt-10 mt-6">
                            <h4 className="text-[15px] font-black text-[var(--text-primary)] mb-6 uppercase tracking-tight">Add Parameter Result</h4>
                            <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr_auto] gap-5 items-end">
                              <div className="space-y-2.5">
                                <label className="block text-[10px] font-black text-[var(--text-tertiary)] px-2 tracking-widest uppercase">Parameter Name</label>
                                <input className="input h-14 w-full rounded-[20px] bg-[var(--surface-card)] border-[var(--surface-border)] focus:bg-white dark:focus:bg-black focus:border-[var(--kl-primary)] focus:ring-4 focus:ring-[var(--kl-primary)] focus:ring-opacity-10 text-[15px] font-bold px-5 transition-all" value={draftParameter} onChange={(e) => setDraftParameter(e.target.value)} placeholder="e.g. Haemoglobin" />
                              </div>
                              <div className="space-y-2.5">
                                <label className="block text-[10px] font-black text-[var(--text-tertiary)] px-2 tracking-widest uppercase">Measured Value</label>
                                <input className="input h-14 w-full rounded-[20px] bg-[var(--surface-card)] border-[var(--surface-border)] focus:bg-white dark:focus:bg-black focus:border-[var(--kl-primary)] focus:ring-4 focus:ring-[var(--kl-primary)] focus:ring-opacity-10 text-[15px] font-bold px-5 transition-all" value={draftValue} onChange={(e) => setDraftValue(e.target.value)} placeholder="e.g. 14.5" />
                              </div>
                              <button onClick={saveDraft} className="btn-primary h-14 px-8 rounded-[20px] text-[15px] font-black shadow-lg hover:translate-y-[-2px] active:translate-y-[0px] active:scale-95 transition-all">
                                Submit for Validation
                              </button>
                            </div>
                            <div className="mt-8 flex items-center gap-3 bg-[var(--surface-card)] w-fit px-5 py-2.5 rounded-full border border-[var(--surface-border)] shadow-xs">
                              <TickCircle size={16} variant="Bold" className="text-[var(--kl-primary)]" />
                              <p className="text-[12px] font-bold text-[var(--text-secondary)]">Result will be routed to supervisor for approval before release.</p>
                            </div>
                          </div>
                        ) : (
                          <div className="p-10 bg-[var(--surface-card)] rounded-[32px] text-center border border-[var(--surface-border)] mt-6 shadow-inner">
                            <Warning2 size={32} className="mx-auto mb-3 text-[var(--text-tertiary)] opacity-30" />
                            <p className="text-[16px] font-black text-[var(--text-secondary)] opacity-60">Validation Mode: Staff access only.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center flex-col text-[var(--text-tertiary)] py-24 opacity-20">
                      <DocumentUpload size={64} className="mb-4" />
                      <p className="text-[20px] font-black uppercase tracking-[0.2em]">Select Order</p>
                    </div>
                  )}
                </section>
              </div>
            </TabsContent>

            <TabsContent value="results-dashboard" className="mt-0 outline-none">
              <section className="kl-premium-card min-w-0 p-6 sm:p-10 shadow-xl">
                <div className="flex justify-between items-center mb-8 border-b border-[var(--surface-border)] pb-6">
                  <div>
                    <h3 className="text-[22px] font-black text-[var(--text-primary)] tracking-tight">LIMS Results Dashboard</h3>
                    <p className="text-[14px] font-medium text-[var(--text-secondary)] mt-1 opacity-70">Monitor validation queue and finalized reports.</p>
                  </div>
                  {canApproveResults && (
                    <div className="bg-[var(--surface-raised)] px-5 py-2 rounded-full border border-[var(--surface-border)] flex items-center gap-2 shadow-xs">
                        <StatusUp size={16} className="text-[#9a6115]" />
                        <span className="text-[13px] font-black text-[var(--text-primary)] uppercase tracking-tighter">{allDeptDrafts.length} <span className="font-bold opacity-60 text-[11px]">in queue</span></span>
                    </div>
                  )}
                </div>

                <div className="space-y-10">
                  {/* PENDING APPROVALS */}
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <h4 className="text-[16px] font-black text-[#9a6115] flex items-center gap-2.5 uppercase tracking-tight">
                        <Timer size={20} variant="Bold" />
                        Awaiting Supervisor Validation
                      </h4>
                      <span className="bg-[#9a6115] text-white px-3 py-0.5 rounded-full flex items-center justify-center text-[11px] font-black shadow-sm">{patientDrafts.length}</span>
                    </div>
                    {patientDrafts.length > 0 ? (
                      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                        {patientDrafts.map(draft => (
                          <div key={draft.id} className="bg-[#fff0db] dark:bg-[rgba(154,97,21,0.06)] border-2 border-[#f3c26f] border-opacity-40 p-6 rounded-[32px] shadow-sm flex flex-col justify-between hover:border-opacity-100 transition-all group">
                            <div>
                              <div className="flex justify-between items-start mb-3">
                                <span className="text-[12px] font-black uppercase tracking-[0.1em] text-[#9a6115] group-hover:tracking-[0.15em] transition-all">{draft.parameter}</span>
                                <span className="text-[9px] font-black bg-[#f3c26f] bg-opacity-40 text-[#9a6115] px-2.5 py-1 rounded-full uppercase tracking-widest">Pending</span>
                              </div>
                              <div className="text-[36px] font-black text-[var(--text-primary)] mb-5 leading-none tracking-tighter">{draft.value}</div>
                            </div>
                            {canApproveResults ? (
                              <button onClick={() => approveDraft(draft.id)} className="w-full bg-[#9a6115] hover:bg-[#805010] text-white py-3 rounded-[18px] text-[14px] font-black transition-all shadow-md active:scale-95 hover:shadow-lg">
                                Validate & Release
                              </button>
                            ) : (
                              <div className="text-[12px] font-bold text-[#9a6115] opacity-60 italic border-t border-[#f3c26f] border-opacity-30 pt-4 flex items-center gap-2">
                                <Timer size={14} />
                                Waiting for review
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-16 bg-[var(--surface-raised)] rounded-[32px] border-2 border-dashed border-[var(--surface-border)] opacity-60">
                        <TickCircle size={48} className="mb-3 text-[var(--kl-primary)] opacity-40" />
                        <p className="text-[16px] font-black text-[var(--text-secondary)] uppercase tracking-[0.15em]">Queue Clear</p>
                        <p className="text-[13px] font-medium text-[var(--text-tertiary)] mt-1">All results for this patient have been processed.</p>
                      </div>
                    )}
                  </div>

                  {/* FINALIZED RESULTS */}
                  <div>
                    <h4 className="text-[16px] font-black text-[var(--text-primary)] flex items-center gap-2.5 mb-6 uppercase tracking-tight">
                      <TickCircle size={20} variant="Bold" className="text-[#1c7b56]" />
                      Finalized Laboratory Results
                    </h4>
                    
                    <div className="bg-[var(--surface-raised)] border border-[var(--surface-border)] rounded-[32px] overflow-hidden shadow-inner">
                      <table className="w-full text-left text-[14px]">
                        <thead>
                          <tr className="border-b border-[var(--surface-border)] bg-[var(--surface-card)] text-[var(--text-tertiary)] border-opacity-50">
                            <th className="font-black p-5 text-[10px] uppercase tracking-[0.2em]">Parameter</th>
                            <th className="font-black p-5 text-[10px] uppercase tracking-[0.2em]">Value</th>
                            <th className="font-black p-5 hidden sm:table-cell text-[10px] uppercase tracking-[0.2em]">Ref Range</th>
                            <th className="font-black p-5 text-[10px] uppercase tracking-[0.2em]">Flag</th>
                            <th className="font-black p-5 hidden md:table-cell text-[10px] uppercase tracking-[0.2em]">LIMS Audit</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--surface-border)] divide-opacity-30">
                          {[...allPatientResults, ...approvedDrafts.map(d => ({ ...d, flag: 'normal' as ResultFlag }))].map((result, idx) => (
                            <tr key={'id' in result ? result.id : idx} className="hover:bg-white dark:hover:bg-black dark:hover:bg-opacity-20 transition-colors group">
                              <td className="p-5 font-black text-[var(--text-primary)] group-hover:text-[var(--kl-primary)] transition-colors">{result.parameter}</td>
                              <td className="p-5 text-[var(--text-primary)] font-black text-[18px] tracking-tight">{result.value} <span className="text-[12px] font-bold opacity-40">{result.unit}</span></td>
                              <td className="p-5 text-[var(--text-secondary)] font-bold hidden sm:table-cell">{result.referenceRange}</td>
                              <td className="p-5">
                                <span className={`px-3 py-1 rounded-[10px] text-[10px] font-black uppercase tracking-widest ${FLAG_CLASS[result.flag]} shadow-xs`}>
                                  {result.flag}
                                </span>
                              </td>
                              <td className="p-5 hidden md:table-cell">
                                <div className="flex items-center gap-2 text-[#1c7b56] font-black text-[11px] uppercase tracking-tighter">
                                  <div className="size-1.5 rounded-full bg-[#1c7b56]"></div>
                                  VERIFIED
                                </div>
                              </td>
                            </tr>
                          ))}
                          {allPatientResults.length === 0 && approvedDrafts.length === 0 && (
                            <tr>
                              <td colSpan={5} className="p-20 text-center text-[var(--text-secondary)] opacity-30">
                                <DocumentUpload size={48} className="mx-auto mb-3" />
                                <p className="font-black uppercase tracking-[0.2em]">Empty Ledger</p>
                              </td>
                            </tr>
                          )}
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
