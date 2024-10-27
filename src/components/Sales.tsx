import React, { useState, useEffect } from 'react';
import { ShoppingCart, Printer } from 'lucide-react';
import jsPDF from 'jspdf';
import { api } from '../api'; // Ensure the correct path to your API

// Define the medicine interface
interface Medicine {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

// Define the sale item interface
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
  const [searchTerm, setSearchTerm] = useState<string>(''); // New state for search filter

  // Fetch medicines from the database when the component mounts
  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const response = await api.getMedicines(); // Ensure you have an API call for this
      if (response && Array.isArray(response)) {
        setMedicines(response);
        setMessage('Medicines loaded successfully');
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (error) {
      setMessage('Failed to load medicines');
    } finally {
      setTimeout(() => setMessage(''), 3000); // Clear the message after 3 seconds
    }
  };

  // Handle adding selected medicine to the cart
  const handleAddToCart = () => {
    if (selectedMedicine && quantity > 0) {
      const medicine = medicines.find(m => m.id === Number(selectedMedicine));
      if (medicine && medicine.quantity >= quantity) {
        const newItem: SaleItem = {
          medicineId: medicine.id,
          name: medicine.name,
          quantity,
          price: medicine.price,
          total: medicine.price * quantity,
        };
        setCart([...cart, newItem]);
        setSelectedMedicine('');
        setQuantity(1);
        setMessage('Item added to cart');
      } else {
        setMessage('Not enough stock available');
      }
    }
  };

  // Handle removing items from the cart
  const handleRemoveFromCart = (index: number) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
    setMessage('Item removed from cart');
  };

  // Handle completing the sale and updating the database
  const handleCompleteSale = async () => {
    try {
      for (const item of cart) {
        const medicine = medicines.find(m => m.id === item.medicineId);
        if (medicine) {
          const updatedQuantity = medicine.quantity - item.quantity;
          if (updatedQuantity >= 0) {
            // Update medicine quantity in the database
            await api.updateMedicineQuantity(medicine.id, updatedQuantity);
          } else {
            setMessage(`Insufficient stock for ${medicine.name}`);
            return; // Prevent sale if stock is insufficient
          }
        }
      }
      setMessage('Transaction completed successfully');
      setCart([]); // Clear cart after sale
      fetchMedicines(); // Refresh medicine data to reflect updated quantities
    } catch (error) {
      setMessage('Transaction failed');
    } finally {
      setTimeout(() => setMessage(''), 3000); // Clear the message after 3 seconds
    }
  };

  // Handle printing the receipt for the transaction
  const handlePrintReceipt = () => {
    const doc = new jsPDF();
    const currentDate = new Date().toLocaleString();
    
    doc.text('Receipt', 14, 20);
    doc.text(`Date: ${currentDate}`, 14, 30);
    doc.text('Items:', 14, 40);

    let y = 50;

    // Loop through the cart and add items to the receipt
    cart.forEach(item => {
      doc.text(`${item.name} x ${item.quantity}: Tsh.${item.total.toFixed(2)}`, 14, y);
      y += 10;
    });

    const total = cart.reduce((sum, item) => sum + item.total, 0);
    y += 10;
    doc.text(`Total: Tsh.${total.toFixed(2)}`, 14, y);
    y += 10;
    doc.text(`Payment Method: ${paymentMethod}`, 14, y);
    y += 20;
    doc.text('Medicine Dose:', 14, y);
    doc.line(14, y + 10, 200, y + 10);
    y += 30;
    doc.text('Welcome back', 14, y);

    doc.save('receipt.pdf');
  };

  // Filter medicines based on search term
  const filteredMedicines = medicines.filter(medicine =>
    medicine.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const total = cart.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-green-900 mb-6">Dispensing</h1>

      {/* Show message for any actions performed */}
      {message && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-bold mb-4">Add to Cart</h2>

          {/* Search input for filtering medicines */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search Medicine"
              className="w-full p-2 border rounded"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Medicine dropdown list */}
          <div className="mb-4">
            <select
              value={selectedMedicine}
              onChange={(e) => setSelectedMedicine(Number(e.target.value))}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Medicine</option>
              {filteredMedicines.map((medicine) => (
                <option key={medicine.id} value={medicine.id}>
                  {medicine.name} - Tsh.{medicine.price.toFixed(2)}
                </option>
              ))}
            </select>
          </div>

          {/* Input for selecting quantity */}
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

          {/* Button to add medicine to cart */}
          <button
            onClick={handleAddToCart}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add to Cart
          </button>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Cart</h2>

          {/* Display cart items */}
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

          {/* Display total amount */}
          <div className="mt-4">
            <strong>Total: Tsh.{total.toFixed(2)}</strong>
          </div>

          {/* Select payment method */}
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

            {/* Button to complete sale */}
            <button
              onClick={handleCompleteSale}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full mb-2"
            >
              <ShoppingCart className="inline-block mr-2" />
              Complete Sale
            </button>

            {/* Button to print receipt */}
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
