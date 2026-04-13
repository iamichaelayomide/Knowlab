export type UserRole = 'staff' | 'supervisor' | 'hod';

export type SOPStage =
  | 'draft'
  | 'in_review'
  | 'changes_requested'
  | 'awaiting_hod_validation'
  | 'validated_published'
  | 'archived';

export type TaskDecision = 'pending' | 'approved' | 'changes_requested' | 'rejected';

export interface SOPDraftContent {
  purpose: string;
  principle: string;
  equipment: string[];
  reagents: string[];
  steps: Array<{ stepNo: number; title: string; description: string }>;
  safetyPrecautions: string[];
  relatedTests: string[];
  attachments: Array<{ label: string; url: string }>;
}

export interface WorkflowSOP {
  id: string;
  code: string;
  title: string;
  unit: string;
  category: string;
  ownerId: string;
  ownerName: string;
  currentStage: SOPStage;
  version: number;
  lastUpdatedAt: string;
  content: SOPDraftContent;
}

export interface ReviewTask {
  id: string;
  sopId: string;
  sopCode: string;
  sopTitle: string;
  assignedReviewerId: string;
  assignedReviewerName: string;
  assignedById: string;
  assignedByName: string;
  dueDate?: string;
  decision: TaskDecision;
  comments: string;
  createdAt: string;
  updatedAt: string;
}

export interface ValidationTask {
  id: string;
  sopId: string;
  sopCode: string;
  sopTitle: string;
  assignedHodId: string;
  assignedHodName: string;
  assignedById: string;
  assignedByName: string;
  dueDate?: string;
  decision: TaskDecision;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface SOPWritingAssignment {
  id: string;
  title: string;
  assignedStaffId: string;
  assignedStaffName: string;
  assignedById: string;
  assignedByName: string;
  dueDate?: string;
  status: 'pending' | 'in_progress' | 'submitted';
  createdAt: string;
}

export interface UserCreationRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  requestedUserName: string;
  requestedUserEmail: string;
  requestedUserRole: UserRole;
  requestedUnit: string;
  decision: TaskDecision;
  decisionNotes: string;
  decidedById?: string;
  decidedByName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowNotification {
  id: string;
  title: string;
  message: string;
  roleTargets: UserRole[];
  createdAt: string;
  readBy: string[];
  level: 'info' | 'success' | 'warning' | 'danger';
}
