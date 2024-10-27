const API_URL = 'http://localhost:3000/api';

export const api = {
  // Auth
  login: async (username: string, password: string): Promise<{ success: boolean; role: string }> =>
    fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    }).then(res => res.json()),

  // Employees
  getEmployees: async () =>
    fetch(`${API_URL}/employees`).then(res => res.json()),
  
  addEmployee: async (employee: any) =>
    fetch(`${API_URL}/employees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(employee),
    }).then(res => res.json()),
  
  deleteEmployee: async (id: number) =>
    fetch(`${API_URL}/employees/${id}`, {
      method: 'DELETE',
    }).then(res => res.json()),

  // Medicines
  getMedicines: async () => {
    try {
      const response = await fetch(`${API_URL}/medicines`);
      if (!response.ok) {
        throw new Error('Failed to fetch medicines');
      }
      return response.json();
    } catch (error) {
      console.error(error); // Log the error for debugging
      throw error; // Rethrow error for handling in the component
    }
  },
  
  addMedicine: async (medicine: any) => {
    try {
      const response = await fetch(`${API_URL}/medicines`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(medicine),
      });
      if (!response.ok) {
        throw new Error('Failed to add medicine');
      }
      return response.json();
    } catch (error) {
      console.error(error);
      throw error; // Rethrow error for handling in the component
    }
  },
  
  updateMedicine: async (id: number, medicine: any) => {
    try {
      const response = await fetch(`${API_URL}/medicines/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(medicine),
      });
      if (!response.ok) {
        throw new Error('Failed to update medicine');
      }
      return response.json();
    } catch (error) {
      console.error(error);
      throw error; // Rethrow error for handling in the component
    }
  },

  // New function to update medicine quantity
  updateMedicineQuantity: async (id: number, newQuantity: number) => {
    try {
      const response = await fetch(`${API_URL}/medicines/${id}/quantity`, {
        method: 'PATCH', // Using PATCH to update only the quantity field
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQuantity }),
      });
      if (!response.ok) {
        throw new Error('Failed to update medicine quantity');
      }
      return response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  
  deleteMedicine: async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/medicines/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete medicine');
      }
      return response.json();
    } catch (error) {
      console.error(error);
      throw error; // Rethrow error for handling in the component
    }
  },

  // Sales
  getSales: async (startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    return fetch(`${API_URL}/sales?${params}`).then(res => res.json());
  },
  
  addSale: async (sale: any) => {
    try {
      const response = await fetch(`${API_URL}/sales`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sale),
      });
      if (!response.ok) {
        throw new Error('Failed to add sale');
      }
      return response.json();
    } catch (error) {
      console.error(error);
      throw error; // Rethrow error for handling in the component
    }
  },

  // Reports
  getReport: async (type: string, startDate?: string, endDate?: string) => {
    const params = new URLSearchParams({
      type,
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
    });
    return fetch(`${API_URL}/reports?${params}`).then(res => res.json());
  },
};
