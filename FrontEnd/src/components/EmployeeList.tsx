import type { Employee } from '../models/Employee';
import { useGetEmployeesQuery, useDeleteEmployeeMutation } from '../services/employeeApiSlice';

interface EmployeeListProps {
  onEditEmployee: (employee: Employee) => void;
}

export const EmployeeList = ({ onEditEmployee }: EmployeeListProps) => {
  // Using RTK Query hooks
  const { data, error, isLoading, refetch } = useGetEmployeesQuery();
  const [deleteEmployee] = useDeleteEmployeeMutation();
  
  const employees = data?.data || [];

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await deleteEmployee(id).unwrap();
        // The cache is automatically updated by RTK Query
      } catch (err) {
        console.error('Failed to delete employee:', err);
      }
    }
  };

  if (isLoading) return <div>Loading employees...</div>;
  if (error) return <div className="error">Failed to load employees</div>;

  return (
    <div className="employee-list">
      <h2>Employee List</h2>
      {employees.length === 0 ? (
        <p>No employees found</p>
      ) : (
        <table className="employee-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Date of Birth</th>
              <th>Gender</th>
              <th>Phone Number</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.id}</td>
                <td>{employee.fullName}</td>
                <td>{employee.email}</td>
                <td>{employee.dateOfBirth}</td>
                <td>{employee.gender}</td>
                <td>{employee.phoneNumber}</td>
                <td>{employee.active ? 'Active' : 'Inactive'}</td>
                <td>
                  <button 
                    className="edit-btn"
                    onClick={() => onEditEmployee(employee)}
                  >
                    Edit
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDelete(employee.id!)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
