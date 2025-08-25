import { useState } from 'react'
import './App.css'
import { EmployeeList } from './components/EmployeeList'
import { EmployeeForm } from './components/EmployeeForm'
import type { Employee } from './models/Employee'

function App() {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee)
    setShowForm(true)
  }

  const handleAddNewEmployee = () => {
    setSelectedEmployee(null)
    setShowForm(true)
  }

  const handleFormSuccess = () => {
    setNotification({
      message: `Employee ${selectedEmployee ? 'updated' : 'added'} successfully!`,
      type: 'success'
    })
    setShowForm(false)
    setSelectedEmployee(null)
  }

  const handleCancelForm = () => {
    setShowForm(false)
    setSelectedEmployee(null)
  }

  // Clear notification after 5 seconds
  if (notification) {
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Employee Management System</h1>
      </header>

      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      {showForm ? (
        <EmployeeForm 
          employee={selectedEmployee}
          onSuccess={handleFormSuccess}
          onCancel={handleCancelForm}
        />
      ) : (
        <>
          <div className="controls">
            <button className="add-button" onClick={handleAddNewEmployee}>
              Add New Employee
            </button>
          </div>
          <EmployeeList 
            onEditEmployee={handleEditEmployee}
          />
        </>
      )}
    </div>
  )
}

export default App
