import React, { useContext } from "react";
import { CartContext } from "./CartContext";
import "./Cart.css";
import { apiPost } from "../utils/api";

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } =
    useContext(CartContext);

  // ✅ Place Order Function
  const placeOrder = async () => {
    const userId = localStorage.getItem("userId");

    if (!userId) return alert("User not found in local storage");

    // 🔹 Calculate totals
    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const totalQuantity = cartItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    // 🔹 Prepare order object
    const orderData = {
      orderStatus: "PLACED",
      totalAmount,
      quantity: totalQuantity,
      user: { id: userId }, // ✅ send userId directly
      items: cartItems.map((item) => ({
        itemName: item.itemName,
        category: item.category,
        price: item.price,
        available: item.available,
      })),
    };

    try {
      await apiPost("/api/orders/addOrder", orderData);

      alert("Order placed successfully!");
      clearCart();
    } catch (error) {
      console.error("Order placement failed:", error);
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>

      {cartItems.length === 0 ? (
        <p>🛒 Your cart is empty</p>
      ) : (
        <>
          <table className="cart-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Category</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.itemName}</td>
                  <td>{item.category}</td>
                  <td>₹{item.price}</td>
                  <td>
                    <input
                      type="number"
                      value={item.quantity}
                      min={1}
                      onChange={(e) =>
                        updateQuantity(item.id, parseInt(e.target.value))
                      }
                    />
                  </td>
                  <td>₹{item.price * item.quantity}</td>
                  <td>
                    <button
                      className="remove-btn"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="cart-summary">
            <h3>
              Total: ₹
              {cartItems.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
              )}
            </h3>
            <button className="place-order-btn" onClick={placeOrder}>
              Place Order
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
