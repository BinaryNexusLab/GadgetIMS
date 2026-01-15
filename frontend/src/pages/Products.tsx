import React, { useState } from "react";
import { Plus, Search } from "lucide-react";

export default function Products() {
  const [products] = useState([
    {
      id: 1,
      name: "Wireless Headphones",
      sku: "WH-001",
      category: "Audio",
      price: "$149.99",
      stock: 45,
      status: "In Stock",
    },
    {
      id: 2,
      name: "USB-C Cable",
      sku: "USB-001",
      category: "Cables",
      price: "$9.99",
      stock: 120,
      status: "In Stock",
    },
    {
      id: 3,
      name: "Laptop Stand",
      sku: "LS-001",
      category: "Accessories",
      price: "$89.99",
      stock: 30,
      status: "In Stock",
    },
    {
      id: 4,
      name: "Mechanical Keyboard",
      sku: "MK-001",
      category: "Input Devices",
      price: "$129.99",
      stock: 25,
      status: "In Stock",
    },
    {
      id: 5,
      name: "USB Hub",
      sku: "HUB-001",
      category: "Adapters",
      price: "$49.99",
      stock: 3,
      status: "Low Stock",
    },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-2">Manage your inventory products</p>
        </div>
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
          <Plus size={20} />
          Add Product
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Search size={20} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-gray-600 font-semibold">
                  Product Name
                </th>
                <th className="text-left py-3 px-4 text-gray-600 font-semibold">
                  SKU
                </th>
                <th className="text-left py-3 px-4 text-gray-600 font-semibold">
                  Category
                </th>
                <th className="text-left py-3 px-4 text-gray-600 font-semibold">
                  Price
                </th>
                <th className="text-left py-3 px-4 text-gray-600 font-semibold">
                  Stock
                </th>
                <th className="text-left py-3 px-4 text-gray-600 font-semibold">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-gray-600 font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4 text-gray-900 font-medium">
                    {product.name}
                  </td>
                  <td className="py-3 px-4 text-gray-600">{product.sku}</td>
                  <td className="py-3 px-4 text-gray-600">
                    {product.category}
                  </td>
                  <td className="py-3 px-4 text-gray-900">{product.price}</td>
                  <td className="py-3 px-4 text-gray-900">
                    {product.stock} units
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-medium ${
                        product.status === "In Stock"
                          ? "bg-green-100 text-green-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-blue-600 hover:text-blue-800 font-medium">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
