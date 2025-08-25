package com.employee_crud_exercise.employee_crud.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.employee_crud_exercise.employee_crud.DAO.EmployeeDAO;
import com.employee_crud_exercise.employee_crud.entity.Employee;
import com.employee_crud_exercise.employee_crud.model.ApiResponse;

@Service
public class EmployeeServiceImpl implements EmployeeService {
  private EmployeeDAO employeeDAO;

  public EmployeeServiceImpl(EmployeeDAO employeeDAO) {
    this.employeeDAO = employeeDAO;
  }

  @Override
  public ApiResponse<List<Employee>> findAll() {
    return employeeDAO.findAll();
  }

  @Override
  public ApiResponse<Employee> findById(Long id) {
    return employeeDAO.findById(id);
  }

  @Override
  public ApiResponse<Employee> save(Employee employee) {
    // Pass through to DAO layer
    return employeeDAO.save(employee);
  }

  @Override
  public ApiResponse<Void> deleteById(Long id) {
    return employeeDAO.deleteById(id);
  }

}
