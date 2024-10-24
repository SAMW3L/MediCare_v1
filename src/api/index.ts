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
  getMedicines: async () =>
    fetch(`${API_URL}/medicines`).then(res => res.json()),
  
  addMedicine: async (medicine: any) =>
    fetch(`${API_URL}/medicines`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(medicine),
    }).then(res => res.json()),
  
  updateMedicine: async (id: number, medicine: any) =>
    fetch(`${API_URL}/medicines/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(medicine),
    }).then(res => res.json()),
  
  deleteMedicine: async (id: number) =>
    fetch(`${API_URL}/medicines/${id}`, {
      method: 'DELETE',
    }).then(res => res.json()),

  // Sales
  getSales: async (startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    return fetch(`${API_URL}/sales?${params}`).then(res => res.json());
  },
  
  addSale: async (sale: any) =>
    fetch(`${API_URL}/sales`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sale),
    }).then(res => res.json()),

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