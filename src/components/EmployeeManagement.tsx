import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash, CheckCircle, XCircle } from 'lucide-react';

interface Employee {
  id: number;
  name: string;
  role: string;
  username: string;
  password?: string;
}

const EmployeeManagement: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isAddingEmployee, setIsAddingEmployee] = useState(false);
  const [newEmployee, setNewEmployee] = useState<Employee>({ id: 0, name: '', role: '', username: '', password: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; content: string } | null>(null);

  // Fetch employees when the component mounts
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('/api/employees');
        setEmployees(response.data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };
    fetchEmployees();
  }, []);

  const handleAddEmployee = async () => {
    try {
      const response = await axios.post('/api/employees', newEmployee);
      setEmployees([...employees, response.data]);
      showMessage('success', 'Employee added successfully!');
      resetForm();
    } catch (error) {
      showMessage('error', 'Error adding employee.');
    }
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setNewEmployee({ ...employee });
    setIsEditing(true);
  };

  const handleUpdateEmployee = async () => {
    if (editingEmployee) {
      try {
        const response = await axios.put(`/api/employees/${editingEmployee.id}`, newEmployee);
        setEmployees(employees.map(emp => (emp.id === editingEmployee.id ? response.data : emp)));
        showMessage('success', 'Employee updated successfully!');
        resetForm();
      } catch (error) {
        showMessage('error', 'Error updating employee.');
      }
    }
  };

  const handleDeleteEmployee = async (id: number) => {
    try {
      await axios.delete(`/api/employees/${id}`);
      setEmployees(employees.filter(emp => emp.id !== id));
      showMessage('success', 'Employee deleted successfully!');
    } catch (error) {
      showMessage('error', 'Error deleting employee.');
    }
  };

  const showMessage = (type: 'success' | 'error', content: string) => {
    setMessage({ type, content });
    // Hide the message after 3 seconds
    setTimeout(() => {
      setMessage(null);
    }, 3000);
  };

  const resetForm = () => {
    setIsAddingEmployee(false);
    setIsEditing(false);
    setNewEmployee({ id: 0, name: '', role: '', username: '', password: '' });
    setEditingEmployee(null);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Employee Management</h1>

      {/* Notification Message */}
      {message && (
        <div
          className={`mb-4 p-4 rounded ${
            message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          } flex items-center`}
        >
          {message.type === 'success' ? <CheckCircle className="mr-2" /> : <XCircle className="mr-2" />}
          <span>{message.content}</span>
        </div>
      )}

      <div className="mb-4">
        <button
          onClick={() => setIsAddingEmployee(true)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <Plus className="mr-2" /> Add Employee
        </button>
      </div>

      {(isAddingEmployee || isEditing) && (
        <div className="mb-4 p-4 bg-gray-100 rounded">
          <h2 className="text-xl font-bold mb-2">{isEditing ? 'Edit Employee' : 'Add New Employee'}</h2>
          <input
            type="text"
            placeholder="Name"
            className="mb-2 p-2 w-full"
            value={newEmployee.name}
            onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Role"
            className="mb-2 p-2 w-full"
            value={newEmployee.role}
            onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
          />
          <input
            type="text"
            placeholder="Username"
            className="mb-2 p-2 w-full"
            value={newEmployee.username}
            onChange={(e) => setNewEmployee({ ...newEmployee, username: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            className="mb-2 p-2 w-full"
            value={newEmployee.password}
            onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
          />
          <button
            onClick={isEditing ? handleUpdateEmployee : handleAddEmployee}
            className={`bg-${isEditing ? 'yellow' : 'green'}-500 hover:bg-${isEditing ? 'yellow' : 'green'}-700 text-white font-bold py-2 px-4 rounded`}
          >
            {isEditing ? 'Update Employee' : 'Save Employee'}
          </button>
          <button onClick={resetForm} className="ml-2 text-gray-600 hover:text-gray-800">Cancel</button>
        </div>
      )}

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td className="px-6 py-4 whitespace-nowrap">{employee.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{employee.role}</td>
              <td className="px-6 py-4 whitespace-nowrap">{employee.username}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button onClick={() => handleEditEmployee(employee)} className="text-indigo-600 hover:text-indigo-900 mr-2">
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDeleteEmployee(employee.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeManagement;
