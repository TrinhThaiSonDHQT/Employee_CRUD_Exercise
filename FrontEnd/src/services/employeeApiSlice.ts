import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Employee, ApiResponse } from '../models/Employee';

export const employeeApi = createApi({
  reducerPath: 'employeeApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080/api/' }),
  tagTypes: ['Employee'],
  endpoints: (builder) => ({
    // Get all employees
    getEmployees: builder.query<ApiResponse<Employee[]>, void>({
      query: () => 'employees',
      providesTags: ['Employee'],
    }),
    
    // Get employee by ID
    getEmployeeById: builder.query<ApiResponse<Employee>, number>({
      query: (id) => `employees/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Employee', id }],
    }),
    
    // Create a new employee
    createEmployee: builder.mutation<ApiResponse<Employee>, Omit<Employee, 'id'>>({
      query: (employee) => ({
        url: 'employees',
        method: 'POST',
        body: employee,
      }),
      invalidatesTags: ['Employee'],
    }),
    
    // Update an employee
    updateEmployee: builder.mutation<ApiResponse<Employee>, Employee>({
      query: (employee) => ({
        url: 'employees',
        method: 'PUT',
        body: employee,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Employee', id }, 'Employee'],
    }),
    
    // Delete an employee
    deleteEmployee: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({
        url: `employees/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Employee'],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetEmployeesQuery,
  useGetEmployeeByIdQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
} = employeeApi;
