package com.employee_crud_exercise.employee_crud.service;

import java.util.List;

import com.employee_crud_exercise.employee_crud.entity.Employee;
import com.employee_crud_exercise.employee_crud.model.ApiResponse;

public interface EmployeeService {
  ApiResponse<List<Employee>> findAll();

  ApiResponse<Employee> findById(Long id);

  ApiResponse<Employee> save(Employee employee);

  ApiResponse<Void> deleteById(Long id);
}
