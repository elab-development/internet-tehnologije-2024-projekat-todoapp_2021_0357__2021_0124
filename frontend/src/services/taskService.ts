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

// Interfejs za parametre pretrage i filtriranja
export interface TaskSearchParams {
  search?: string;
  completed?: boolean;
}

// funkcija za dobavljanje svih zadataka
export const getTasks = async (params?: TaskSearchParams): Promise<Task[]> => {
  const queryParams = new URLSearchParams();
  
  if (params?.search) {
    queryParams.append('search', params.search);
  }
  
  if (params?.completed !== undefined) {
    queryParams.append('completed', params.completed.toString());
  }
  
  const queryString = queryParams.toString();
  const url = queryString ? `/tasks?${queryString}` : '/tasks';
  
  const response = await api.get(url);
  // Backend vraća paginirane podatke, uzimamo samo data array
  return response.data.data.data;
};

// funkcija za kreiranje novog zadatka
export const createTask = async (taskData: CreateTaskData): Promise<Task> => {
  const response = await api.post('/tasks', taskData);
  return response.data.data;
};

// funkcija za ažuriranje zadatka
export const updateTask = async (id: number, taskData: UpdateTaskData): Promise<Task> => {
  const response = await api.put(`/tasks/${id}`, taskData);
  return response.data.data;
};

// funkcija za brisanje zadatka
export const deleteTask = async (id: number): Promise<void> => {
  await api.delete(`/tasks/${id}`);
};

// funkcija za dobavljanje jednog zadatka po id
export const getTaskById = async (id: number): Promise<Task> => {
  const response = await api.get(`/tasks/${id}`);
  return response.data.data;
};
