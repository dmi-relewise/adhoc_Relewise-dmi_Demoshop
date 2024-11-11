import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import Frontpage from './pages/Frontpage';
import SearchResultsPage from './pages/SearchResultsPage';
import ProductListingPage from './pages/ProductListingPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import OrderReceiptPage from './pages/OrderReceiptPage';
import Footer from './components/Footer';
import { createProducts } from './relewiseProduct';
import CookiebotScript from './CookiebotScript';
import Header from './components/Header';
function App() {
    // useEffect(() => {
    //   const fetchData = async () => {
    //     try {
    //       await createProducts();
    //     } catch (error) {
    //       console.error("Error fetching data:", error);
    //     }
    //   };
  
    //   fetchData();
    // }, []); 
    CookiebotScript();
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Frontpage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/products" element={<ProductListingPage />} />
          <Route path="/product/:productId" element={<ProductDetailsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/order-receipt" element={<OrderReceiptPage />} />
        </Routes>
        <Footer /> {/* Footer component */}
      </div>
    </Router>
  );
}

export default App;
