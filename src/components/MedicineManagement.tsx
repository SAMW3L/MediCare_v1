import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash, CheckCircle, XCircle } from 'lucide-react';
import { api } from '../api'; // Ensure your API helper methods are correctly set up
import { Medicine } from '../types'; // Import Medicine type

const MedicineManagement: React.FC = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [isAddingMedicine, setIsAddingMedicine] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newMedicine, setNewMedicine] = useState<Omit<Medicine, 'id'>>({
    name: '',
    manufacturer: '',
    expiryDate: '',
    price: 0,
    quantity: 0
  });
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; content: string } | null>(null);

  // Fetch medicines from the database when component mounts
  useEffect(() => {
    loadMedicines();
  }, []);

  // Function to load all medicines from the database
  const loadMedicines = async () => {
    try {
      const data = await api.getMedicines();
      setMedicines(data);
      showMessage('success', 'Medicines loaded successfully');
    } catch (err) {
      showMessage('error', 'Failed to load medicines');
    }
  };

  // Function to add a new medicine
  const handleAddMedicine = async () => {
    try {
      await api.addMedicine(newMedicine);
      await loadMedicines();
      resetForm();
      showMessage('success', 'Medicine added successfully');
    } catch (err) {
      showMessage('error', 'Failed to add medicine');
    }
  };

  // Function to update a selected medicine
  const handleUpdateMedicine = async () => {
    if (editingMedicine) {
      try {
        console.log('Updating medicine:', editingMedicine.id, newMedicine); // Debug log
        await api.updateMedicine(editingMedicine.id, newMedicine); // Update medicine by ID
        await loadMedicines(); // Reload medicines
        resetForm(); // Reset form after updating
        showMessage('success', 'Medicine updated successfully');
      } catch (err) {
        console.error('Error updating medicine:', err); // Log error
        showMessage('error', 'Failed to update medicine');
      }
    }
  };

  // Function to delete a selected medicine
  const handleDeleteMedicine = async (id: number) => {
    try {
      console.log('Deleting medicine ID:', id); // Debug log
      await api.deleteMedicine(id); // Delete medicine by ID
      await loadMedicines(); // Reload medicines
      showMessage('success', 'Medicine deleted successfully');
    } catch (err) {
      console.error('Error deleting medicine:', err); // Log error
      showMessage('error', 'Failed to delete medicine');
    }
  };

  // Function to handle editing a medicine
  const handleEditMedicine = (medicine: Medicine) => {
    setEditingMedicine(medicine);
    setNewMedicine({ ...medicine });
    setIsEditing(true);
  };

  // Reset the form and editing state
  const resetForm = () => {
    setIsAddingMedicine(false);
    setIsEditing(false);
    setNewMedicine({ name: '', manufacturer: '', expiryDate: '', price: 0, quantity: 0 });
    setEditingMedicine(null);
    setMessage(null);
  };

  // Function to show success/error messages
  const showMessage = (type: 'success' | 'error', content: string) => {
    setMessage({ type, content });
    setTimeout(() => {
      setMessage(null);
    }, 3000);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Medicine Management</h1>

      {/* Notification for success/error messages */}
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

      {/* Add Medicine Button */}
      <div className="mb-4">
        <button
          onClick={() => setIsAddingMedicine(true)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <Plus className="mr-2" /> Add Medicine
        </button>
      </div>

      {/* Medicine Form for Adding or Editing */}
      {(isAddingMedicine || isEditing) && (
        <div className="mb-4 p-4 bg-gray-100 rounded">
          <h2 className="text-xl font-bold mb-2">
            {isEditing ? 'Edit Medicine' : 'Add New Medicine'}
          </h2>
          <input
            type="text"
            placeholder="Name"
            className="mb-2 p-2 w-full rounded border"
            value={newMedicine.name}
            onChange={(e) => setNewMedicine({ ...newMedicine, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Batch Number"
            className="mb-2 p-2 w-full rounded border"
            value={newMedicine.manufacturer}
            onChange={(e) => setNewMedicine({ ...newMedicine, manufacturer: e.target.value })}
          />
          <input
            type="date"
            placeholder="Expiry Date"
            className="mb-2 p-2 w-full rounded border"
            value={newMedicine.expiryDate}
            onChange={(e) => setNewMedicine({ ...newMedicine, expiryDate: e.target.value })}
          />
          <input
            type="number"
            placeholder="Price"
            className="mb-2 p-2 w-full rounded border"
            value={newMedicine.price}
            onChange={(e) => setNewMedicine({ ...newMedicine, price: parseFloat(e.target.value) })}
          />
          <input
            type="number"
            placeholder="Quantity"
            className="mb-2 p-2 w-full rounded border"
            value={newMedicine.quantity}
            onChange={(e) => setNewMedicine({ ...newMedicine, quantity: parseInt(e.target.value) })}
          />
          <button
            onClick={isEditing ? handleUpdateMedicine : handleAddMedicine}
            className={`bg-${isEditing ? 'yellow' : 'green'}-500 hover:bg-${isEditing ? 'yellow' : 'green'}-700 text-white font-bold py-2 px-4 rounded`}
          >
            {isEditing ? 'Update Medicine' : 'Save Medicine'}
          </button>
          <button onClick={resetForm} className="ml-2 text-gray-600 hover:text-gray-800">
            Cancel
          </button>
        </div>
      )}

      {/* Medicines List Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {medicines.map((medicine) => (
              <tr key={medicine.id}>
                <td className="px-6 py-4 whitespace-nowrap">{medicine.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{medicine.manufacturer}</td>
                <td className="px-6 py-4 whitespace-nowrap">{medicine.expiryDate}</td>
                <td className="px-6 py-4 whitespace-nowrap">Tsh.{medicine.price.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap">{medicine.quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleEditMedicine(medicine)}
                    className="text-indigo-600 hover:text-indigo-900 mr-2"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteMedicine(medicine.id)}
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
    </div>
  );
};

export default MedicineManagement;
