export interface Employee {
  id?: number;
  fullName: string;
  email: string;
  dateOfBirth: string; // Will be handled as a string in frontend, converted to LocalDate in backend
  gender: string;
  phoneNumber: string;
  active: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: string;
}
