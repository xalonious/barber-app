import apiClient from './axiosInstance';

export interface StaffMember {
  staffId: number;
  name: string;
  role: string;
  headshot: string;
  description: string;
}

export interface StaffAvailabilityResponse {
  availableTimes: string[];
}


export const fetchStaffMembers = async (): Promise<StaffMember[]> => {
  try {
    const response = await apiClient.get<StaffMember[]>('/staff');
    return response.data;
  } catch (error) {
    console.error('Error fetching staff data:', error);
    throw error;
  }
};

export const getStaffAvailability = async (staffId: number, date: string, serviceId: number): Promise<string[]> => {
  try {
    const response = await apiClient.get(`/staff/${staffId}/availability`, {
      params: { date, serviceId },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching staff availability:', error);
    throw error;
  }
};
