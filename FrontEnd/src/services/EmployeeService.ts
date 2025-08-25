import type { ApiResponse, Employee } from "../models/Employee";

const API_URL = "http://localhost:8080/api";

export const EmployeeService = {
  // Get all employees
  getAllEmployees: async (): Promise<ApiResponse<Employee[]>> => {
    try {
      const response = await fetch(`${API_URL}/employees`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching employees:", error);
      return {
        success: false,
        message: "Failed to fetch employees",
        data: []
      };
    }
  },

  // Get employee by ID
  getEmployeeById: async (id: number): Promise<ApiResponse<Employee>> => {
    try {
      const response = await fetch(`${API_URL}/employees/${id}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching employee with ID ${id}:`, error);
      return {
        success: false,
        message: `Failed to fetch employee with ID ${id}`,
        data: {} as Employee
      };
    }
  },

  // Create or update an employee
  saveEmployee: async (employee: Employee): Promise<ApiResponse<Employee>> => {
    try {
      const method = employee.id ? "PUT" : "POST";
      const response = await fetch(`${API_URL}/employees`, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(employee),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error saving employee:", error);
      return {
        success: false,
        message: "Failed to save employee",
        data: {} as Employee
      };
    }
  },

  // Delete an employee
  deleteEmployee: async (id: number): Promise<ApiResponse<void>> => {
    try {
      const response = await fetch(`${API_URL}/employees/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error deleting employee with ID ${id}:`, error);
      return {
        success: false,
        message: `Failed to delete employee with ID ${id}`,
        data: undefined
      };
    }
  }
};
