export type ActionStatus =
  | "open"
  | "in_progress"
  | "blocked"
  | "completed"
  | "overdue";

export type ActionPriority =
  | "low"
  | "medium"
  | "high"
  | "critical";

export interface CorrectiveAction {
  id: string;
  title: string;
  assignedTo: string;
  dueDate: string;
  priority: ActionPriority;
  status: ActionStatus;
}
