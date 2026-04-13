import { beforeEach, describe, expect, it } from 'vitest';
import { USERS } from '../data/mockData';
import {
  createSOPDraft,
  createUserRequest,
  decideReviewTask,
  decideUserRequest,
  decideValidationTask,
  getWorkflowState,
  submitSOPForReview,
} from './workflowStore';

describe('workflowStore', () => {
  beforeEach(() => {
    localStorage.removeItem('knowlab_workflow_store_v1');
  });

  it('moves SOP from draft to review to HOD validation to published', () => {
    const staff = USERS.find(u => u.role === 'staff')!;
    const supervisor = USERS.find(u => u.role === 'supervisor')!;
    const hod = USERS.find(u => u.role === 'hod')!;

    const draft = createSOPDraft({
      owner: staff,
      code: 'WF-SOP-001',
      title: 'Workflow SOP',
      unit: staff.unit,
      category: staff.unit,
      content: {
        purpose: 'p',
        principle: 'p',
        equipment: [],
        reagents: [],
        steps: [{ stepNo: 1, title: 'one', description: 'one' }],
        safetyPrecautions: [],
        relatedTests: [],
        attachments: [],
      },
    });
    expect(draft.currentStage).toBe('draft');

    const submitRes = submitSOPForReview({
      sopId: draft.id,
      staffUser: staff,
      reviewerId: supervisor.id,
    });
    expect(submitRes.ok).toBe(true);

    const stateAfterSubmit = getWorkflowState();
    const reviewTask = stateAfterSubmit.reviewTasks.find(t => t.sopId === draft.id);
    expect(reviewTask).toBeTruthy();
    expect(stateAfterSubmit.sops.find(s => s.id === draft.id)?.currentStage).toBe('in_review');

    const reviewRes = decideReviewTask({
      taskId: reviewTask!.id,
      supervisor,
      decision: 'approved',
      comments: 'Looks good',
      hodId: hod.id,
    });
    expect(reviewRes.ok).toBe(true);
    const validationTask = getWorkflowState().validationTasks.find(v => v.sopId === draft.id);
    expect(validationTask).toBeTruthy();
    expect(getWorkflowState().sops.find(s => s.id === draft.id)?.currentStage).toBe('awaiting_hod_validation');

    const validationRes = decideValidationTask({
      taskId: validationTask!.id,
      hod,
      decision: 'approved',
      notes: 'Publish',
    });
    expect(validationRes.ok).toBe(true);
    expect(getWorkflowState().sops.find(s => s.id === draft.id)?.currentStage).toBe('validated_published');
  });

  it('enforces supervisor request then HOD approval flow for user creation', () => {
    const supervisor = USERS.find(u => u.role === 'supervisor')!;
    const hod = USERS.find(u => u.role === 'hod')!;

    const req = createUserRequest({
      requester: supervisor,
      requestedUserName: 'New Staff',
      requestedUserEmail: 'new.staff@knowlab.com',
      requestedUserRole: 'staff',
      requestedUnit: supervisor.unit,
    });

    expect(req.decision).toBe('pending');
    const pending = getWorkflowState().userRequests.find(r => r.id === req.id);
    expect(pending?.decision).toBe('pending');

    const decide = decideUserRequest({
      requestId: req.id,
      hod,
      decision: 'approved',
      notes: 'Approved by HOD',
    });
    expect(decide.ok).toBe(true);

    const approved = getWorkflowState().userRequests.find(r => r.id === req.id);
    expect(approved?.decision).toBe('approved');
    expect(approved?.decidedById).toBe(hod.id);
  });
});

