import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import jsonData from "../product.json";
import getUser from "../userFile";
import { Tracker } from "@relewise/client";
import Raccom from "../components/Raccom";

const ProductDetailsPage = () => {
  const { productId } = useParams();
  const products = JSON.parse(JSON.stringify(jsonData));
  const product = products.find((item) => item.productId === productId);

  const tracker = new Tracker(
    process.env.REACT_APP_RELEWISE_KEY_1,
    process.env.REACT_APP_RELEWISE_KEY_2,
    { serverUrl: process.env.REACT_APP_RELEWISE_URL }
  );

  useEffect(() => {
    const pdpTracker = async () => {
      try {
        await tracker.trackProductView({
          productId,
          user: getUser(),
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    pdpTracker();
  }, [productId, tracker]);


const cleanPrice = (price) => {
  if (typeof price === "string") {
      price = price.replace(/[^0-9.]/g, "");
  }
  return parseFloat(price); 
};

const addToCart = async () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  let price = cleanPrice(product.salesPrice);

  const productToAdd = {
    productId: product.productId,
    productName: product.productName,
    salesPrice: price, 
    quantity: 1
  };

  cart.push(productToAdd);
  localStorage.setItem("cart", JSON.stringify(cart));
  console.log(cart)
  alert("Product added to cart!");

  const lineItems = cart.map((item) => ({
    lineTotal: cleanPrice(item.salesPrice), 
    productId: item.productId,
    quantity: 1
  }));

  const subtotalAmount = lineItems
    .reduce((total, item) => total + item.lineTotal, 0)
    .toFixed(2); 

    cart.push(subtotalAmount);

  try {
    await tracker.trackCart({
      lineItems,
      subtotal: {
        amount: parseFloat(subtotalAmount), 
        currency: "usd", 
      },
      user: getUser(),
    });
    
  } catch (error) {
    console.error("Error tracking cart:", error);
  }
};

  return (
    <div className="container p-5 text-center">
      <img src="/Ephoto.jpeg" alt="image" className="w-50" />
      <p>{product.productName}</p>
      <p className="fw-bold">{product.salesPrice}</p>
      <button className="btn btn-dark" onClick={addToCart}>
        Add to Cart
      </button>
      <Raccom />
    </div>
  );
};

export default ProductDetailsPage;
