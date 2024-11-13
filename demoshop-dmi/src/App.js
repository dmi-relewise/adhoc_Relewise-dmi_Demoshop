import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import Frontpage from "./pages/Frontpage";
import SearchResultsPage from "./pages/SearchResultsPage";
import ProductListingPage from "./pages/ProductListingPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import CartPage from "./pages/CartPage";
import OrderReceiptPage from "./pages/OrderReceiptPage";
import Footer from "./components/Footer";
import { createProducts } from "./relewiseProduct";
import CookiebotScript from "./CookiebotScript";
import Header from "./components/Header";

function App() {
  const updateProductsOnRelewise = false;

  useEffect(() => {
    const fetchData = async () => {
      try {
        await createProducts();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    updateProductsOnRelewise
      ? fetchData()
      : console.log("Products not updated");
  }, []);

  CookiebotScript();
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Frontpage />} />
          <Route path="/searchresults" element={<SearchResultsPage />} />
          <Route path="/products" element={<ProductListingPage />} />
          <Route path="/product/:productId" element={<ProductDetailsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/order-receipt" element={<OrderReceiptPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
