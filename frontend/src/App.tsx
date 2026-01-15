import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import DailySale from "./pages/DailySale";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/daily-sale" element={<DailySale />} />
          <Route path="/products" element={<Products />} />
          <Route
            path="/sales"
            element={
              <div className="text-2xl font-bold">Sales Page (Coming Soon)</div>
            }
          />
          <Route
            path="/purchases"
            element={
              <div className="text-2xl font-bold">
                Purchases Page (Coming Soon)
              </div>
            }
          />
          <Route
            path="/customers"
            element={
              <div className="text-2xl font-bold">
                Customers Page (Coming Soon)
              </div>
            }
          />
          <Route
            path="/suppliers"
            element={
              <div className="text-2xl font-bold">
                Suppliers Page (Coming Soon)
              </div>
            }
          />
          <Route
            path="/alerts"
            element={
              <div className="text-2xl font-bold">
                Inventory Alerts (Coming Soon)
              </div>
            }
          />
          <Route
            path="/reports"
            element={
              <div className="text-2xl font-bold">
                Reports Page (Coming Soon)
              </div>
            }
          />
          <Route
            path="/settings"
            element={
              <div className="text-2xl font-bold">
                Settings Page (Coming Soon)
              </div>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
