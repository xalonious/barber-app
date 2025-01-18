import apiClient from './axiosInstance';

export interface Appointment {
  appointmentId: number;
  customerId: number;
  service: {
    name: string;
  };
  date: string;
  staffId: number;
  customer?: {
    name: string;
  };
  staff?: {
    name: string;
    role: string;
    headshot: string;
    description: string;
  };
  serviceDetails?: {
    name: string;
    price: number;
    duration: number;
  };
}

export interface CreateAppointmentData {
  service: string;
  staffId: number;
  date: string;
}

export interface UpdateAppointmentData {
  service?: string;
  staffId?: number;
  date?: string;
}

export const fetchAppointments = async (customerId: number): Promise<Appointment[]> => {
  try {
    const response = await apiClient.get<Appointment[]>(`/appointments/${customerId}`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching appointments:', error);
    throw error;
  }
};

export const createAppointment = async (appointmentData: CreateAppointmentData): Promise<Appointment> => {
  try {
    const response = await apiClient.post<Appointment>('/appointments', appointmentData);
    return response.data;
  } catch (error: any) {
    console.error('Error creating appointment:', error);
    throw error;
  }
};

export const updateAppointment = async (
  appointmentId: number,
  updateData: UpdateAppointmentData
): Promise<Appointment> => {
  try {
    const response = await apiClient.patch<Appointment>(`/appointments/${appointmentId}`, updateData);
    return response.data;
  } catch (error: any) {
    console.error('Error updating appointment:', error);
    throw error;
  }
};

export const deleteAppointment = async (appointmentId: number): Promise<void> => {
  try {
    await apiClient.delete(`/appointments/${appointmentId}`);
  } catch (error: any) {
    console.error('Error deleting appointment:', error);
    throw error;
  }
};
