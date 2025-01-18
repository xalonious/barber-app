import apiClient from './axiosInstance';

export interface NewUser {
  name: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  id: number;
  email: string;
  name: string;
}


export const addUser = async (user: NewUser): Promise<void> => {
  try {
    await apiClient.post('/auth/register', user);
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};


export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponse>('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};
