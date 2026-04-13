import { USERS, type User } from '../data/mockData';
import {
  type ReviewTask,
  type SOPDraftContent,
  type SOPWritingAssignment,
  type SOPStage,
  type UserCreationRequest,
  type ValidationTask,
  type WorkflowNotification,
  type WorkflowSOP,
  type UserRole,
} from '../types/workflow';

const STORE_KEY = 'knowlab_workflow_store_v1';

interface WorkflowStoreState {
  sops: WorkflowSOP[];
  writingAssignments: SOPWritingAssignment[];
  reviewTasks: ReviewTask[];
  validationTasks: ValidationTask[];
  userRequests: UserCreationRequest[];
  notifications: WorkflowNotification[];
}

const nowIso = () => new Date().toISOString();

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function findUser(userId: string) {
  return USERS.find(u => u.id === userId);
}

function createSeedSOP(owner: User): WorkflowSOP {
  const content: SOPDraftContent = {
    purpose: 'Standardized SOP draft for bench execution and quality traceability.',
    principle: 'Method follows validated analyzer protocol and unit QA rules.',
    equipment: ['Analyzer workstation', 'PPE', 'Calibrated pipettes'],
    reagents: ['Primary reagent kit', 'Control material level 1-3'],
    steps: [
      { stepNo: 1, title: 'Pre-check', description: 'Verify sample identity and container integrity.' },
      { stepNo: 2, title: 'Run Test', description: 'Load and process sample on validated analyzer profile.' },
      { stepNo: 3, title: 'Validate', description: 'Perform QC/flags review before result release.' },
    ],
    safetyPrecautions: ['Wear PPE', 'Treat all samples as potentially infectious'],
    relatedTests: ['FBC', 'Coagulation'],
    attachments: [],
  };

  return {
    id: uid('sop'),
    code: `SOP-${new Date().getFullYear()}-${Math.floor(Math.random() * 900 + 100)}`,
    title: 'Bench SOP Draft Template',
    unit: owner.unit,
    category: owner.unit,
    ownerId: owner.id,
    ownerName: owner.name,
    currentStage: 'draft',
    version: 1,
    lastUpdatedAt: nowIso(),
    content,
  };
}

function createInitialState(): WorkflowStoreState {
  const staff = USERS.filter(u => u.role === 'staff').slice(0, 2);
  const supervisor = USERS.find(u => u.role === 'supervisor') ?? USERS[0];
  const hod = USERS.find(u => u.role === 'hod') ?? USERS[0];
  const seededSops = staff.map(createSeedSOP);

  const reviewTask: ReviewTask = {
    id: uid('review'),
    sopId: seededSops[0].id,
    sopCode: seededSops[0].code,
    sopTitle: seededSops[0].title,
    assignedReviewerId: supervisor.id,
    assignedReviewerName: supervisor.name,
    assignedById: staff[0].id,
    assignedByName: staff[0].name,
    dueDate: new Date(Date.now() + 3 * 86400000).toISOString(),
    decision: 'pending',
    comments: '',
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };

  seededSops[0].currentStage = 'in_review';

  return {
    sops: seededSops,
    writingAssignments: [],
    reviewTasks: [reviewTask],
    validationTasks: [],
    userRequests: [],
    notifications: [
      {
        id: uid('notif'),
        title: 'SOP Submitted',
        message: `${staff[0].name} submitted ${seededSops[0].code} for supervisor review.`,
        roleTargets: ['supervisor', 'hod'],
        createdAt: nowIso(),
        readBy: [],
        level: 'info',
      },
    ],
  };
}

function loadStore(): WorkflowStoreState {
  const raw = localStorage.getItem(STORE_KEY);
  if (!raw) {
    const seed = createInitialState();
    localStorage.setItem(STORE_KEY, JSON.stringify(seed));
    return seed;
  }
  try {
    return JSON.parse(raw) as WorkflowStoreState;
  } catch {
    const seed = createInitialState();
    localStorage.setItem(STORE_KEY, JSON.stringify(seed));
    return seed;
  }
}

function saveStore(state: WorkflowStoreState) {
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
}

function pushNotification(state: WorkflowStoreState, notification: Omit<WorkflowNotification, 'id' | 'createdAt' | 'readBy'>) {
  state.notifications.unshift({
    id: uid('notif'),
    createdAt: nowIso(),
    readBy: [],
    ...notification,
  });
}

export function getWorkflowState() {
  const state = loadStore();
  if (!state.writingAssignments) {
    state.writingAssignments = [];
    saveStore(state);
  }
  return state;
}

export function createSOPDraft(input: {
  owner: User;
  code: string;
  title: string;
  unit: string;
  category: string;
  content: SOPDraftContent;
}) {
  const state = loadStore();
  const sop: WorkflowSOP = {
    id: uid('sop'),
    code: input.code,
    title: input.title,
    unit: input.unit,
    category: input.category,
    ownerId: input.owner.id,
    ownerName: input.owner.name,
    currentStage: 'draft',
    version: 1,
    lastUpdatedAt: nowIso(),
    content: input.content,
  };
  state.sops.unshift(sop);
  pushNotification(state, {
    title: 'Draft Created',
    message: `${input.owner.name} created ${sop.code} as draft.`,
    roleTargets: ['staff', 'supervisor'],
    level: 'success',
  });
  saveStore(state);
  return sop;
}

export function updateSOPDraft(sopId: string, content: SOPDraftContent, title?: string, category?: string) {
  const state = loadStore();
  const sop = state.sops.find(s => s.id === sopId);
  if (!sop) return null;
  sop.content = content;
  sop.lastUpdatedAt = nowIso();
  sop.version += 1;
  if (title) sop.title = title;
  if (category) sop.category = category;
  saveStore(state);
  return sop;
}

export function submitSOPForReview(input: {
  sopId: string;
  staffUser: User;
  reviewerId: string;
  dueDate?: string;
}) {
  const state = loadStore();
  const sop = state.sops.find(s => s.id === input.sopId);
  if (!sop) return { ok: false, error: 'SOP not found' as const };
  const reviewer = findUser(input.reviewerId);
  if (!reviewer) return { ok: false, error: 'Reviewer not found' as const };

  sop.currentStage = 'in_review';
  sop.lastUpdatedAt = nowIso();

  state.reviewTasks.unshift({
    id: uid('review'),
    sopId: sop.id,
    sopCode: sop.code,
    sopTitle: sop.title,
    assignedReviewerId: reviewer.id,
    assignedReviewerName: reviewer.name,
    assignedById: input.staffUser.id,
    assignedByName: input.staffUser.name,
    dueDate: input.dueDate,
    decision: 'pending',
    comments: '',
    createdAt: nowIso(),
    updatedAt: nowIso(),
  });

  pushNotification(state, {
    title: 'SOP Submitted for Review',
    message: `${sop.code} was submitted to ${reviewer.name}.`,
    roleTargets: ['supervisor', 'hod'],
    level: 'info',
  });

  saveStore(state);
  return { ok: true as const };
}

export function decideReviewTask(input: { taskId: string; supervisor: User; decision: 'approved' | 'changes_requested' | 'rejected'; comments: string; hodId?: string; }) {
  const state = loadStore();
  const task = state.reviewTasks.find(t => t.id === input.taskId);
  if (!task) return { ok: false, error: 'Review task not found' as const };
  const sop = state.sops.find(s => s.id === task.sopId);
  if (!sop) return { ok: false, error: 'SOP not found' as const };

  task.decision = input.decision;
  task.comments = input.comments;
  task.updatedAt = nowIso();

  if (input.decision === 'approved') {
    const hod = findUser(input.hodId || USERS.find(u => u.role === 'hod')?.id || '');
    if (!hod) return { ok: false, error: 'HOD not found' as const };
    sop.currentStage = 'awaiting_hod_validation';
    state.validationTasks.unshift({
      id: uid('validate'),
      sopId: sop.id,
      sopCode: sop.code,
      sopTitle: sop.title,
      assignedHodId: hod.id,
      assignedHodName: hod.name,
      assignedById: input.supervisor.id,
      assignedByName: input.supervisor.name,
      dueDate: new Date(Date.now() + 5 * 86400000).toISOString(),
      decision: 'pending',
      notes: '',
      createdAt: nowIso(),
      updatedAt: nowIso(),
    });
    pushNotification(state, {
      title: 'SOP Sent to HOD',
      message: `${sop.code} is awaiting HOD validation.`,
      roleTargets: ['hod', 'staff', 'supervisor'],
      level: 'info',
    });
  } else if (input.decision === 'changes_requested') {
    sop.currentStage = 'changes_requested';
    pushNotification(state, {
      title: 'SOP Changes Requested',
      message: `${sop.code} requires revision before approval.`,
      roleTargets: ['staff', 'supervisor'],
      level: 'warning',
    });
  } else {
    sop.currentStage = 'archived';
    pushNotification(state, {
      title: 'SOP Rejected',
      message: `${sop.code} was rejected during supervisor review.`,
      roleTargets: ['staff', 'supervisor'],
      level: 'danger',
    });
  }
  sop.lastUpdatedAt = nowIso();
  saveStore(state);
  return { ok: true as const };
}

export function decideValidationTask(input: { taskId: string; hod: User; decision: 'approved' | 'changes_requested' | 'rejected'; notes: string; }) {
  const state = loadStore();
  const task = state.validationTasks.find(t => t.id === input.taskId);
  if (!task) return { ok: false, error: 'Validation task not found' as const };
  const sop = state.sops.find(s => s.id === task.sopId);
  if (!sop) return { ok: false, error: 'SOP not found' as const };

  task.decision = input.decision;
  task.notes = input.notes;
  task.updatedAt = nowIso();

  if (input.decision === 'approved') {
    sop.currentStage = 'validated_published';
    pushNotification(state, {
      title: 'SOP Published',
      message: `${sop.code} has been validated and published by HOD.`,
      roleTargets: ['staff', 'supervisor', 'hod'],
      level: 'success',
    });
  } else if (input.decision === 'changes_requested') {
    sop.currentStage = 'changes_requested';
    pushNotification(state, {
      title: 'HOD Requested SOP Changes',
      message: `${sop.code} needs revision before publication.`,
      roleTargets: ['staff', 'supervisor'],
      level: 'warning',
    });
  } else {
    sop.currentStage = 'archived';
    pushNotification(state, {
      title: 'SOP Rejected by HOD',
      message: `${sop.code} was rejected at validation stage.`,
      roleTargets: ['staff', 'supervisor', 'hod'],
      level: 'danger',
    });
  }

  sop.lastUpdatedAt = nowIso();
  saveStore(state);
  return { ok: true as const };
}

export function createUserRequest(input: {
  requester: User;
  requestedUserName: string;
  requestedUserEmail: string;
  requestedUserRole: UserRole;
  requestedUnit: string;
}) {
  const state = loadStore();
  const req: UserCreationRequest = {
    id: uid('userreq'),
    requesterId: input.requester.id,
    requesterName: input.requester.name,
    requestedUserName: input.requestedUserName,
    requestedUserEmail: input.requestedUserEmail.toLowerCase(),
    requestedUserRole: input.requestedUserRole,
    requestedUnit: input.requestedUnit,
    decision: 'pending',
    decisionNotes: '',
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  state.userRequests.unshift(req);
  pushNotification(state, {
    title: 'User Creation Request Submitted',
    message: `${input.requester.name} requested ${req.requestedUserEmail} (${req.requestedUserRole}).`,
    roleTargets: ['hod', 'supervisor'],
    level: 'info',
  });
  saveStore(state);
  return req;
}

export function decideUserRequest(input: {
  requestId: string;
  hod: User;
  decision: 'approved' | 'rejected';
  notes: string;
}) {
  const state = loadStore();
  const req = state.userRequests.find(r => r.id === input.requestId);
  if (!req) return { ok: false, error: 'Request not found' as const };
  req.decision = input.decision;
  req.decisionNotes = input.notes;
  req.decidedById = input.hod.id;
  req.decidedByName = input.hod.name;
  req.updatedAt = nowIso();

  pushNotification(state, {
    title: input.decision === 'approved' ? 'User Request Approved' : 'User Request Rejected',
    message: `${req.requestedUserEmail} request was ${input.decision}.`,
    roleTargets: ['hod', 'supervisor'],
    level: input.decision === 'approved' ? 'success' : 'warning',
  });
  saveStore(state);
  return { ok: true as const };
}

export function createUserByHod(input: {
  hod: User;
  requestedUserName: string;
  requestedUserEmail: string;
  requestedUserRole: UserRole;
  requestedUnit: string;
  notes?: string;
}) {
  const state = loadStore();
  const req: UserCreationRequest = {
    id: uid('userreq'),
    requesterId: input.hod.id,
    requesterName: input.hod.name,
    requestedUserName: input.requestedUserName,
    requestedUserEmail: input.requestedUserEmail.toLowerCase(),
    requestedUserRole: input.requestedUserRole,
    requestedUnit: input.requestedUnit,
    decision: 'approved',
    decisionNotes: input.notes ?? 'Created directly by HOD',
    decidedById: input.hod.id,
    decidedByName: input.hod.name,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  state.userRequests.unshift(req);
  pushNotification(state, {
    title: 'HOD Created User',
    message: `${req.requestedUserEmail} was created directly by HOD.`,
    roleTargets: ['hod', 'supervisor'],
    level: 'success',
  });
  saveStore(state);
  return req;
}

export function markNotificationRead(notificationId: string, userId: string) {
  const state = loadStore();
  const n = state.notifications.find(x => x.id === notificationId);
  if (!n) return;
  if (!n.readBy.includes(userId)) n.readBy.push(userId);
  saveStore(state);
}

export function assignSOPWritingTask(input: {
  supervisor: User;
  staffId: string;
  title: string;
  dueDate?: string;
}) {
  const state = loadStore();
  const staff = findUser(input.staffId);
  if (!staff) return { ok: false, error: 'Staff not found' as const };
  state.writingAssignments.unshift({
    id: uid('assign'),
    title: input.title,
    assignedStaffId: staff.id,
    assignedStaffName: staff.name,
    assignedById: input.supervisor.id,
    assignedByName: input.supervisor.name,
    dueDate: input.dueDate,
    status: 'pending',
    createdAt: nowIso(),
  });
  pushNotification(state, {
    title: 'SOP Writing Assignment',
    message: `${staff.name} assigned to draft: "${input.title}".`,
    roleTargets: ['staff', 'supervisor'],
    level: 'info',
  });
  saveStore(state);
  return { ok: true as const };
}

export function getStageBadge(stage: SOPStage) {
  if (stage === 'validated_published') return { label: 'Published', tone: 'success' as const };
  if (stage === 'awaiting_hod_validation') return { label: 'Awaiting HOD', tone: 'info' as const };
  if (stage === 'changes_requested') return { label: 'Changes Requested', tone: 'warning' as const };
  if (stage === 'in_review') return { label: 'In Review', tone: 'info' as const };
  if (stage === 'archived') return { label: 'Archived', tone: 'danger' as const };
  return { label: 'Draft', tone: 'neutral' as const };
}
