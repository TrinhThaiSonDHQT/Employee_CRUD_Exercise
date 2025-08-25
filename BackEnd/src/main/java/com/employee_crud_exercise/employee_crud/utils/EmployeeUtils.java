package com.employee_crud_exercise.employee_crud.utils;

import com.employee_crud_exercise.employee_crud.entity.Employee;

public class EmployeeUtils {

  /**
   * Clean sensitive data from an employee object before returning it
   *
   * @param employee The employee object to clean
   * @return The cleaned employee object
   */
  public static Employee cleanEmployeeData(Employee employee) {
    if (employee == null) {
      return null;
    }

    // Create a copy of the employee to avoid modifying the original
    Employee cleanedEmployee = new Employee();

    cleanedEmployee.setId(employee.getId());
    cleanedEmployee.setFullName(employee.getFullName());
    cleanedEmployee.setEmail(employee.getEmail());
    cleanedEmployee.setDateOfBirth(employee.getDateOfBirth());
    cleanedEmployee.setGender(employee.getGender());
    cleanedEmployee.setPhoneNumber(employee.getPhoneNumber());
    cleanedEmployee.setActive(employee.getActive());

    // Don't set hashedPassword

    return cleanedEmployee;
  }
}
