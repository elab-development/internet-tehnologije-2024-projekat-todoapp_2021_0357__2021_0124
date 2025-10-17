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

// funkcija za dobavljanje svih beležaka
export const getNotes = async (): Promise<Note[]> => {
  const response = await api.get('/notes');
  // Backend vraća paginirane podatke, uzimamo samo data array
  return response.data.data.data;
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
