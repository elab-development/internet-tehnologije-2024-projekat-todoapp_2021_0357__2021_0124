import api from './api';

// TypeScript interfejs za Note koji odgovara strukturi podataka iz backend-a
export interface Note {
  id: number;
  title: string;
  content: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

// Interfejs za kreiranje nove beleške
export interface CreateNoteData {
  title: string;
  content: string;
}

// Interfejs za ažuriranje beleške
export interface UpdateNoteData {
  title?: string;
  content?: string;
}

// Interfejs za parametre pretrage i filtriranja
export interface NoteSearchParams {
  search?: string;
  page?: number;
}

// Interfejs za paginirani odgovor
export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

// funkcija za dobavljanje svih beležaka
export const getNotes = async (params?: NoteSearchParams): Promise<PaginatedResponse<Note>> => {
  const queryParams = new URLSearchParams();
  
  if (params?.search) {
    queryParams.append('search', params.search);
  }
  
  if (params?.page) {
    queryParams.append('page', params.page.toString());
  }
  
  const queryString = queryParams.toString();
  const url = queryString ? `/notes?${queryString}` : '/notes';
  
  const response = await api.get(url);
  // Backend vraća paginirane podatke
  return {
    data: response.data.data.data,
    current_page: response.data.data.current_page,
    last_page: response.data.data.last_page,
    per_page: response.data.data.per_page,
    total: response.data.data.total,
  };
};

// funkcija za kreiranje nove beleške
export const createNote = async (noteData: CreateNoteData): Promise<Note> => {
  const response = await api.post('/notes', noteData);
  return response.data.data;
};

// funkcija za ažuriranje beleške
export const updateNote = async (id: number, noteData: UpdateNoteData): Promise<Note> => {
  const response = await api.put(`/notes/${id}`, noteData);
  return response.data.data;
};

// funkcija za brisanje beleške
export const deleteNote = async (id: number): Promise<void> => {
  await api.delete(`/notes/${id}`);
};

// funkcija za dobavljanje jedne beleške po id
export const getNoteById = async (id: number): Promise<Note> => {
  const response = await api.get(`/notes/${id}`);
  return response.data.data;
};
