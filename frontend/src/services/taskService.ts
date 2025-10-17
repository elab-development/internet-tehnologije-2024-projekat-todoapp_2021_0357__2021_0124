import api from './api';

// tajpskript interfejs za task koji odgovara strukturi podataka iz backend-a
export interface Task {
  id: number;
  title: string;
  is_completed: boolean;
  due_date: string | null;
  user_id: number;
  created_at: string;
  updated_at: string;
}

// interfejs za pravljenje novog zadatka
export interface CreateTaskData {
  title: string;
  due_date?: string;
}

// interfejs za ažuriranje zadatka
export interface UpdateTaskData {
  title?: string;
  is_completed?: boolean;
  due_date?: string;
}

// funkcija za dobavljanje svih zadataka
export const getTasks = async (): Promise<Task[]> => {
  const response = await api.get('/tasks');
  return response.data;
};

// funkcija za kreiranje novog zadatka
export const createTask = async (taskData: CreateTaskData): Promise<Task> => {
  const response = await api.post('/tasks', taskData);
  return response.data;
};

// funkcija za ažuriranje zadatka
export const updateTask = async (id: number, taskData: UpdateTaskData): Promise<Task> => {
  const response = await api.put(`/tasks/${id}`, taskData);
  return response.data;
};

// funkcija za brisanje zadatka
export const deleteTask = async (id: number): Promise<void> => {
  await api.delete(`/tasks/${id}`);
};

// funkcija za dobavljanje jednog zadatka po id
export const getTaskById = async (id: number): Promise<Task> => {
  const response = await api.get(`/tasks/${id}`);
  return response.data;
};
