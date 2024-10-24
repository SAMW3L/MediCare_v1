export interface Employee {
  id: number;
  name: string;
  role: string;
  username: string;
  password?: string;
}

export interface Medicine {
  id: number;
  name: string;
  manufacturer: string;
  expiryDate: string;
  price: number;
  quantity: number;
}

export interface Sale {
  id: number;
  medicineId: number;
  medicineName?: string;
  quantity: number;
  totalPrice: number;
  date: string;
}