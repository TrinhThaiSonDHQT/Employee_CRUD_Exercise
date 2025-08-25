package com.employee_crud_exercise.employee_crud.restController;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.employee_crud_exercise.employee_crud.entity.Employee;
import com.employee_crud_exercise.employee_crud.model.ApiResponse;
import com.employee_crud_exercise.employee_crud.service.EmployeeService;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api")
public class EmployeeRestController {
  private EmployeeService employeeService;

  public EmployeeRestController(EmployeeService employeeService) {
    this.employeeService = employeeService;
  }

  // Get all employees
  @GetMapping("employees")
  public ApiResponse<List<Employee>> getAllEmployees() {
    return employeeService.findAll();
  }

  // Get employee by ID
  @GetMapping("employees/{id}")
  public ApiResponse<Employee> getEmployeeById(@PathVariable Long id) {
    return employeeService.findById(id);
  }

  // Create a new employee
  @PostMapping("employees")
  public ApiResponse<Employee> createEmployee(@RequestBody Employee employee) {
    // Set ID to null to ensure we're creating a new employee
    employee.setId(null);
    return employeeService.save(employee);
  }

  // Update an existing employee
  @PutMapping("employees")
  public ApiResponse<Employee> updateEmployee(@RequestBody Employee employee) {
    return employeeService.save(employee);
  }

  // Delete an employee
  @DeleteMapping("employees/{id}")
  public ApiResponse<Void> deleteEmployee(@PathVariable Long id) {
    return employeeService.deleteById(id);
  }

}
