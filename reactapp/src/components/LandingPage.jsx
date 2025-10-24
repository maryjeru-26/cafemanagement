import React, { useState } from "react";
import "./LandingPage.css";
import LoginRegister from "./LoginRegister";

// Hero images
import hero1 from "../assets/images/hero1.jpg";
import hero2 from "../assets/images/hero2.jpg";
import hero3 from "../assets/images/hero3.jpg";
import hero4 from "../assets/images/hero4.jpg";
import hero5 from "../assets/images/hero5.jpg";
import hero6 from "../assets/images/hero6.jpg";
import hero7 from "../assets/images/hero7.jpg";

// Popular dishes images
import cappuccino from "../assets/images/cappuccino.jpg";
import vegSandwich from "../assets/images/vegSandwich.jpg";
import pastaAlfredo from "../assets/images/pastaAlfredo.jpg";
import chocolateCake from "../assets/images/chocolateCake.jpg";

// Promotions images
import promo1 from "../assets/images/promo1.jpg";
import promo2 from "../assets/images/promo2.jpg";
import promo3 from "../assets/images/promo3.jpg";

const heroImages = [hero1, hero2, hero3, hero4, hero5, hero6, hero7];

const popularDishes = [
  { name: "Cappuccino", img: cappuccino },
  { name: "Veg Sandwich", img: vegSandwich },
  { name: "Pasta Alfredo", img: pastaAlfredo },
  { name: "Chocolate Cake", img: chocolateCake },
];

const promotions = [
  { title: "20% Off on Coffee", img: promo1, desc: "Enjoy a 20% discount on all coffee orders this week!" },
  { title: "Buy 1 Get 1 Sandwich", img: promo2, desc: "Treat yourself with our special sandwich offer." },
  { title: "Free Dessert", img: promo3, desc: "Get a free dessert with every main course." },
];

const LandingPage = () => {
  const [showLogin, setShowLogin] = useState(false);

  // If login/register modal is active, show it
  if (showLogin) {
    return <LoginRegister onBack={() => setShowLogin(false)} />;
  }

  return (
    <div className="landing-page">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg custom-navbar shadow-sm">
        <div className="container">
          <a className="navbar-brand" href="/">
            <svg className="cafe-icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 21h18v-2H2M20 8h-2V5h2m0-2H4v10a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4v-1h2a2 2 0 0 0 2-2V5c0-1.11-.89-2-2-2M4 5h10v5.08A3.973 3.973 0 0 1 12 10H8a3.973 3.973 0 0 1-2 .08V5z"/>
            </svg>
            <span className="cafe-text">Café Amore</span>
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <button className="btn btn-custom me-2" onClick={() => setShowLogin(true)}>
              <svg className="btn-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/>
              </svg>
              Login
            </button>
            <button className="btn btn-custom" onClick={() => setShowLogin(true)}>
              <svg className="btn-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15,14C12.33,14 7,15.33 7,18V20H23V18C23,15.33 17.67,14 15,14M6,10V7H4V10H1V12H4V15H6V12H9V10M15,12A4,4 0 0,0 19,8A4,4 0 0,0 15,4A4,4 0 0,0 11,8A4,4 0 0,0 15,12Z"/>
              </svg>
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Grid Slider */}
      <section className="hero-slider-section">
        <div className="hero-slider">
          {heroImages.map((img, index) => (
            <div className="slide" key={index}>
              <img src={img} alt={`hero-${index}`} />
            </div>
          ))}
          {heroImages.map((img, index) => (
            <div className="slide" key={heroImages.length + index}>
              <img src={img} alt={`hero-${index}-repeat`} />
            </div>
          ))}
        </div>

        {/* Hero Content */}
        <div className="hero-content">
          <h1 className="display-5 fw-bold">Fresh & Delicious Meals</h1>
          <h2 className="fw-light mt-2"><b>Just a Click Away</b></h2>
          <p className="lead mt-3"><b>Explore our menu, reserve your table, or order online after logging in.</b></p>
          <button className="btn btn-red btn-lg mt-3" onClick={() => setShowLogin(true)}>Get Started</button>
        </div>
      </section>

      {/* About Us */}
      <section className="about text-center py-5">
        <div className="container">
          <h2 className="text-warning mb-4">About Us</h2>
          <p className="lead text-muted">
            Welcome to <strong>Café Amore</strong> — your cozy corner for freshly brewed coffee and delicious meals.
            Our chefs carefully craft every dish using the finest ingredients, bringing a perfect blend of flavor and aroma to your table.
          </p>
          <p className="lead text-muted mt-3">
            Whether you’re looking for a quick snack, a hearty meal, or a relaxing coffee break, we have something for everyone.
            Our ambiance is designed to make you feel at home, whether dining solo, with friends, or with family.
          </p>
        </div>
      </section>

      {/* Popular Dishes */}
      <section className="popular-dishes py-5 bg-light">
        <div className="container text-center">
          <h2 className="text-warning mb-4">Popular Dishes</h2>
          <div className="row">
            {popularDishes.map((dish, index) => (
              <div className="col-md-3 mb-4" key={index}>
                <div className="card h-100 shadow-sm">
                  <img src={dish.img} className="card-img-top" alt={dish.name} />
                  <div className="card-body">
                    <h5 className="card-title">{dish.name}</h5>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials py-5 bg-light">
        <div className="container text-center">
          <h2 className="text-warning mb-4">What Our Customers Say</h2>
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="card shadow-sm p-3">
                <p>"Amazing coffee and cozy ambiance!"</p>
                <div className="rating">
                  <span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span>
                </div>
                <h6>- John D</h6>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card shadow-sm p-3">
                <p>"Loved the pasta and desserts. Highly recommend!"</p>
                <div className="rating">
                  <span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span><span>☆</span>
                </div>
                <h6>- Maria K</h6>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card shadow-sm p-3">
                <p>"Friendly staff and delicious food. Will come back."</p>
                <div className="rating">
                  <span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span>
                </div>
                <h6>- Alex P</h6>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Promotions / Offers */}
      <section className="promotions py-5 bg-light">
        <div className="container text-center">
          <h2 className="text-warning mb-4">Special Offers</h2>
          <div className="row">
            {promotions.map((promo, index) => (
              <div className="col-md-4 mb-4" key={index}>
                <div className="card h-100 shadow-sm">
                  <img src={promo.img} className="card-img-top" alt={promo.title} />
                  <div className="card-body">
                    <h5 className="card-title">{promo.title}</h5>
                    <p className="card-text">{promo.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer text-white py-5">
        <div className="container">
          <div className="row">
            <div className="col-md-4 mb-3">
              <h5>About Café Amore</h5>
              <p>Serving the finest meals and freshly brewed coffee since 2025. Cozy ambiance, delicious food, and great service.</p>
            </div>
            <div className="col-md-4 mb-3">
              <h5>Contact</h5>
              <p>Email: info@cafearoma.com</p>
              <p>Phone: +91 9876543210</p>
              <p>Address: 123 Aroma Street, Coffee City, India</p>
            </div>
            <div className="col-md-4 mb-3">
              <h5>Follow Us</h5>
              <p>Facebook | Instagram | Twitter</p>
            </div>
          </div>
          <div className="text-center mt-3">
            <p className="mb-0">&copy; 2025 Café Aroma. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
