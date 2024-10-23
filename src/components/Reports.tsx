import React, { useState } from 'react';
import { FileText, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // for exporting tables to PDF
import * as XLSX from 'xlsx'; // for exporting to Excel

interface ReportData {
  title: string;
  content: string[][];
}

const Reports: React.FC = () => {
  const [reportType, setReportType] = useState<string>('sales');
  const [dateRange, setDateRange] = useState<string>('daily');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [reportData, setReportData] = useState<ReportData | null>(null);

  // Mocked sales data
  const salesData = [
    { itemName: 'Paracetamol', quantity: 5, amount: 25.0 },
    { itemName: 'Ibuprofen', quantity: 3, amount: 15.0 },
    { itemName: 'Amoxicillin', quantity: 2, amount: 30.0 },
  ];

  const handleGenerateReport = () => {
    let data: string[][] = [];
    let title = '';

    switch (reportType) {
      case 'sales':
        title = 'Sales Report';
        let totalAmount = 0;

        // Create header
        data.push(['Medicine Name', 'Quantity Sold', 'Amount']);

        // Populate rows from sales data
        salesData.forEach((sale) => {
          data.push([sale.itemName, sale.quantity.toString(), `Tsh. ${sale.amount.toFixed(2)}`]);
          totalAmount += sale.amount;
        });

        // Add total amount row
        data.push(['', 'Total', `Tsh. ${totalAmount.toFixed(2)}`]);
        break;

      case 'inventory':
        title = 'Inventory Report';
        data = [
          ['Name', 'Batch Number', 'Expiry Date', 'Price', 'Quantity'],
          ['Paracetamol', 'BN123', '2025-01-01', '5.99', '100'],
          ['Amoxicillin', 'BN456', '2024-05-01', '12.50', '50'],
        ];
        break;

      case 'employee':
        title = 'Employee Collection Report';
        data = [
          ['Employee Name', 'Number of Transactions', 'Date', 'Amount Collected'],
          ['John Doe', '10', '2024-10-23', 'Tsh.250'],
          ['Jane Smith', '5', '2024-10-22', 'Tsh.100'],
        ];
        break;

      case 'dispensed':
        title = 'Dispensed Medication Report';
        data = [
          ['Item Name', 'Initial Balance', 'Sold Quantity', 'Remaining Quantity'],
          ['Paracetamol', '100', '30', '70'],
          ['Amoxicillin', '50', '10', '40'],
        ];
        break;

      default:
        data = [['No report available for the selected type.']];
    }

    setReportData({ title, content: data });
  };

  const handleExportPDF = () => {
    if (!reportData) return;

    const doc = new jsPDF();
    doc.text(reportData.title, 14, 20);
    doc.autoTable({
      head: [reportData.content[0]],
      body: reportData.content.slice(1),
      startY: 30,
    });
    doc.save(`${reportData.title}.pdf`);
  };

  const handleExportExcel = () => {
    if (!reportData) return;

    const worksheet = XLSX.utils.aoa_to_sheet(reportData.content);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, reportData.title);
    XLSX.writeFile(workbook, `${reportData.title}.xlsx`);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Reports</h1>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="report-type">
            Report Type
          </label>
          <select
            id="report-type"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="sales">Sales Report</option>
            <option value="inventory">Medicine Stock Report</option>
            <option value="employee">Employee Collection Report</option>
            <option value="dispensed">Dispensed Medicine Report</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date-range">
            Date Range
          </label>
          <select
            id="date-range"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        {/* Display date inputs only when "Custom" is selected */}
        {dateRange === 'custom' && (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="start-date">
              Start Date
            </label>
            <input
              placeholder='StarDate'
              type="date"
              id="start-date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <label className="block text-gray-700 text-sm font-bold mb-2 mt-4" htmlFor="end-date">
              End Date
            </label>
            <input
              type="date"
              id="end-date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        )}

        <div className="flex items-center justify-between">
          <button
            onClick={handleGenerateReport}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            <FileText className="inline-block mr-2" />
            Generate Report
          </button>
        </div>
      </div>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-xl font-bold mb-4">Report Preview</h2>
        {reportData ? (
          <div>
            <h3 className="font-bold">{reportData.title}</h3>
            <table className="min-w-full divide-y divide-gray-200 mt-4">
              <thead>
                <tr>
                  {reportData.content[0].map((header, index) => (
                    <th key={index} className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.content.slice(1).map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">Generated report will be displayed here.</p>
        )}
      </div>
      <div className="flex items-center justify-between">
        <button
          onClick={handleExportPDF}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
        >
          <Download className="inline-block mr-2" />
          Export PDF
        </button>
        <button
          onClick={handleExportExcel}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          <Download className="inline-block mr-2" />
          Export Excel
        </button>
      </div>
    </div>
  );
};

export default Reports;
