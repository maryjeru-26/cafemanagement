import React, { useState, useEffect, useContext } from "react";
import "./UserMenu.css";
// Beverage images
import chocMilkshakeImg from "../assets/images/chocolatemilkshake.jpg";
import lemonSodaImg from "../assets/images/Classic Lemon Soda.jpg";
import coldCoffeeImg from "../assets/images/Cold Coffee Frappe.jpg";
import strawberryImg from "../assets/images/Strawberry Smoothie.jpg";
import mangoIcedTeaImg from "../assets/images/Mango Iced tea.jpg";
import mintMojitoImg from "../assets/images/Mint Mojito.jpg";
// Coffee images
import cafeLatteImg from "../assets/images/Café Latte.jpg";
import cappuccinoImg from "../assets/images/cappuccino.jpg";
import caramelMacchiatoImg from "../assets/images/Caramel Macchiato.avif";
import coldBrewImg from "../assets/images/Cold Brew Coffee.webp";
import espressoShotImg from "../assets/images/Espresso Shot.webp";
import mochaImg from "../assets/images/Mocha Coffee.png";
// Dessert images
import blueberryCheesecakeImg from "../assets/images/Blueberry Cheesecake.jpg";
import butterscotchCupcakeImg from "../assets/images/Butterscotch Cupcake.webp";
import chocoLavaCakeImg from "../assets/images/Choco Lava Cake.webp";
import redVelvetPastryImg from "../assets/images/Red Velvet Pastry.jpg";
import vanillaSundaeImg from "../assets/images/Vanilla Ice Cream Sundae.jpg";
import warmChocoCookieImg from "../assets/images/Warm Choco Chip Cookie.jpg";
// Burger images
import cheeseBurstImg from "../assets/images/Cheese Burst Veggie Burger.webp";
import classicChickenBurgerImg from "../assets/images/Classic Chicken Burger.jpg";
import crispyFishBurgerImg from "../assets/images/Crispy Fish Burger.jpg";
import doubleBeefImg from "../assets/images/Double Beef BBQ Burger.jpg";
import mushroomSwissImg from "../assets/images/Mushroom & Swiss Cheese Burger.jpg";
import spicyPaneerImg from "../assets/images/Spicy Paneer Tikka Burger.jpg";
// Fries / Sides images
import bbqWedgesImg from "../assets/images/BBQ Potato Wedges.webp";
import cheesyLoadedFriesImg from "../assets/images/Cheesy Loaded Fries.webp";
import classicSaltedFriesImg from "../assets/images/Classic Salted Fries.webp";
import crispyPepperFriesImg from "../assets/images/Crispy Pepper Fries.webp";
import periPeriMasalaFriesImg from "../assets/images/Peri Peri Masala Fries.png";
import sweetPotatoFriesImg from "../assets/images/Sweet Potato Fries.jpg";
// Pasta images
import cheesyBakedMacImg from "../assets/images/Cheesy Baked Mac & Cheese.jpg";
import chickenPenneImg from "../assets/images/Chicken Penne in Creamy Sauce.jpg";
import classicAlfredoPastaImg from "../assets/images/Classic Alfredo Pasta (White Sauce).jpg";
import pestoBasilPastaImg from "../assets/images/Pesto Basil Pasta.jpg";
import spicyArrabbiataPastaImg from "../assets/images/Spicy Arrabbiata Pasta (Red Sauce).jpg";
import veggieLoadedFusilliPastaImg from "../assets/images/Veggie Loaded Fusilli Pasta.jpg";
import saladPlaceholderImg from "../assets/images/salad-placeholder.svg";
// Salad images
import caesarSaladImg from "../assets/images/Caesar Salad with Chicken.jpg";
import freshGardenSaladImg from "../assets/images/Fresh Garden Salad.jpg";
import greekSaladImg from "../assets/images/Greek Salad.jpg";
import paneerCornDelightImg from "../assets/images/Paneer & Corn Delight Salad.jpg";
import quinoaAvocadoSaladImg from "../assets/images/Quinoa & Avocado Salad.jpg";
import tunaEggProteinSaladImg from "../assets/images/Tuna & Egg Protein Salad.jpg";
// Pizza images
import bbqChickenPizzaImg from "../assets/images/BBQ Chicken Pizza.jpg";
import cheeseBurstSupremePizzaImg from "../assets/images/Cheese Burst Supreme Pizza.avif";
import farmhouseVeggiePizzaImg from "../assets/images/Farmhouse Veggie Pizza.webp";
import margheritaPizzaImg from "../assets/images/Margherita Pizza.webp";
import paneerTandooriPizzaImg from "../assets/images/Paneer Tandoori Pizza.webp";
import pepperoniFeastPizzaImg from "../assets/images/Pepperoni Feast Pizza.jpg";
// Sandwich images
import cheeseCornSandwichImg from "../assets/images/Cheese & Corn Sandwich.jpg";
import clubChickenSandwichImg from "../assets/images/Club Chicken Sandwich.jpg";
import eggMayoSandwichImg from "../assets/images/Egg Mayo Sandwich.webp";
import grilledVegSandwichImg from "../assets/images/Grilled Veg Sandwich.webp";
import paneerTikkaSandwichImg from "../assets/images/Paneer Tikka Sandwich.webp";
import tunaMeltSandImg from "../assets/images/Tuna Melt Sandwich.webp";
import { CartContext } from "./CartContext";
import { apiGet } from "../utils/api";

const UserMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(6);
  const [sortBy, setSortBy] = useState("itemName");
  const [sortDirection, setSortDirection] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        // Fetch full list (client-side pagination + filtering + sorting)
        const data = await apiGet("/api/menu");
        setMenuItems(Array.isArray(data) ? data : []);
      } catch (err) {
        alert(err.message);
      }
    };
    fetchMenu();
  }, []);

  // Filter and sort menu items
  const getFilteredMenuItems = () => {
    // Apply filters
    let items = menuItems.filter(item => {
      // Category filter
      if (selectedCategory && selectedCategory !== "All") {
        if (!item.category || item.category.toLowerCase() !== selectedCategory.toLowerCase()) return false;
      }
      if (searchTerm === "") return true;
      return item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
             item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
             item.price.toString().includes(searchTerm);
    });

    // Apply sorting
    const sortMultiplier = sortDirection === "asc" ? 1 : -1;
    items.sort((a, b) => {
      let aVal, bVal;
      if (sortBy === "price") {
        aVal = parseFloat(a.price || 0);
        bVal = parseFloat(b.price || 0);
      } else if (sortBy === "category") {
        aVal = (a.category || "").toLowerCase();
        bVal = (b.category || "").toLowerCase();
      } else {
        // itemName (default)
        aVal = (a.itemName || "").toLowerCase();
        bVal = (b.itemName || "").toLowerCase();
      }
      
      if (aVal < bVal) return -1 * sortMultiplier;
      if (aVal > bVal) return 1 * sortMultiplier;
      return 0;
    });

    return items;
  };

  // Derived client-side pagination
  const filteredItems = getFilteredMenuItems();
  const derivedTotalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const displayedItems = filteredItems.slice(currentPage * pageSize, currentPage * pageSize + pageSize);

  // map product names to images (case-insensitive)
  const imageMap = {
    "chocolate milkshake": chocMilkshakeImg,
    "chocolatemilkshake": chocMilkshakeImg,
    "classic lemon soda": lemonSodaImg,
    "cold coffee frappe": coldCoffeeImg,
    "strawberry smoothie": strawberryImg,
    "mango iced tea": mangoIcedTeaImg,
    "mint mojito": mintMojitoImg,
    // coffee
    "cafe latte": cafeLatteImg,
    "café latte": cafeLatteImg,
    "cappuccino": cappuccinoImg,
    "caramel macchiato": caramelMacchiatoImg,
    "cold brew": coldBrewImg,
    "cold brew coffee": coldBrewImg,
    "espresso shot": espressoShotImg,
    "espresso": espressoShotImg,
    "mocha coffee": mochaImg,
    "mocha": mochaImg,
  // desserts
  "blueberry cheesecake": blueberryCheesecakeImg,
  "butterscotch cupcake": butterscotchCupcakeImg,
  "choco lava cake": chocoLavaCakeImg,
  "choco lava": chocoLavaCakeImg,
  "red velvet pastry": redVelvetPastryImg,
  "vanilla ice cream sundae": vanillaSundaeImg,
  "vanilla ice cream": vanillaSundaeImg,
  "warm choco chip cookie": warmChocoCookieImg,
  "choco chip cookie": warmChocoCookieImg,
    // burgers
    "cheese burst veggie burger": cheeseBurstImg,
    "cheese burst": cheeseBurstImg,
    "classic chicken burger": classicChickenBurgerImg,
    "crispy fish burger": crispyFishBurgerImg,
    "double beef bbq burger": doubleBeefImg,
    "double beef": doubleBeefImg,
    "mushroom & swiss cheese burger": mushroomSwissImg,
    "mushroom swiss": mushroomSwissImg,
    "spicy paneer tikka burger": spicyPaneerImg,
    "paneer tikka": spicyPaneerImg,
  // pizzas
  "bbq chicken pizza": bbqChickenPizzaImg,
  "bbq chicken": bbqChickenPizzaImg,
  "cheese burst supreme pizza": cheeseBurstSupremePizzaImg,
  "cheese burst supreme": cheeseBurstSupremePizzaImg,
  "farmhouse veggie pizza": farmhouseVeggiePizzaImg,
  "farmhouse veggie": farmhouseVeggiePizzaImg,
  "margherita pizza": margheritaPizzaImg,
  "margherita": margheritaPizzaImg,
  "paneer tandoori pizza": paneerTandooriPizzaImg,
  "paneer tandoori": paneerTandooriPizzaImg,
  "pepperoni feast pizza": pepperoniFeastPizzaImg,
  "pepperoni feast": pepperoniFeastPizzaImg,
    // salads
    "caesar salad with chicken": caesarSaladImg,
    "caesar salad": caesarSaladImg,
    "fresh garden salad": freshGardenSaladImg,
    "greek salad": greekSaladImg,
    "paneer & corn delight salad": paneerCornDelightImg,
    "paneer & corn salad": paneerCornDelightImg,
    "quinoa & avocado salad": quinoaAvocadoSaladImg,
  "tuna & egg protein salad": tunaEggProteinSaladImg,
  "tuna & egg salad": tunaEggProteinSaladImg,
  // pastas
  "cheesy baked mac & cheese": cheesyBakedMacImg,
  "cheesy baked mac and cheese": cheesyBakedMacImg,
  "cheesy baked mac": cheesyBakedMacImg,
  "chicken penne in creamy sauce": chickenPenneImg,
  "chicken penne": chickenPenneImg,
  "classic alfredo pasta (white sauce)": classicAlfredoPastaImg,
  "classic alfredo pasta": classicAlfredoPastaImg,
  "alfredo pasta": classicAlfredoPastaImg,
  "pesto basil pasta": pestoBasilPastaImg,
  "pesto basil": pestoBasilPastaImg,
  "spicy arrabbiata pasta (red sauce)": spicyArrabbiataPastaImg,
  "spicy arrabbiata pasta": spicyArrabbiataPastaImg,
  "arrabbiata pasta": spicyArrabbiataPastaImg,
  "veggie loaded fusilli pasta": veggieLoadedFusilliPastaImg,
  "veggie loaded fusilli": veggieLoadedFusilliPastaImg,
  "veggie loaded": veggieLoadedFusilliPastaImg,
    // fries / sides
    "bbq potato wedges": bbqWedgesImg,
    "bbq wedges": bbqWedgesImg,
    "cheesy loaded fries": cheesyLoadedFriesImg,
    "cheesy fries": cheesyLoadedFriesImg,
    "classic salted fries": classicSaltedFriesImg,
    "salted fries": classicSaltedFriesImg,
    "crispy pepper fries": crispyPepperFriesImg,
    "crispy pepper": crispyPepperFriesImg,
    "peri peri masala fries": periPeriMasalaFriesImg,
    "peri peri fries": periPeriMasalaFriesImg,
    "sweet potato fries": sweetPotatoFriesImg,
    "sweet potato": sweetPotatoFriesImg,
  };

  // sandwiches
  imageMap["cheese & corn sandwich"] = cheeseCornSandwichImg;
  imageMap["cheese and corn sandwich"] = cheeseCornSandwichImg;
  imageMap["club chicken sandwich"] = clubChickenSandwichImg;
  imageMap["egg mayo sandwich"] = eggMayoSandwichImg;
  imageMap["grilled veg sandwich"] = grilledVegSandwichImg;
  imageMap["grilled veg"] = grilledVegSandwichImg;
  imageMap["paneer tikka sandwich"] = paneerTikkaSandwichImg;
  imageMap["paneer tikka"] = paneerTikkaSandwichImg;
  imageMap["tuna melt sandwich"] = tunaMeltSandImg;
  imageMap["tuna melt"] = tunaMeltSandImg;

  // now accepts optional category so we can return a category fallback (e.g., Salad)
  const getImageForItem = (name, category) => {
    if (!name && !category) return null;
    const key = name ? name.toString().trim().toLowerCase() : "";
    // try exact keys first
    if (key && imageMap[key]) return imageMap[key];
    // try substring matching
    for (const k of Object.keys(imageMap)) {
      if (key.includes(k)) return imageMap[k];
    }
    // category-based fallback: show a salad placeholder for items in Salad category
    if (category && category.toString().trim().toLowerCase() === "salad") {
      return saladPlaceholderImg;
    }
    return null;
  };

  return (
    <div className="user-menu">
      <h2>Menu</h2>

      <div className="user-layout">
        <aside className="sidebar">
          <div className="sidebar-title">Categories</div>
          <ul className="category-list">
            <li>
              <button
                className={selectedCategory === "All" ? "category-btn active" : "category-btn"}
                onClick={() => { setSelectedCategory("All"); setCurrentPage(0); }}
              >
                All
              </button>
            </li>
            {Array.from(new Set(menuItems.map(i => i.category).filter(Boolean))).sort().map(cat => (
              <li key={cat}>
                <button
                  className={selectedCategory === cat ? "category-btn active" : "category-btn"}
                  onClick={() => { setSelectedCategory(cat); setCurrentPage(0); }}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <main className="user-content">
          <div className="menu-controls">
        <div className="search-controls">
          <label>🔍 Search:</label>
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(0); }}
            placeholder="Search by name, category, or price..."
          />
        </div>
        <div className="sort-controls">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => {
            setSortBy(e.target.value);
            setCurrentPage(0);
          }}>
            <option value="itemName">Name</option>
            <option value="price">Price</option>
            <option value="category">Category</option>
          </select>
          <select value={sortDirection} onChange={(e) => {
            setSortDirection(e.target.value);
            setCurrentPage(0);
          }}>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

          <div className="menu-info" style={{ padding: "10px", textAlign: "center", color: "#666", fontSize: "0.9rem" }}>
        Showing {displayedItems.length > 0 ? currentPage * pageSize + 1 : 0} - {Math.min((currentPage + 1) * pageSize, filteredItems.length)} of {filteredItems.length} items
          </div>

          <div className="menu-grid">
        {filteredItems.length === 0 ? (
          <div className="no-results">No menu items match your search.</div>
        ) : (
          displayedItems.map((item) => (
            <div key={item.id} className="menu-card">
              {getImageForItem(item.itemName, item.category) ? (
                <img src={getImageForItem(item.itemName, item.category)} alt={item.itemName} className="menu-image" />
              ) : null}

              <div className="menu-name">{item.itemName}</div>
              <div className="menu-category">Category: {item.category}</div>
              <div className="menu-price">Price: ₹{item.price}</div>
              <div className="menu-status">Status: {item.available ? "Available" : "Unavailable"}</div>
              <button className="add-to-cart-btn" onClick={() => addToCart(item)} disabled={!item.available}>
                Add to Cart
              </button>
            </div>
          ))
        )}
      </div>

          <div className="pagination-controls">
        <button 
          onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
          disabled={currentPage === 0}
        >
          Previous
        </button>
        <span className="page-info">
          Page {Math.min(currentPage + 1, derivedTotalPages)} of {derivedTotalPages}
        </span>
        <button 
          onClick={() => setCurrentPage(prev => Math.min(derivedTotalPages - 1, prev + 1))}
          disabled={currentPage >= derivedTotalPages - 1}
        >
          Next
        </button>
        <select value={pageSize} onChange={(e) => {
          setPageSize(Number(e.target.value));
          setCurrentPage(0);
        }}>
          <option value="6">6 per page</option>
          <option value="12">12 per page</option>
          <option value="24">24 per page</option>
        </select>
      </div>
        </main>
      </div>
    </div>
  );
};

export default UserMenu;
