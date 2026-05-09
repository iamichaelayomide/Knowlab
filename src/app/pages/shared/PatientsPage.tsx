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
  Filter,
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
      // Logic: Patient has at least one order in the current department that is not yet 'verified' or 'resulted'
      const hasPendingInDept = patientOrders.some(o => {
        const isDeptMatch = user?.role === 'staff' ? o.department === activeDepartment.name : true;
        const isPending = ['ordered', 'collected', 'processing', 'held'].includes(o.status);
        return isDeptMatch && isPending;
      });
      return hasPendingInDept;
    }

    return true;
  });

  const selectedPatient = PATIENTS.find((patient) => patient.id === patientId) ?? filteredPatients[0];
  const orders = selectedPatient ? getPatientOrders(selectedPatient.id) : [];
  
  // Enforce department access for Results Entry
  const allowedOrders = user?.role === "staff" && activeDepartment.name !== "Laboratory"
    ? orders.filter(o => o.department === activeDepartment.name)
    : orders;
    
  const selectedOrder = allowedOrders.find((order) => order.id === selectedOrderId) ?? allowedOrders[0];
  
  // All results for the selected patient
  const allPatientResults = orders.flatMap(o => getOrderResults(o.id));
  const results = selectedOrder ? getOrderResults(selectedOrder.id) : [];
  const notes = selectedPatient ? getPatientNotes(selectedPatient.id) : [];
  
  // Pending results (Drafts)
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
    <div className="kl-page min-h-full max-w-full overflow-x-hidden">
      <div className="mb-6 flex min-w-0 flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-[24px] font-semibold text-[var(--text-primary)]">LIMS Patient Portal</h1>
          <p className="kl-text-contain text-[14px] text-[var(--text-secondary)]">{scopeCopy}</p>
        </div>
        <button
          className="btn-primary inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-full px-4 text-[13px] font-semibold"
          onClick={() => openFloatingAI(`Summarize patient laboratory priorities and detailed history for ${selectedPatient.name}.`)}
        >
          <Health size={15} />
          AI Case Summary
        </button>
      </div>

      <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(280px,330px)_minmax(0,1fr)]">
        <aside className="kl-premium-card min-w-0 p-3 h-[calc(100vh-140px)] overflow-y-auto">
          <div className="flex items-center gap-2 mb-3">
            <div className="relative flex-1">
              <SearchNormal1 size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="input h-11 rounded-[20px] bg-[var(--surface-raised)] pl-10 pr-4 w-full"
                placeholder="Search..."
              />
            </div>
            <button
              onClick={() => setFilterPending(!filterPending)}
              className={`kl-icon-button size-11 flex-shrink-0 rounded-[18px] border transition-all ${
                filterPending 
                ? "bg-[var(--kl-primary)] text-white border-[var(--kl-primary)] shadow-md" 
                : "bg-[var(--surface-raised)] text-[var(--text-secondary)] border-[var(--surface-border)]"
              }`}
              title={filterPending ? "Showing pending only" : "Filter pending results"}
            >
              <Timer size={18} variant={filterPending ? "Bold" : "Linear"} />
            </button>
          </div>
          <div className="space-y-2">
            {filteredPatients.map((patient) => {
              const active = patient.id === selectedPatient.id;
              const count = getPatientOrders(patient.id).length;
              return (
                <a
                  key={patient.id}
                  href={`${base}/patients/${patient.id}`}
                  onClick={(e) => { e.preventDefault(); navigate(`${base}/patients/${patient.id}`); }}
                  className="kl-card-interactive flex items-center gap-3 rounded-[22px] border p-3 no-underline"
                  style={{
                    background: active ? "var(--surface-card)" : "transparent",
                    borderColor: active ? "var(--surface-border-strong)" : "transparent",
                  }}
                >
                  <span className="grid size-11 place-items-center rounded-[18px] border border-[var(--surface-border)] bg-[var(--surface-raised)] text-[var(--text-primary)]">
                    <Profile2User size={18} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-semibold text-[var(--text-primary)]">{patient.name}</span>
                    <span className="block truncate text-[11px] text-[var(--text-secondary)]">
                      {patient.hospitalNumber} | {count} order{count === 1 ? "" : "s"}
                    </span>
                  </span>
                </a>
              );
            })}
          </div>
        </aside>

        <main className="min-w-0 space-y-4">
          <section className="kl-gradient-card kl-premium-card min-w-0 p-5 sm:p-6">
            <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--text-tertiary)]">Patient Summary</span>
                  <span className="rounded-full bg-[var(--surface-raised)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--text-primary)] border border-[var(--surface-border)]">HN: {selectedPatient.hospitalNumber}</span>
                  <span className="rounded-full bg-[var(--surface-raised)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--text-primary)] border border-[var(--surface-border)]">LAB: {selectedPatient.labNumber}</span>
                </div>
                <h2 className="kl-text-contain text-[26px] font-semibold leading-tight text-[var(--text-primary)]">{selectedPatient.name}</h2>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="kl-text-contain text-[13px] text-[var(--text-secondary)] font-medium">
                    {selectedPatient.age} years
                  </span>
                  <span className="text-[var(--surface-border-strong)]">•</span>
                  <span className="kl-text-contain text-[13px] text-[var(--text-secondary)] font-medium">
                    {selectedPatient.sex}
                  </span>
                  <span className="text-[var(--surface-border-strong)]">•</span>
                  <span className="kl-text-contain text-[13px] text-[var(--text-secondary)]">
                    {selectedPatient.ward}
                  </span>
                  <span className="text-[var(--surface-border-strong)]">•</span>
                  <span className="kl-text-contain text-[13px] text-[var(--text-secondary)]">
                    {selectedPatient.clinician}
                  </span>
                </div>
              </div>
              <div className="grid w-full min-w-0 grid-cols-2 gap-2 lg:w-[240px] lg:shrink-0">
                <div className="rounded-[20px] border border-[var(--surface-border)] bg-[var(--glass-bg)] p-3">
                  <p className="text-[11px] text-[var(--text-tertiary)]">Orders</p>
                  <p className="text-[24px] font-semibold text-[var(--text-primary)]">{orders.length}</p>
                </div>
                <div className="rounded-[20px] border border-[var(--surface-border)] bg-[var(--glass-bg)] p-3">
                  <p className="text-[11px] text-[var(--text-tertiary)]">Pending Approval</p>
                  <p className="text-[24px] font-semibold text-[var(--text-primary)]">{patientDrafts.length}</p>
                </div>
              </div>
            </div>
          </section>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="patient-info">Patient Info</TabsTrigger>
              <TabsTrigger value="results-entry">Results Entry</TabsTrigger>
              <TabsTrigger value="results-dashboard">Results Dashboard</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-0">
              <div className="grid min-w-0 gap-4 lg:grid-cols-2">
                <section className="kl-premium-card min-w-0 p-4 sm:p-5">
                  <h3 className="mb-3 text-[15px] font-semibold text-[var(--text-primary)]">Suspected Diagnosis & Symptoms</h3>
                  <div className="space-y-4">
                    <p className="text-[13px] leading-relaxed text-[var(--text-secondary)]">
                      {selectedPatient.summary}
                    </p>
                    <div className="space-y-3">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.08em] text-[var(--text-tertiary)] mb-1">Working Diagnoses</p>
                        {selectedPatient.diagnoses.map((item) => (
                          <div key={item.label} className="flex items-center justify-between py-1 border-b border-[var(--surface-border)] last:border-0">
                            <span className="text-[13px] text-[var(--text-primary)]">{item.label}</span>
                            <span className="text-[11px] text-[var(--text-tertiary)] px-2 py-0.5 bg-[var(--surface-raised)] rounded">{item.status}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                <section className="kl-premium-card min-w-0 p-4 sm:p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-[15px] font-semibold text-[var(--text-primary)]">Case Notes</h3>
                    <button className="kl-icon-button flex items-center justify-center bg-[var(--surface-raised)] p-0 size-8 rounded-full" aria-label="Attach case note" onClick={() => setActiveTab("patient-info")}>
                      <NoteText size={16} />
                    </button>
                  </div>
                  <div className="space-y-3">
                    {notes.map((note) => (
                      <div key={note.id} className="rounded-[18px] bg-[var(--surface-raised)] p-3 border border-[var(--surface-border)]">
                        <div className="mb-2 flex items-center justify-between text-[11px] text-[var(--text-tertiary)]">
                          <span className="font-medium text-[var(--text-primary)]">{note.author}</span>
                          <span>{formatDate(note.createdAt)}</span>
                        </div>
                        <p className="kl-text-contain text-[12px] leading-relaxed text-[var(--text-secondary)]">{note.text}</p>
                        {note.attachmentName && (
                          <div className="mt-3 flex items-center gap-2 bg-[var(--surface-card)] p-2 rounded-lg border border-[var(--surface-border)]">
                            <Gallery size={14} className="text-[var(--text-tertiary)]" />
                            <p className="text-[11px] font-medium text-[var(--text-primary)]">{note.attachmentName}</p>
                          </div>
                        )}
                      </div>
                    ))}
                    {notes.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-8 opacity-50">
                        <NoteText size={24} className="mb-2" />
                        <p className="text-[13px] text-[var(--text-tertiary)] text-center">No specific case notes filed.</p>
                      </div>
                    )}
                  </div>
                </section>
              </div>
            </TabsContent>

            <TabsContent value="patient-info" className="mt-0">
              <section className="kl-premium-card min-w-0 p-5">
                <h3 className="mb-4 text-[18px] font-semibold text-[var(--text-primary)] border-b border-[var(--surface-border)] pb-3">Detailed Medical History</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--text-tertiary)]">Vitals</span>
                    <div className="bg-[var(--surface-raised)] p-4 rounded-[20px] border border-[var(--surface-border)] shadow-sm">
                      <div className="flex justify-between py-1.5 border-b border-[var(--surface-border)] last:border-0">
                        <span className="text-[12px] text-[var(--text-secondary)]">Height</span>
                        <span className="text-[13px] font-semibold text-[var(--text-primary)]">{selectedPatient.height || "Not recorded"}</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-[var(--surface-border)] last:border-0">
                        <span className="text-[12px] text-[var(--text-secondary)]">Weight</span>
                        <span className="text-[13px] font-semibold text-[var(--text-primary)]">{selectedPatient.weight || "Not recorded"}</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-[var(--surface-border)] last:border-0">
                        <span className="text-[12px] text-[var(--text-secondary)]">Blood Pressure</span>
                        <span className="text-[13px] font-semibold text-[var(--text-primary)]">{selectedPatient.bloodPressure || "Not recorded"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--text-tertiary)]">Drug Reactions / Allergies</span>
                    <div className="bg-[var(--surface-raised)] p-4 rounded-[20px] border border-[var(--surface-border)] min-h-[110px] shadow-sm">
                      {selectedPatient.allergies.map(reaction => (
                        <div key={reaction} className="flex items-start gap-2 mb-2 last:mb-0">
                          <Warning2 size={14} className="text-[#b14343] shrink-0 mt-0.5" />
                          <span className="text-[13px] font-semibold text-[var(--text-primary)] leading-tight">{reaction}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--text-tertiary)]">Patient Identifiers</span>
                    <div className="bg-[var(--surface-raised)] p-4 rounded-[20px] border border-[var(--surface-border)] shadow-sm">
                      <div className="mb-3">
                        <p className="text-[10px] uppercase text-[var(--text-tertiary)] mb-0.5">Hospital Number</p>
                        <p className="text-[14px] font-bold text-[var(--text-primary)] tracking-wide">{selectedPatient.hospitalNumber}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase text-[var(--text-tertiary)] mb-0.5">Laboratory Number</p>
                        <p className="text-[14px] font-bold text-[var(--text-primary)] tracking-wide">{selectedPatient.labNumber}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6">
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--text-tertiary)]">Full Clinical History</span>
                    <div className="bg-[var(--surface-raised)] p-5 rounded-[20px] border border-[var(--surface-border)] text-[14px] text-[var(--text-primary)] leading-relaxed shadow-sm min-h-[180px]">
                      {selectedPatient.detailedHistory || "Detailed clinical history has not been fully documented in the LIMS yet."}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--text-tertiary)]">Medication History</span>
                    <div className="bg-[var(--surface-raised)] p-5 rounded-[20px] border border-[var(--surface-border)] shadow-sm">
                      {selectedPatient.medications.map((item) => (
                        <div key={item.name} className="mb-4 last:mb-0 pb-3 border-b border-[var(--surface-border)] last:border-0 last:pb-0">
                          <p className="text-[14px] font-bold text-[var(--text-primary)]">{item.name}</p>
                          <p className="text-[12px] text-[var(--text-secondary)] font-medium mt-0.5">{item.dose}</p>
                          {item.note && <p className="text-[11px] text-[var(--text-tertiary)] mt-1 bg-[var(--surface-card)] p-2 rounded-md italic">Note: {item.note}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            </TabsContent>

            <TabsContent value="results-entry" className="mt-0">
              <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(280px,360px)_minmax(0,1fr)]">
                <section className="kl-premium-card min-w-0 p-4 sm:p-5">
                  <div className="mb-4">
                    <h3 className="text-[16px] font-semibold text-[var(--text-primary)]">Select Order for Entry</h3>
                    <p className="kl-text-contain text-[12px] text-[var(--text-secondary)] mt-1">
                      {user.role === 'staff' ? `Showing ${activeDepartment.name} orders.` : "Select an order to view/enter."}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {allowedOrders.length === 0 && (
                      <div className="p-4 text-center text-[13px] text-[var(--text-secondary)] bg-[var(--surface-raised)] rounded-[16px] border border-dashed border-[var(--surface-border)]">
                        No orders available for your department/scope.
                      </div>
                    )}
                    {allowedOrders.map((order) => {
                      const active = selectedOrder?.id === order.id;
                      return (
                        <button
                          key={order.id}
                          onClick={() => setSelectedOrderId(order.id)}
                          className="kl-card-interactive w-full min-w-0 rounded-[20px] border p-4 text-left transition-colors"
                          style={{
                            background: active ? "var(--surface-raised)" : "transparent",
                            borderColor: active ? "var(--surface-border-strong)" : "var(--surface-border)",
                          }}
                        >
                          <div className="flex min-w-0 flex-wrap items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="kl-text-contain text-[14px] font-semibold text-[var(--text-primary)]">{order.testName}</p>
                              <p className="kl-text-contain text-[12px] text-[var(--text-tertiary)]">
                                {order.testCode} | {order.department}
                              </p>
                            </div>
                            <span className="shrink-0 rounded-full bg-[var(--surface-card)] border border-[var(--surface-border)] px-2.5 py-1 text-[11px] font-medium capitalize text-[var(--text-secondary)]">
                              {statusLabel(order.status)}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </section>

                <section className="kl-premium-card min-w-0 p-4 sm:p-5">
                  {selectedOrder ? (
                    <div>
                      <h3 className="mb-5 text-[18px] font-bold text-[var(--text-primary)] flex items-center gap-2">
                        <div className="size-2 rounded-full bg-[var(--kl-primary)]"></div>
                        Enter Results: {selectedOrder.testName}
                      </h3>
                      <div className="bg-[var(--surface-raised)] p-6 rounded-[24px] border border-[var(--surface-border)] shadow-sm">
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
                          <div className="space-y-1">
                            <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--text-tertiary)]">Department</p>
                            <p className="text-[14px] font-semibold text-[var(--text-primary)]">{selectedOrder.department}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--text-tertiary)]">Specimen</p>
                            <p className="text-[14px] font-semibold text-[var(--text-primary)]">{selectedOrder.specimen}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--text-tertiary)]">Priority</p>
                            <div className="flex items-center gap-1.5">
                              <span className={`size-2 rounded-full ${selectedOrder.priority === 'stat' ? 'bg-[#b14343]' : 'bg-[#9a6115]'}`}></span>
                              <p className="text-[14px] font-bold uppercase text-[var(--text-primary)] tracking-wide">{selectedOrder.priority}</p>
                            </div>
                          </div>
                        </div>

                        {canEnterResults ? (
                          <div className="border-t border-[var(--surface-border)] pt-8 mt-4">
                            <h4 className="text-[14px] font-bold text-[var(--text-primary)] mb-5">Add Parameter Result</h4>
                            <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4 items-end">
                              <div className="space-y-1.5">
                                <label className="block text-[11px] font-bold text-[var(--text-secondary)] px-1">PARAMETER NAME</label>
                                <input className="input h-12 w-full rounded-[16px] bg-[var(--surface-card)] border-[var(--surface-border)] focus:border-[var(--kl-primary)] text-[14px]" value={draftParameter} onChange={(e) => setDraftParameter(e.target.value)} placeholder="e.g. Haemoglobin" />
                              </div>
                              <div className="space-y-1.5">
                                <label className="block text-[11px] font-bold text-[var(--text-secondary)] px-1">MEASURED VALUE</label>
                                <input className="input h-12 w-full rounded-[16px] bg-[var(--surface-card)] border-[var(--surface-border)] focus:border-[var(--kl-primary)] text-[14px]" value={draftValue} onChange={(e) => setDraftValue(e.target.value)} placeholder="e.g. 14.5" />
                              </div>
                              <button onClick={saveDraft} className="btn-primary h-12 px-6 rounded-[16px] text-[14px] font-bold shadow-md hover:translate-y-[-1px] active:translate-y-[0px] transition-all">
                                Submit for Validation
                              </button>
                            </div>
                            <p className="text-[12px] text-[var(--text-tertiary)] mt-6 flex items-center gap-2 bg-[var(--surface-card)] w-fit px-3 py-1.5 rounded-full border border-[var(--surface-border)]">
                              <TickCircle size={14} className="text-[var(--kl-primary)]" />
                              Result will be routed to supervisor for approval before release.
                            </p>
                          </div>
                        ) : (
                          <div className="p-6 bg-[var(--surface-card)] rounded-[20px] text-center border border-[var(--surface-border)] mt-4">
                            <Warning2 size={24} className="mx-auto mb-2 text-[var(--text-tertiary)] opacity-50" />
                            <p className="text-[14px] font-medium text-[var(--text-secondary)]">Only laboratory staff can submit results for validation.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center flex-col text-[var(--text-tertiary)] py-16 opacity-50">
                      <DocumentUpload size={48} className="mb-4" />
                      <p className="text-[16px] font-medium">Select an order to enter results</p>
                    </div>
                  )}
                </section>
              </div>
            </TabsContent>

            <TabsContent value="results-dashboard" className="mt-0">
              <section className="kl-premium-card min-w-0 p-5">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-[18px] font-semibold text-[var(--text-primary)]">LIMS Results Dashboard</h3>
                </div>

                <div className="space-y-8">
                  {/* PENDING APPROVALS */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <h4 className="text-[15px] font-bold text-[#9a6115] flex items-center gap-2">
                        <Warning2 size={18} />
                        Awaiting Supervisor Validation
                      </h4>
                      <span className="bg-[#9a6115] text-white size-5 rounded-full flex items-center justify-center text-[10px] font-bold">{patientDrafts.length}</span>
                    </div>
                    {patientDrafts.length > 0 ? (
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {patientDrafts.map(draft => (
                          <div key={draft.id} className="bg-[#fff0db] dark:bg-[rgba(154,97,21,0.08)] border border-[#f3c26f] p-5 rounded-[24px] shadow-sm flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-start mb-2">
                                <span className="text-[12px] font-bold uppercase tracking-wider text-[#9a6115] dark:text-[#f3c26f]">{draft.parameter}</span>
                                <span className="text-[10px] font-bold bg-[#f3c26f] bg-opacity-30 text-[#9a6115] px-2 py-0.5 rounded-full uppercase">Pending</span>
                              </div>
                              <div className="text-[28px] font-black text-[var(--text-primary)] mb-4">{draft.value}</div>
                            </div>
                            {canApproveResults ? (
                              <button onClick={() => approveDraft(draft.id)} className="w-full bg-[#9a6115] hover:bg-[#805010] text-white py-2.5 rounded-[14px] text-[13px] font-bold transition-all shadow-md active:scale-95">
                                Validate & Release
                              </button>
                            ) : (
                              <div className="text-[12px] text-[var(--text-secondary)] italic border-t border-[#f3c26f] border-opacity-30 pt-3">
                                Waiting for supervisor review
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-10 bg-[var(--surface-raised)] rounded-[24px] border border-dashed border-[var(--surface-border)] opacity-60">
                        <TickCircle size={32} className="mb-2 text-[var(--text-tertiary)]" />
                        <p className="text-[14px] font-medium text-[var(--text-secondary)]">All results have been processed.</p>
                      </div>
                    )}
                  </div>

                  {/* FINALIZED RESULTS */}
                  <div>
                    <h4 className="text-[15px] font-bold text-[var(--text-primary)] flex items-center gap-2 mb-4">
                      <TickCircle size={18} className="text-[#1c7b56]" />
                      Finalized Laboratory Results
                    </h4>
                    
                    <div className="bg-[var(--surface-raised)] border border-[var(--surface-border)] rounded-[24px] overflow-hidden shadow-sm">
                      <table className="w-full text-left text-[14px]">
                        <thead>
                          <tr className="border-b border-[var(--surface-border)] bg-[var(--surface-card)] text-[var(--text-secondary)]">
                            <th className="font-bold p-4 text-[11px] uppercase tracking-wider">Parameter</th>
                            <th className="font-bold p-4 text-[11px] uppercase tracking-wider">Value</th>
                            <th className="font-bold p-4 hidden sm:table-cell text-[11px] uppercase tracking-wider">Reference Range</th>
                            <th className="font-bold p-4 text-[11px] uppercase tracking-wider">Flag</th>
                            <th className="font-bold p-4 hidden md:table-cell text-[11px] uppercase tracking-wider">LIMS Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--surface-border)]">
                          {[...allPatientResults, ...approvedDrafts.map(d => ({ ...d, flag: 'normal' as ResultFlag }))].map((result, idx) => (
                            <tr key={'id' in result ? result.id : idx} className="hover:bg-[var(--surface-card)] transition-colors">
                              <td className="p-4 font-bold text-[var(--text-primary)]">{result.parameter}</td>
                              <td className="p-4 text-[var(--text-primary)] font-black text-[16px]">{result.value} {result.unit}</td>
                              <td className="p-4 text-[var(--text-secondary)] font-medium hidden sm:table-cell">{result.referenceRange}</td>
                              <td className="p-4">
                                <span className={`px-2.5 py-1 rounded-[8px] text-[10px] font-black uppercase tracking-widest ${FLAG_CLASS[result.flag]}`}>
                                  {result.flag}
                                </span>
                              </td>
                              <td className="p-4 hidden md:table-cell">
                                <div className="flex items-center gap-1.5 text-[#1c7b56] font-bold text-[12px]">
                                  <TickCircle size={14} />
                                  VERIFIED
                                </div>
                              </td>
                            </tr>
                          ))}
                          {allPatientResults.length === 0 && approvedDrafts.length === 0 && (
                            <tr>
                              <td colSpan={5} className="p-10 text-center text-[var(--text-secondary)] opacity-50">
                                <DocumentUpload size={32} className="mx-auto mb-2" />
                                <p className="font-medium text-[15px]">No finalized results available.</p>
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
