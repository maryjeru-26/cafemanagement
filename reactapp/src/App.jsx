import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import UserDashboard from "./components/UserDashboard";
import AdminDashboard from "./components/AdminDashboard";
import AdminMenu from "./components/AdminMenu";
import { CartProvider } from "./components/CartContext";
import CartPage from "./components/CartPage";

const App = () => {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/user" element={<UserDashboard />} />
          <Route path="/cart" element={<CartPage />} />
          <Route
            path="/admin"
            element={
              <AdminDashboard>
                <AdminMenu />
              </AdminDashboard>
            }
          />
        </Routes>
      </Router>
    </CartProvider>
  );
};

export default App;
