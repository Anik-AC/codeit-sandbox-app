/** Shapes shared by the API and the client. */

export interface Task {
  id: number;
  title: string;
  description: string | null;
  createdAt: string; // ISO 8601, UTC
}

export interface ApiError {
  error: string;
}
