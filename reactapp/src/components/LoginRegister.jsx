import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginRegister.css";
import { apiPost } from "../utils/api";

const LoginRegister = ({ onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const data = await apiPost("/api/auth/login", { email, password });

      localStorage.setItem("jwt", data.token);
      localStorage.setItem("email", data.email);
      localStorage.setItem("roles", JSON.stringify(data.roles));
      localStorage.setItem("username", data.username);
      localStorage.setItem("userId", data.userId);

      if (data.roles.includes("ROLE_ADMIN")) navigate("/admin");
      else navigate("/user");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRegister = async () => {
    try {
      await apiPost("/api/users/addUser", { 
        username, 
        email, 
        password, 
        role: "ROLE_USER" 
      });

      alert("Registered successfully! Please login.");
      setIsLogin(true);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="login-register">
      {/* Decorative Background Elements */}
      <div className="bg-decoration">
        {[...Array(15)].map((_, i) => (
          <div key={i} className="bubble"></div>
        ))}
      </div>

     

      <div className={`flip-container ${isLogin ? "" : "flipped"}`}>
        <div className="flipper">
          {/* Login Form */}
          <div className="front form-box">
            <div className="cafe-header">
              <svg className="cafe-logo" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2 21h18v-2H2M20 8h-2V5h2m0-2H4v10a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4v-1h2a2 2 0 0 0 2-2V5c0-1.11-.89-2-2-2M4 5h10v5.08A3.973 3.973 0 0 1 12 10H8a3.973 3.973 0 0 1-2 .08V5z"/>
              </svg>
              <h1 className="cafe-name">Café Amore</h1>
            </div>
            
            <h2 className="form-title">Welcome Back</h2>
            <p className="form-subtitle">Sign in to your account</p>

            <div className="input-group">
              <svg className="input-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/>
              </svg>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="input-group">
              <svg className="input-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z"/>
              </svg>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button className="submit-btn" onClick={handleLogin}>
              <span>Sign In</span>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z"/>
              </svg>
            </button>

            <div className="divider">
              <span>New to Café Amore?</span>
            </div>

            <p className="switch-form" onClick={() => setIsLogin(false)}>
              Create an Account <strong>→</strong>
            </p>
          </div>

          {/* Register Form */}
          <div className="back form-box">
            <div className="cafe-header">
              <svg className="cafe-logo" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2 21h18v-2H2M20 8h-2V5h2m0-2H4v10a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4v-1h2a2 2 0 0 0 2-2V5c0-1.11-.89-2-2-2M4 5h10v5.08A3.973 3.973 0 0 1 12 10H8a3.973 3.973 0 0 1-2 .08V5z"/>
              </svg>
              <h1 className="cafe-name">Café Amore</h1>
            </div>
            
            <h2 className="form-title">Join Us Today</h2>
            <p className="form-subtitle">Create your account</p>

            <div className="input-group">
              <svg className="input-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/>
              </svg>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="input-group">
              <svg className="input-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z"/>
              </svg>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="input-group">
              <svg className="input-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z"/>
              </svg>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button className="submit-btn" onClick={handleRegister}>
              <span>Create Account</span>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z"/>
              </svg>
            </button>

            <div className="divider">
              <span>Already have an account?</span>
            </div>

            <p className="switch-form" onClick={() => setIsLogin(true)}>
              Sign In <strong>→</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;
