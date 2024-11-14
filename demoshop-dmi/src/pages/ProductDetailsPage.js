import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import jsonData from "../product.json";
import getUser from "../userFile";
import Raccom from "../components/Raccom";
import { tracker} from "../utils/Utils";

const ProductDetailsPage = () => {
  const { productId } = useParams();
  const [quantity, setQuantity] = useState(1); // State to track quantity
  const products = JSON.parse(JSON.stringify(jsonData));
  const product = products.find((item) => item.productId === productId);


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

  const handleQuantityChange = (e) => {
    setQuantity(parseInt(e.target.value, 10));
  };

  const addToCart = async () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    let price = cleanPrice(product.salesPrice);

    const productToAdd = {
      productId: product.productId,
      productName: product.productName,
      salesPrice: price,
      quantity,
    };

    cart.push(productToAdd);
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Product added to cart!");

    const lineItems = cart.map((item) => ({
      lineTotal: cleanPrice(item.salesPrice) * item.quantity,
      productId: item.productId,
      quantity: item.quantity,
    }));

    const subtotalAmount = lineItems
      .reduce((total, item) => total + item.lineTotal, 0)
      .toFixed(2);

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
      <div>
        <label htmlFor="quantity">Quantity: </label>
        <input
          type="number"
          id="quantity"
          min="1"
          value={quantity}
          onChange={handleQuantityChange}
          className="form-control w-25 d-inline"
        />
      </div>
      <button className="btn btn-dark mt-2" onClick={addToCart}>
        Add to Cart
      </button>
      <Raccom />
    </div>
  );
};

export default ProductDetailsPage;
