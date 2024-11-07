// src/pages/ProductDetailsPage.js
import React from 'react';
import { useParams } from 'react-router-dom';

const ProductDetailsPage = () => {
  const { id } = useParams();
  
  const products = [
    { id: 1, name: 'Product 1', price: 29.99, image: 'https://picsum.photos/200' },
    { id: 2, name: 'Product 2', price: 19.99, image: 'https://picsum.photos/200' },
    { id: 3, name: 'Product 3', price: 49.99, image: 'https://picsum.photos/200' },
    { id: 4, name: 'Product 4', price: 39.99, image: 'https://picsum.photos/200' },
  ];

  const product = products.find((product) => product.id === parseInt(id));



  return (
    <div>
      <h1>{product.name}</h1>
      <img src={product.image} alt={product.name} />
      <p>{product.description}</p>
      <p>${product.price}</p>
      <button>Add to Cart</button>
    </div>
  );
};

export default ProductDetailsPage;
