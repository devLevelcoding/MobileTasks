import { api } from './client';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface Task {
  id: number;
  title: string;
  type: number;
  brand: number;
  zone?: string;
  userId: number;
  status: number;
  assignAllOperators: boolean;
  dueDate?: string;
  createdAt: string;
  _count?: { shopTasks: number; questions: number };
}

export interface Question {
  id: number;
  taskId: number;
  question: string;
  type: number;       // 0 = info, 1 = quiz, 2 = text
  answerType: number;
  answers?: { answer: string; is_correct: boolean }[];
  createdAt: string;
}

export interface AgencyTask {
  id: number;
  taskId: number;
  groupId?: number;
  agencyId: number;
  userId?: number;
  dueDate?: string;
  status: number;     // 0 = pending, 1 = in_progress, 2 = completed
  startAt?: string;
  endAt?: string;
  hidden: boolean;
  visible: boolean;
  task?: Task;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// ── Operator API (mobile-primary) ─────────────────────────────────────────────

export interface MyTasksAutoResponse extends PaginatedResponse<AgencyTask> {
  agencyIds: number[];
}

export const operatorApi = {
  myTasksAuto: (params?: { page?: number; limit?: number; status?: number }) =>
    api.get<MyTasksAutoResponse>('/shoptasks/my', { params }),

  myTasks: (shopId: number, params?: { page?: number; limit?: number }) =>
    api.get<PaginatedResponse<AgencyTask>>(`/shoptasks/my/${shopId}`, { params }),

  start: (shopTaskId: number) =>
    api.patch<AgencyTask>(`/shoptasks/shop-task/${shopTaskId}/start`),

  answer: (shopTaskId: number, data: { questionId: number; answers: number[]; response?: string }) =>
    api.post(`/shoptasks/shop-task/${shopTaskId}/answer`, data),

  complete: (shopTaskId: number, data?: { response?: string }) =>
    api.patch<AgencyTask>(`/shoptasks/shop-task/${shopTaskId}/complete`, data ?? {}),
};

// ── Tasks list API (manager view) ─────────────────────────────────────────────

export const tasksApi = {
  list: (params?: { page?: number; limit?: number; status?: number; brand?: number }) =>
    api.get<PaginatedResponse<Task>>('/shoptasks', { params }),

  get: (id: number) => api.get<Task>(`/shoptasks/${id}`),

  questions: (taskId: number) =>
    api.get<Question[]>(`/shoptasks/${taskId}/questions`),
};
