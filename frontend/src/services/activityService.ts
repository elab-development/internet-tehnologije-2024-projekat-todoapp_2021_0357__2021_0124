import api from './api';

// TypeScript interfejs za aktivnost sa API-ja
export interface Activity {
  activity: string;
  type: string;
  participants: number;
  price: number;
  link: string;
  key: string;
  accessibility: number;
}

// Funkcija za dobavljanje random aktivnosti sa javnog API-ja
export const getRandomActivity = async (): Promise<Activity> => {
  const response = await api.get('/random-activity');
  // backend vraća raw json iz eksternog api-jSta
  return response.data as Activity;
};

