import { useState, useEffect } from 'react';
import type { Employee } from '../models/Employee';
import { useCreateEmployeeMutation, useUpdateEmployeeMutation } from '../services/employeeApiSlice';

interface EmployeeFormProps {
  employee: Employee | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const defaultEmployee: Employee = {
  fullName: '',
  email: '',
  dateOfBirth: '',
  gender: '',
  phoneNumber: '',
  active: true
};

export const EmployeeForm = ({ employee, onSuccess, onCancel }: EmployeeFormProps) => {
  const [formData, setFormData] = useState<Employee>(employee || defaultEmployee);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [apiError, setApiError] = useState<string | null>(null);
  
  // RTK Query mutation hooks
  const [createEmployee, { isLoading: isCreating }] = useCreateEmployeeMutation();
  const [updateEmployee, { isLoading: isUpdating }] = useUpdateEmployeeMutation();
  
  const isSubmitting = isCreating || isUpdating;

  useEffect(() => {
    // Update form data when employee prop changes
    setFormData(employee || defaultEmployee);
  }, [employee]);

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};
    
    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.dateOfBirth) {
      errors.dateOfBirth = 'Date of birth is required';
    }
    
    if (!formData.gender) {
      errors.gender = 'Gender is required';
    }
    
    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiError(null); // Clear any previous error
    
    if (validateForm()) {
      try {
        const response = employee?.id 
          ? await updateEmployee(formData).unwrap()
          : await createEmployee(formData).unwrap();
          
        if (response.success) {
          onSuccess();
        } else {
          setApiError(response.error || response.message || 'Failed to save employee');
        }
      } catch (err: any) {
        console.error('Failed to save employee:', err);
        setApiError(err.data?.message || err.data?.error || 'Server error. Please try again later.');
      }
    }
  };

  return (
    <div className="employee-form-container">
      <h2>{employee ? 'Edit Employee' : 'Add New Employee'}</h2>
      <form onSubmit={handleSubmit} className="employee-form">
        <div className="form-group">
          <label htmlFor="fullName">Full Name:</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
          />
          {formErrors.fullName && <div className="error">{formErrors.fullName}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {formErrors.email && <div className="error">{formErrors.email}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="dateOfBirth">Date of Birth:</label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
          />
          {formErrors.dateOfBirth && <div className="error">{formErrors.dateOfBirth}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="gender">Gender:</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {formErrors.gender && <div className="error">{formErrors.gender}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number:</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
          {formErrors.phoneNumber && <div className="error">{formErrors.phoneNumber}</div>}
        </div>
        
        <div className="form-group checkbox">
          <label htmlFor="active">
            <input
              type="checkbox"
              id="active"
              name="active"
              checked={formData.active}
              onChange={handleChange}
            />
            Active
          </label>
        </div>
        
        {apiError && (
          <div className="error-message">
            {apiError}
          </div>
        )}
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="save-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
          <button 
            type="button" 
            className="cancel-btn" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
