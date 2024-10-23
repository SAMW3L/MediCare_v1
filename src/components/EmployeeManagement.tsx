import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash } from 'lucide-react';

interface Employee {
  id: number;
  name: string;
  role: string;
  username: string;
  password?: string; // Optionally store password
}

const EmployeeManagement: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isAddingEmployee, setIsAddingEmployee] = useState(false);
  const [newEmployee, setNewEmployee] = useState<Employee>({ id: 0, name: '', role: '', username: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    // Fetch employees from API or local storage
    const mockEmployees: Employee[] = [
      { id: 1, name: 'John Doe', role: 'Pharmacist', username: 'john' },
      { id: 2, name: 'Jane Smith', role: 'Cashier', username: 'jane' },
    ];
    setEmployees(mockEmployees);
  }, []);

  const handleAddEmployee = () => {
    const newId = employees.length ? Math.max(...employees.map(emp => emp.id)) + 1 : 1; // Get new ID
    const employee: Employee = { ...newEmployee, id: newId };
    setEmployees([...employees, employee]);
    resetForm();
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setNewEmployee({ ...employee });
    setIsEditing(true);
  };

  const handleUpdateEmployee = () => {
    if (editingEmployee) {
      setEmployees(employees.map(emp => (emp.id === editingEmployee.id ? newEmployee : emp)));
      resetForm();
    }
  };

  const handleDeleteEmployee = (id: number) => {
    setEmployees(employees.filter(emp => emp.id !== id));
  };

  const resetForm = () => {
    setIsAddingEmployee(false);
    setIsEditing(false);
    setNewEmployee({ id: 0, name: '', role: '', username: '' });
    setEditingEmployee(null);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Employee Management</h1>
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
