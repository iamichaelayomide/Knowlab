import { useMemo, useState } from "react";
import { useLocation, useParams } from "react-router";
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
import { readOfflineResultDrafts, saveOfflineResultDraft } from "../../services/offlineDrafts";
import { openFloatingAI } from "../../services/aiWidget";

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
  const { user } = useAuth();
  const { activeDepartment, activeBench } = useDepartment();
  const location = useLocation();
  const [search, setSearch] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [draftValue, setDraftValue] = useState("");
  const [draftParameter, setDraftParameter] = useState("Result");
  const [drafts, setDrafts] = useState(() => readOfflineResultDrafts());

  const base = location.pathname.startsWith("/supervisor") ? "/supervisor" : location.pathname.startsWith("/hod") ? "/hod" : "/staff";
  const scopedPatients = useMemo(
    () => (user ? scopePatients(user.role, user.unit, activeDepartment.name) : []),
    [activeDepartment.name, user],
  );
  const filteredPatients = scopedPatients.filter((patient) => {
    const term = search.toLowerCase();
    return (
      patient.name.toLowerCase().includes(term) ||
      patient.hospitalNumber.toLowerCase().includes(term) ||
      patient.ward.toLowerCase().includes(term) ||
      patient.summary.toLowerCase().includes(term)
    );
  });

  const selectedPatient = PATIENTS.find((patient) => patient.id === patientId) ?? filteredPatients[0];
  const orders = selectedPatient ? getPatientOrders(selectedPatient.id) : [];
  const selectedOrder = orders.find((order) => order.id === selectedOrderId) ?? orders[0];
  const results = selectedOrder ? getOrderResults(selectedOrder.id) : [];
  const notes = selectedPatient ? getPatientNotes(selectedPatient.id) : [];
  const patientDrafts = selectedPatient ? drafts.filter((draft) => draft.patientId === selectedPatient.id) : [];

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
      createdAt: new Date().toISOString(),
    });
    setDrafts(next);
    setDraftValue("");
  };

  if (!user || !selectedPatient) return null;

  const canEnterResults = user.role === "staff";
  const scopeCopy =
    user.role === "hod"
      ? "Lab-wide patient, order, and result visibility."
      : user.role === "supervisor"
        ? `${activeDepartment.shortName} oversight focused on bench workload and held results.`
        : `${activeBench.shortName} bench workspace for patient lookup and result entry.`;

  return (
    <div className="kl-page min-h-full max-w-full overflow-x-hidden">
      <div className="mb-6 flex min-w-0 flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-[24px] font-semibold text-[var(--text-primary)]">Patients</h1>
          <p className="kl-text-contain text-[14px] text-[var(--text-secondary)]">{scopeCopy}</p>
        </div>
        <button
          className="btn-primary inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-full px-4 text-[13px] font-semibold"
          onClick={() => openFloatingAI(`Summarize patient laboratory priorities for ${selectedPatient.name} without repeating identifiers.`)}
        >
          <Health size={15} />
          Ask AI
        </button>
      </div>

      <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(280px,330px)_minmax(0,1fr)]">
        <aside className="kl-premium-card min-w-0 p-3">
          <div className="relative mb-3">
            <SearchNormal1 size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="input h-11 rounded-[20px] bg-[var(--surface-raised)] pl-10"
              placeholder="Search patients..."
            />
          </div>
          <div className="space-y-2">
            {filteredPatients.map((patient) => {
              const active = patient.id === selectedPatient.id;
              const count = getPatientOrders(patient.id).length;
              return (
                <a
                  key={patient.id}
                  href={`${base}/patients/${patient.id}`}
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
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--text-tertiary)]">Patient summary</p>
                <h2 className="kl-text-contain text-[26px] font-semibold leading-tight text-[var(--text-primary)]">{selectedPatient.name}</h2>
                <p className="kl-text-contain mt-1 text-[13px] text-[var(--text-secondary)]">
                  {selectedPatient.age} years | {selectedPatient.sex} | {selectedPatient.ward} | {selectedPatient.clinician}
                </p>
                <p className="kl-text-contain mt-4 max-w-3xl text-[14px] leading-relaxed text-[var(--text-secondary)]">{selectedPatient.summary}</p>
              </div>
              <div className="grid w-full min-w-0 grid-cols-2 gap-2 lg:w-[240px] lg:shrink-0">
                <div className="rounded-[20px] border border-[var(--surface-border)] bg-[var(--glass-bg)] p-3">
                  <p className="text-[11px] text-[var(--text-tertiary)]">Orders</p>
                  <p className="text-[24px] font-semibold text-[var(--text-primary)]">{orders.length}</p>
                </div>
                <div className="rounded-[20px] border border-[var(--surface-border)] bg-[var(--glass-bg)] p-3">
                  <p className="text-[11px] text-[var(--text-tertiary)]">Drafts</p>
                  <p className="text-[24px] font-semibold text-[var(--text-primary)]">{patientDrafts.length}</p>
                </div>
              </div>
            </div>
          </section>

          <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)]">
            <section className="kl-premium-card min-w-0 p-4 sm:p-5">
              <div className="mb-4 flex min-w-0 items-center justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-[16px] font-semibold text-[var(--text-primary)]">Ordered tests</h3>
                  <p className="kl-text-contain text-[12px] text-[var(--text-secondary)]">Result entry stays local/offline until the real LIMS sync layer is connected.</p>
                </div>
                {canEnterResults && (
                  <button className="kl-button-soft inline-flex h-9 shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-3 text-[12px]">
                    <Add size={14} />
                    New order
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {orders.map((order) => {
                  const active = selectedOrder?.id === order.id;
                  return (
                    <button
                      key={order.id}
                      onClick={() => setSelectedOrderId(order.id)}
                      className="kl-card-interactive w-full min-w-0 rounded-[24px] border p-4 text-left"
                      style={{
                        background: active ? "var(--surface-raised)" : "transparent",
                        borderColor: active ? "var(--surface-border-strong)" : "var(--surface-border)",
                      }}
                    >
                      <div className="flex min-w-0 flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="kl-text-contain text-[14px] font-semibold text-[var(--text-primary)]">{order.testName}</p>
                          <p className="kl-text-contain text-[12px] text-[var(--text-secondary)]">
                            {order.testCode} | {order.specimen} | {order.ward}
                          </p>
                        </div>
                        <span className="shrink-0 rounded-full bg-[var(--kl-surface-tinted)] px-2.5 py-1 text-[11px] font-semibold capitalize text-[var(--text-primary)]">
                          {statusLabel(order.status)}
                        </span>
                      </div>
                      <p className="kl-text-contain mt-3 text-[12px] text-[var(--text-secondary)]">Indication: {order.indication}</p>
                    </button>
                  );
                })}
              </div>

              {selectedOrder && (
                <div className="mt-5 rounded-[24px] border border-[var(--surface-border)] bg-[var(--surface-raised)] p-4">
                  <h4 className="mb-3 text-[14px] font-semibold text-[var(--text-primary)]">Results for {selectedOrder.testCode}</h4>
                  <div className="space-y-2">
                    {results.map((result) => (
                      <div key={result.id} className="grid grid-cols-[1fr_auto] gap-3 rounded-[18px] bg-[var(--surface-card)] p-3">
                        <div>
                          <p className="text-[13px] font-medium text-[var(--text-primary)]">{result.parameter}</p>
                          <p className="text-[11px] text-[var(--text-secondary)]">Range: {result.referenceRange}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[14px] font-semibold text-[var(--text-primary)]">
                            {result.value} {result.unit}
                          </p>
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${FLAG_CLASS[result.flag]}`}>{result.flag}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {canEnterResults && (
                    <div className="mt-4 grid min-w-0 gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
                      <input className="input h-10 rounded-[18px]" value={draftParameter} onChange={(e) => setDraftParameter(e.target.value)} placeholder="Parameter" />
                      <input className="input h-10 rounded-[18px]" value={draftValue} onChange={(e) => setDraftValue(e.target.value)} placeholder="Value" />
                      <button onClick={saveDraft} className="btn-primary h-10 whitespace-nowrap rounded-full px-4 text-[12px]">
                        Save offline
                      </button>
                    </div>
                  )}
                </div>
              )}
            </section>

            <aside className="min-w-0 space-y-4">
              <section className="kl-premium-card min-w-0 p-4">
                <h3 className="mb-3 text-[15px] font-semibold text-[var(--text-primary)]">Medical context</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.08em] text-[var(--text-tertiary)]">Diagnoses</p>
                    {selectedPatient.diagnoses.map((item) => (
                      <p key={item.label} className="kl-text-contain mt-1 text-[13px] text-[var(--text-primary)]">
                        {item.label} <span className="text-[var(--text-tertiary)]">({item.status})</span>
                      </p>
                    ))}
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.08em] text-[var(--text-tertiary)]">Medication</p>
                    {selectedPatient.medications.map((item) => (
                      <p key={item.name} className="kl-text-contain mt-1 text-[13px] text-[var(--text-primary)]">
                        {item.name} <span className="text-[var(--text-secondary)]">{item.dose}</span>
                      </p>
                    ))}
                  </div>
                </div>
              </section>

              <section className="kl-premium-card min-w-0 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-[15px] font-semibold text-[var(--text-primary)]">Case notes</h3>
                  <button className="kl-icon-button" aria-label="Attach case note">
                    <Gallery size={15} />
                  </button>
                </div>
                <div className="space-y-2">
                  {notes.map((note) => (
                    <div key={note.id} className="rounded-[18px] bg-[var(--surface-raised)] p-3">
                      <div className="mb-1 flex items-center gap-2 text-[11px] text-[var(--text-tertiary)]">
                        <NoteText size={12} />
                        {formatDate(note.createdAt)}
                      </div>
                      <p className="kl-text-contain text-[12px] leading-relaxed text-[var(--text-secondary)]">{note.text}</p>
                      {note.attachmentName && <p className="kl-one-line mt-2 text-[11px] text-[var(--text-primary)]">{note.attachmentName}</p>}
                    </div>
                  ))}
                </div>
              </section>

              <section className="kl-premium-card min-w-0 p-4">
                <div className="mb-3 flex items-center gap-2">
                  {patientDrafts.length ? <Warning2 size={15} className="text-[#9a6115]" /> : <TickCircle size={15} className="text-[#1c7b56]" />}
                  <h3 className="text-[15px] font-semibold text-[var(--text-primary)]">Offline drafts</h3>
                </div>
                {patientDrafts.length ? (
                  <div className="min-w-0 space-y-2">
                    {patientDrafts.map((draft) => (
                      <div key={draft.id} className="kl-text-contain rounded-[16px] bg-[var(--surface-raised)] p-3 text-[12px] text-[var(--text-secondary)]">
                        {draft.parameter}: <span className="font-semibold text-[var(--text-primary)]">{draft.value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[12px] text-[var(--text-secondary)]">No offline drafts for this patient.</p>
                )}
                <button className="mt-3 kl-button-soft inline-flex h-9 items-center gap-2 rounded-full px-3 text-[12px]">
                  <DocumentUpload size={14} />
                  Snap case note
                </button>
              </section>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}
