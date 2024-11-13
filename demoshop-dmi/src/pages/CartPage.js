import React, { useEffect, useState } from "react";
import { getSettings } from "../utils/SearchProductUtils";
import {
  PurchasedWithMultipleProductsBuilder,
  Recommender,
} from "@relewise/client";
import getUser from "../userFile";
import { Tracker } from "@relewise/client";

const recommender = new Recommender(
  process.env.REACT_APP_RELEWISE_KEY_1,
  process.env.REACT_APP_RELEWISE_KEY_2,
  { serverUrl: process.env.REACT_APP_RELEWISE_URL }
);

  const tracker = new Tracker(
    process.env.REACT_APP_RELEWISE_KEY_1,
    process.env.REACT_APP_RELEWISE_KEY_2,
    { serverUrl: process.env.REACT_APP_RELEWISE_URL }
  );

const CartPage = () => {
  const settings = getSettings("Cart Page");
  const [cartRecc, setCartRecc] = useState([]);

  const [cartItems, setCartItems] = useState([]);
  const [subTot, setSubTot] = useState(Number);

  const productsArray = cartItems.map((item) => ({
    productId: item.productId,
  }));

  const purchasedWithMultipleProductsBuilder =
    new PurchasedWithMultipleProductsBuilder(settings)
      .setSelectedProductProperties({
        displayName: true,
        pricing: true,
        allData: true,
      })
      .addProducts(productsArray)
      .setNumberOfRecommendations(4);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(cart);

    const cartRacc = async () => {
      try {
        const response =
          await recommender.recommendPurchasedWithMultipleProducts(
            purchasedWithMultipleProductsBuilder.build()
          );
        setCartRecc(response.recommendations);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      }
    };
    cartRacc();
  }, []);

  const completeOrder = async () => {
    const orderNumber = `ORD-${Math.floor(Math.random() * 1000000)}`;
    console.log("Completed order");

    const lineItems = cartItems.map((item) => ({
      lineTotal: parseFloat(item.salesPrice),
      productId: item.productId,
      quantity: item.quantity || 1,
    }));

    console.log(lineItems, "lineItems");

    // calculate the subtotal
    const subtotal = lineItems
      .reduce((sum, item) => sum + item.lineTotal, 0)
      .toFixed(2);
    

    try {
      await tracker.trackOrder({
        lineItems,
        subtotal: {
          amount: parseFloat(subtotal), 
          currency: "USD",
        },
        orderNumber,
        user: getUser(),
      });

      alert("Order completed and tracked successfully!");
      setTimeout(() => {
        localStorage.clear();
        setCartItems([]); 
      }, 1000); 
    } catch (error) {
      console.error("Error tracking order:", error);
      alert("There was an issue tracking the order.");
    }
  };
const subtotal = cartItems.reduce((sum, item) => sum + item.salesPrice, 0);

  return (
    <div className="container p-3">
      <h2 className="mt-1 text-center mb-4">Cart Page</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="d-flex flex-wrap">
          {cartItems.map((item, index) => (
            <div key={index} className="mb-2 p-3 w-25">
              <img
                src="/Ephoto.jpeg"
                alt={item.productName}
                className="w-100"
              />
              <p className="card-title fw-bold">{item.productName}</p>
              <p className="card-text fw-bold">{item.salesPrice}</p>
            </div>
          ))}
        </div>
      )}
      <div className="d-flex justify-content-end align-items-center">
        <div className="fw-bold">Total Amount: ${subtotal}</div>
        <button onClick={completeOrder} className="btn btn-dark ms-3">
          Checkout
        </button>
      </div>

      <h2 className="mt-5">You should also buy:</h2>
      <div className="d-flex flex-wrap">
        {Array.isArray(cartRecc) &&
          cartRecc.map((item, index) => (
            <div key={index} className="mb-2 p-3 w-25">
              <img
                src="/Ephoto.jpeg"
                alt={item.displayName}
                className="w-100"
              />
              <p className="card-title fw-bold">{item.displayName}</p>
              <p className="card-text fw-bold">{item.salesPrice}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default CartPage;
