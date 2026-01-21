import React from "react";
import {
  BarChart3,
  Package,
  AlertTriangle,
  DollarSign,
  ShoppingCart,
} from "lucide-react";

export default function Dashboard() {
  // Sample data - will be replaced with API calls
  const stats = [
    {
      label: "Total Sales",
      value: "$45,250",
      change: "+12.5%",
      icon: DollarSign,
      color: "bg-blue-500",
    },
    {
      label: "Total Products",
      value: "284",
      change: "+8 this month",
      icon: Package,
      color: "bg-green-500",
    },
    {
      label: "Low Stock Items",
      value: "12",
      change: "Action needed",
      icon: AlertTriangle,
      color: "bg-orange-500",
    },
    {
      label: "Inventory Value",
      value: "$125,430",
      change: "+5.2%",
      icon: BarChart3,
      color: "bg-purple-500",
    },
    {
      label: "Today's Orders",
      value: "23",
      change: "+3 pending",
      icon: ShoppingCart,
      color: "bg-pink-500",
    },
  ];

  const recentSales = [
    {
      id: 1,
      product: "Wireless Headphones",
      quantity: 2,
      price: "$149.99",
      date: "2026-01-15",
      status: "Completed",
    },
    {
      id: 2,
      product: "USB-C Cable",
      quantity: 5,
      price: "$9.99",
      date: "2026-01-15",
      status: "Completed",
    },
    {
      id: 3,
      product: "Laptop Stand",
      quantity: 1,
      price: "$89.99",
      date: "2026-01-14",
      status: "Processing",
    },
    {
      id: 4,
      product: "Mechanical Keyboard",
      quantity: 3,
      price: "$129.99",
      date: "2026-01-14",
      status: "Completed",
    },
  ];

  const lowStockItems = [
    { id: 1, product: "USB Hub", current: 3, reorder: 20, status: "Critical" },
    {
      id: 2,
      product: "HDMI Cable",
      current: 5,
      reorder: 50,
      status: "Critical",
    },
    {
      id: 3,
      product: "Phone Case",
      current: 8,
      reorder: 30,
      status: "Warning",
    },
    {
      id: 4,
      product: "Screen Protector",
      current: 10,
      reorder: 50,
      status: "Warning",
    },
    { id: 5, product: "Power Bank", current: 15, reorder: 40, status: "Low" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome to Gadget Inventory Management System
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon size={24} className="text-white" />
                </div>
                <span className="text-sm font-semibold text-green-600">
                  {stat.change}
                </span>
              </div>
              <p className="text-gray-600 text-sm">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Sales Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Recent Sales
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-2 text-gray-600 font-medium">
                    Product
                  </th>
                  <th className="text-left py-2 px-2 text-gray-600 font-medium">
                    Qty
                  </th>
                  <th className="text-left py-2 px-2 text-gray-600 font-medium">
                    Price
                  </th>
                  <th className="text-left py-2 px-2 text-gray-600 font-medium">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentSales.map((sale) => (
                  <tr
                    key={sale.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-2 text-gray-900">{sale.product}</td>
                    <td className="py-3 px-2 text-gray-900">{sale.quantity}</td>
                    <td className="py-3 px-2 text-gray-900">{sale.price}</td>
                    <td className="py-3 px-2">
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-medium ${
                          sale.status === "Completed"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {sale.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Items Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Low Stock Items
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-2 text-gray-600 font-medium">
                    Product
                  </th>
                  <th className="text-left py-2 px-2 text-gray-600 font-medium">
                    Current
                  </th>
                  <th className="text-left py-2 px-2 text-gray-600 font-medium">
                    Reorder
                  </th>
                  <th className="text-left py-2 px-2 text-gray-600 font-medium">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {lowStockItems.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-2 text-gray-900">{item.product}</td>
                    <td className="py-3 px-2 text-gray-900">{item.current}</td>
                    <td className="py-3 px-2 text-gray-900">{item.reorder}</td>
                    <td className="py-3 px-2">
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-medium ${
                          item.status === "Critical"
                            ? "bg-red-100 text-red-700"
                            : item.status === "Warning"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
