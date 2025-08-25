package com.employee_crud_exercise.employee_crud.DAO;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.employee_crud_exercise.employee_crud.entity.Employee;
import com.employee_crud_exercise.employee_crud.model.ApiResponse;
import com.employee_crud_exercise.employee_crud.utils.EmployeeUtils;

import jakarta.persistence.EntityManager;

@Repository
public class EmployeeDAOImpl implements EmployeeDAO {
  private EntityManager entityManager;

  public EmployeeDAOImpl(EntityManager theEntityManager) {
    entityManager = theEntityManager;
  }

  @Override
  public ApiResponse<List<Employee>> findAll() {
    try {
      List<Employee> employees = entityManager.createQuery("FROM Employee", Employee.class).getResultList();

      // Clean sensitive data from each employee
      List<Employee> cleanedEmployees = new ArrayList<>();
      for (Employee emp : employees) {
        cleanedEmployees.add(EmployeeUtils.cleanEmployeeData(emp));
      }

      return new ApiResponse<>(cleanedEmployees, "Employees retrieved successfully");
    } catch (Exception e) {
      return new ApiResponse<>("Error retrieving employees: " + e.getMessage());
    }
  }

  @Override
  public ApiResponse<Employee> findById(Long id) {
    try {
      Employee employee = entityManager.find(Employee.class, id);

      if (employee == null) {
        return new ApiResponse<>("Employee not found with ID: " + id);
      }

      // Clean sensitive data
      Employee cleanedEmployee = EmployeeUtils.cleanEmployeeData(employee);

      return new ApiResponse<>(cleanedEmployee, "Employee retrieved successfully");
    } catch (Exception e) {
      return new ApiResponse<>("Error retrieving employee: " + e.getMessage());
    }
  }

  @Override
  @Transactional(propagation = Propagation.REQUIRES_NEW) // This creates a new transaction
  public ApiResponse<Employee> save(Employee employee) {
    try {
      // Check if this is an update or a new employee
      if (employee.getId() != null) {
        // This is an update - Get the existing employee
        Employee existingEmployee = entityManager.find(Employee.class, employee.getId());

        if (existingEmployee == null) {
          return new ApiResponse<>("Employee not found with ID: " + employee.getId());
        }

        // Update fields except email (as required)
        existingEmployee.setFullName(employee.getFullName());
        existingEmployee.setDateOfBirth(employee.getDateOfBirth());
        existingEmployee.setGender(employee.getGender());
        existingEmployee.setPhoneNumber(employee.getPhoneNumber());
        existingEmployee.setActive(employee.getActive());

        // Only update password if provided
        if (employee.getHashedPassword() != null && !employee.getHashedPassword().isEmpty()) {
          existingEmployee.setHashedPassword(employee.getHashedPassword());
        }

        // Merge the updated employee
        Employee merged = entityManager.merge(existingEmployee);

        // Clean sensitive data before returning
        Employee cleanedEmployee = EmployeeUtils.cleanEmployeeData(merged);
        return new ApiResponse<>(cleanedEmployee, "Employee updated successfully");
      } else {
        // Check if email already exists - using a separate query outside of the current
        // transaction
        List<?> results = entityManager.createQuery(
            "SELECT e.id FROM Employee e WHERE e.email = :email")
            .setParameter("email", employee.getEmail())
            .setMaxResults(1)
            .getResultList();

        if (!results.isEmpty()) {
          // Email already exists, cannot create new employee with the same email
          return new ApiResponse<>("An employee with this email already exists");
        }

        // This is a new employee - persist it
        entityManager.persist(employee);
        entityManager.flush(); // Force immediate flush to database

        // Clean sensitive data before returning
        Employee cleanedEmployee = EmployeeUtils.cleanEmployeeData(employee);
        return new ApiResponse<>(cleanedEmployee, "Employee created successfully");
      }
    } catch (Exception e) {
      // Log the exception
      e.printStackTrace();
      return new ApiResponse<>("Error saving employee: " + e.getMessage());
    }
  }

  @Override
  @Transactional
  public ApiResponse<Void> deleteById(Long id) {
    try {
      Employee employee = entityManager.find(Employee.class, id);

      if (employee == null) {
        return new ApiResponse<>("Employee not found with ID: " + id);
      }

      entityManager.remove(employee);
      return new ApiResponse<>(null, "Employee deleted successfully");
    } catch (Exception e) {
      return new ApiResponse<>("Error deleting employee: " + e.getMessage());
    }
  }

}
