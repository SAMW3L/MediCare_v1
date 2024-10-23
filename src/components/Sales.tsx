import React, { useState, useEffect } from 'react';
import { ShoppingCart, Printer } from 'lucide-react';
import jsPDF from 'jspdf';

interface Medicine {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface SaleItem {
  medicineId: number;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

const Sales: React.FC = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [selectedMedicine, setSelectedMedicine] = useState<number | ''>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [paymentMethod, setPaymentMethod] = useState<string>('cash');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    // Fetch medicines from API or local storage
    const mockMedicines: Medicine[] = [
      { id: 1, name: 'Paracetamol', price: 5.99, quantity: 100 },
      { id: 2, name: 'Amoxicillin', price: 12.50, quantity: 50 },
      { id: 3, name: 'Azuma', price: 1000, quantity: 100 },
      { id: 4, name: 'Ant Acid', price: 1500, quantity: 100 },
      { id: 5, name: 'Cough Mixture', price: 500, quantity: 100 },
    ];
    setMedicines(mockMedicines);
  }, []);

  const handleAddToCart = () => {
    if (selectedMedicine && quantity > 0) {
      const medicine = medicines.find(m => m.id === Number(selectedMedicine));
      if (medicine) {
        const newItem: SaleItem = {
          medicineId: medicine.id,
          name: medicine.name,
          quantity: quantity,
          price: medicine.price,
          total: medicine.price * quantity,
        };
        setCart([...cart, newItem]);
        setSelectedMedicine('');
        setQuantity(1);
      }
    }
  };

  const handleRemoveFromCart = (index: number) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const handleCompleteSale = () => {
    // Process the sale here
    setMessage('Transaction done');
    setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
    // Reset cart after sale
    setCart([]);
  };

  const handlePrintReceipt = () => {
    const doc = new jsPDF();
    
    // Get current date and time
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleString('en-US', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true
    });

    // Title
    doc.text('Receipt', 14, 20);
    doc.text(`Date: ${formattedDate}`, 14, 30);
    doc.text('Items:', 14, 40);

    let y = 50; // Initial Y position for items

    // Check if the cart is empty
    if (cart.length === 0) {
      doc.text('No items in cart.', 14, y);
    } else {
      cart.forEach(item => {
        doc.text(`${item.name} x ${item.quantity}: Tsh.${item.total.toFixed(2)}`, 14, y);
        y += 10; // Move Y position for next item
      });
    }

    // Calculate total
    const total = cart.reduce((sum, item) => sum + item.total, 0);
    doc.text(`Total: Tsh.${total.toFixed(2)}`, 14, y);
    y += 10; // Move down for "Payment Method"

    doc.text(`Payment Method: ${paymentMethod}`, 14, y);

    y += 20; // Extra space before "Medicine Dose"
    doc.text('Medicine Dose:', 14, y);
    y += 10; // Move Y position for input line
    doc.line(14, y, 200, y); // Draw a line for the dose explanation

    y += 20; // Move down for "Welcome back"
    doc.text('Welcome back', 14, y);

    doc.save('receipt.pdf'); // Save the PDF
  };

  const total = cart.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Sales</h1>
      {message && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
          {message}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-bold mb-4">Add to Cart</h2>
          <div className="mb-4">
            <select
              value={selectedMedicine}
              onChange={(e) => setSelectedMedicine(Number(e.target.value))}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Medicine</option>
              {medicines.map((medicine) => (
                <option key={medicine.id} value={medicine.id}>
                  {medicine.name} - Tsh.{medicine.price.toFixed(2)}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              min="1"
              className="w-full p-2 border rounded"
              placeholder="Quantity"
            />
          </div>
          <button
            onClick={handleAddToCart}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add to Cart
          </button>
        </div>
        <div>
          <h2 className="text-xl font-bold mb-4">Cart</h2>
          {cart.map((item, index) => (
            <div key={index} className="flex justify-between items-center mb-2">
              <span>{item.name} x {item.quantity}</span>
              <span>Tsh.{item.total.toFixed(2)}</span>
              <button
                onClick={() => handleRemoveFromCart(index)}
                className="text-red-600 hover:text-red-900"
              >
                Remove
              </button>
            </div>
          ))}
          <div className="mt-4">
            <strong>Total: Tsh.{total.toFixed(2)}</strong>
          </div>
          <div className="mt-4">
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full p-2 border rounded mb-2"
            >
              <option value="cash">Cash</option>
              <option value="credit">Credit Card</option>
              <option value="mobile">Mobile Payment</option>
            </select>
            <button
              onClick={handleCompleteSale}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full mb-2"
            >
              <ShoppingCart className="inline-block mr-2" />
              Complete Sale
            </button>
            <button
              onClick={handlePrintReceipt}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded w-full"
            >
              <Printer className="inline-block mr-2" />
              Print Receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sales;
