import React, { useState, useEffect } from "react";
import { Plus, Trash2, Calendar, FileText } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface SaleItem {
  id: string;
  modelName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface DBSaleItem {
  id: number;
  sale_id: number;
  model_name: string;
  quantity: number;
  unit_price: number;
  total: number;
  created_at: string;
}

interface DBSale {
  id: number;
  sale_date: string;
  total_amount: number;
  created_at: string;
  items?: DBSaleItem[];
}

export default function DailySale() {
  const [items, setItems] = useState<SaleItem[]>([]);
  const [modelName, setModelName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unitPrice, setUnitPrice] = useState("");

  const [salesData, setSalesData] = useState<DBSale[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [loading, setLoading] = useState(false);

  // Fetch sales data from backend
  useEffect(() => {
    fetchSalesData();
  }, [selectedDate]);

  const fetchSalesData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/sales?date=${selectedDate}`
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      setSalesData(data);
    } catch (error) {
      console.error("Error fetching sales:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    if (!modelName || !quantity || !unitPrice) {
      alert("Please fill in all fields");
      return;
    }

    const qty = Number(quantity);
    const price = Number(unitPrice);
    const total = qty * price;

    const newItem: SaleItem = {
      id: Date.now().toString(),
      modelName,
      quantity: qty,
      unitPrice: price,
      total,
    };

    setItems([...items, newItem]);
    setModelName("");
    setQuantity("");
    setUnitPrice("");
  };

  const handleDeleteItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const grandTotal = items.reduce((sum, item) => sum + item.total, 0);

  // Calculate total for selected date
  const dayTotal = salesData.reduce(
    (sum, sale) => sum + Number(sale.total_amount),
    0
  );
  const totalItems = salesData.reduce(
    (sum, sale) => sum + (sale.items?.length || 0),
    0
  );

  const handleSave = async () => {
    if (items.length === 0) {
      alert("Please add at least one product");
      return;
    }

    try {
      const saleData = {
        items,
        total_amount: grandTotal,
        sale_date: selectedDate,
      };

      const response = await fetch("http://localhost:5000/api/sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(saleData),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      alert(
        `Sale saved successfully! Sale ID: ${
          data.saleId
        }\nTotal: $${grandTotal.toFixed(2)}`
      );
      setItems([]);
      fetchSalesData(); // Refresh the data
    } catch (error) {
      console.error("Error saving sale:", error);
      alert(
        `Error saving sale: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  const generatePrintPDF = async () => {
    if (salesData.length === 0) {
      alert("No sales data available to print");
      return;
    }

    try {
      // Create a temporary container for the table
      const tempDiv = document.createElement("div");
      tempDiv.style.position = "absolute";
      tempDiv.style.left = "-9999px";
      tempDiv.style.background = "white";
      tempDiv.style.padding = "20px";

      // Build table HTML
      let tableHTML = `
        <div style="font-family: Arial, sans-serif; width: 600px;">
          <h2 style="text-align: center; margin-bottom: 20px;">Daily Sales Report</h2>
          <p style="text-align: center; margin-bottom: 20px; font-size: 12px;">Date: ${selectedDate}</p>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="border-bottom: 2px solid #000;">
                <th style="padding: 8px; text-align: left; font-weight: bold;">Serial No</th>
                <th style="padding: 8px; text-align: left; font-weight: bold;">Product</th>
                <th style="padding: 8px; text-align: center; font-weight: bold;">Quantity</th>
                <th style="padding: 8px; text-align: right; font-weight: bold;">Unit Price</th>
                <th style="padding: 8px; text-align: right; font-weight: bold;">Total</th>
              </tr>
            </thead>
            <tbody>
      `;

      let serialNo = 1;
      let totalAmount = 0;

      salesData.forEach((sale) => {
        if (sale.items && sale.items.length > 0) {
          sale.items.forEach((item) => {
            const itemTotal = Number(item.total);
            totalAmount += itemTotal;
            tableHTML += `
              <tr style="border-bottom: 1px solid #ccc;">
                <td style="padding: 8px;">${serialNo}</td>
                <td style="padding: 8px;">${item.model_name}</td>
                <td style="padding: 8px; text-align: center;">${
                  item.quantity
                }</td>
                <td style="padding: 8px; text-align: right;">$${Number(
                  item.unit_price
                ).toFixed(2)}</td>
                <td style="padding: 8px; text-align: right;">$${itemTotal.toFixed(
                  2
                )}</td>
              </tr>
            `;
            serialNo++;
          });
        }
      });

      tableHTML += `
            </tbody>
          </table>
          <div style="margin-top: 20px; border-top: 2px solid #000; padding-top: 10px;">
            <div style="display: flex; justify-content: flex-end;">
              <div>
                <p style="margin: 0; font-weight: bold;">Daily Total: <span style="font-size: 18px;">$${totalAmount.toFixed(
                  2
                )}</span></p>
              </div>
            </div>
          </div>
        </div>
      `;

      tempDiv.innerHTML = tableHTML;
      document.body.appendChild(tempDiv);

      // Convert to canvas
      const canvas = await html2canvas(tempDiv, {
        backgroundColor: "#ffffff",
        scale: 2,
      });

      // Create PDF
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      const imgData = canvas.toDataURL("image/png");

      while (heightLeft >= 0) {
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        position -= pageHeight;

        if (heightLeft > 0) {
          pdf.addPage();
        }
      }

      pdf.save(`daily_sales_${selectedDate}.pdf`);
      document.body.removeChild(tempDiv);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Daily Sale</h1>
        <p className="text-gray-600 mt-2">
          Record and view daily sales transactions
        </p>
      </div>

      {/* Add Product Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Add Product to Sale
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sale Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Model Name
            </label>
            <input
              type="text"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              placeholder="e.g., iPhone 15 Pro"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="1"
              min="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Unit Price
            </label>
            <input
              type="number"
              value={unitPrice}
              onChange={(e) => setUnitPrice(e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleAddProduct}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 font-medium"
            >
              <Plus size={20} />
              Add
            </button>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleSave}
              disabled={items.length === 0}
              className="w-full bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Save Sale
            </button>
          </div>
        </div>
      </div>

      {/* Current Sale Items to Add */}
      {items.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Items to Save ({items.length})
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">
                    Model Name
                  </th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">
                    Quantity
                  </th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">
                    Unit Price
                  </th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">
                    Total
                  </th>
                  <th className="text-center py-3 px-4 text-gray-600 font-semibold">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 text-gray-900 font-medium">
                      {item.modelName}
                    </td>
                    <td className="py-3 px-4 text-gray-900">{item.quantity}</td>
                    <td className="py-3 px-4 text-gray-900">
                      ${item.unitPrice.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-gray-900 font-semibold">
                      ${item.total.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-red-600 hover:text-red-800 inline-flex items-center gap-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-4 flex justify-end">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 w-full md:w-64">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">
                    Pending Total:
                  </span>
                  <span className="text-2xl font-bold text-blue-600">
                    ${grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Daily Sales Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Sales for {selectedDate}
          </h2>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar size={16} />
              <span>{totalItems} items sold</span>
            </div>
            <button
              onClick={generatePrintPDF}
              disabled={salesData.length === 0}
              className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
            >
              <FileText size={18} />
              Print Sale
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : salesData.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No sales recorded for {selectedDate}</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold">
                      Sale ID
                    </th>
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold">
                      Model Name
                    </th>
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold">
                      Quantity
                    </th>
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold">
                      Unit Price
                    </th>
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold">
                      Total
                    </th>
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold">
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {salesData.map((sale) =>
                    sale.items && sale.items.length > 0
                      ? sale.items.map((item) => (
                          <tr
                            key={item.id}
                            className="border-b border-gray-100 hover:bg-gray-50"
                          >
                            <td className="py-3 px-4 text-gray-900 font-medium">
                              #{sale.id}
                            </td>
                            <td className="py-3 px-4 text-gray-900">
                              {item.model_name}
                            </td>
                            <td className="py-3 px-4 text-gray-900">
                              {item.quantity}
                            </td>
                            <td className="py-3 px-4 text-gray-900">
                              ${Number(item.unit_price).toFixed(2)}
                            </td>
                            <td className="py-3 px-4 text-gray-900 font-semibold">
                              ${Number(item.total).toFixed(2)}
                            </td>
                            <td className="py-3 px-4 text-gray-600 text-xs">
                              {new Date(item.created_at).toLocaleTimeString()}
                            </td>
                          </tr>
                        ))
                      : null
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex justify-end">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 w-full md:w-64">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">
                    Daily Total:
                  </span>
                  <span className="text-2xl font-bold text-green-600">
                    ${Number(dayTotal).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
