import { CorrectiveAction } from "../types/actions";

export const actions: CorrectiveAction[] = [
  {
    id: "1",
    title: "Repair damaged ladder",
    assignedTo: "Maintenance",
    dueDate: "2026-04-28",
    priority: "high",
    status: "open"
  },
  {
    id: "2",
    title: "Replace missing fire extinguisher",
    assignedTo: "Safety Team",
    dueDate: "2026-04-27",
    priority: "critical",
    status: "in_progress"
  }
];
