package com.employee_crud_exercise.employee_crud.DAO;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.employee_crud_exercise.employee_crud.entity.Employee;
import com.employee_crud_exercise.employee_crud.model.ApiResponse;
import com.employee_crud_exercise.employee_crud.utils.EmployeeUtils;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceException;

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
  @Transactional
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
        entityManager.merge(existingEmployee);

        // Clean sensitive data before returning
        Employee cleanedEmployee = EmployeeUtils.cleanEmployeeData(existingEmployee);
        return new ApiResponse<>(cleanedEmployee, "Employee updated successfully");
      } else {
        // This is a new employee - persist it
        entityManager.persist(employee);

        // Clean sensitive data before returning
        Employee cleanedEmployee = EmployeeUtils.cleanEmployeeData(employee);
        return new ApiResponse<>(cleanedEmployee, "Employee created successfully");
      }
    } catch (PersistenceException e) {
      return new ApiResponse<>("Database error while saving employee: " + e.getMessage());
    } catch (Exception e) {
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
