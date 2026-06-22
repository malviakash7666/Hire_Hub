export type Role = "client" | "writer";
export type Status = "pending" | "assigned" | "in_progress" | "completed";

export interface User {
  id?: string;
  userId?: string; // Matching your backend payload
  name: string;
  email?: string;
  role: Role;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  deadline: string;
  status: Status;
  clientId?: string;
  writerId?: string | null;
}

export interface NewAssignment {
  title: string;
  description: string;
  deadline: string;
}