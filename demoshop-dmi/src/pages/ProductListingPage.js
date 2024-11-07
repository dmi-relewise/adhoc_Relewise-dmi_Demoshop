// src/pages/ProductListingPage.js
import React from 'react';
import { Link } from 'react-router-dom';

const ProductListingPage = () => {
  const products = [
    { id: 1, name: 'Product 1', brandName:'Jack & Jones', price: 29.99, image: 'https://picsum.photos/200' },
    { id: 2, name: 'Product 2', brandName:'Jack & Jones', price: 19.99, image: 'https://picsum.photos/200' },
    { id: 3, name: 'Product 3', brandName:'Jack & Jones', price: 49.99, image: 'https://picsum.photos/200' },
    { id: 4, name: 'Product 4', brandName:'Jack & Jones', price: 39.99, image: 'https://picsum.photos/200' },
  ];

  return (
    <div className='container'>
      <h1 className='my-4 pb-5'>Product Listing Page</h1>
      <div className="d-flex">
        {products.map((product) => (
          <div key={product.id} className="card-body p-2">
            <img src={product.image} alt={product.name} />
            <h2 className='card-title'>{product.name}</h2>
            <p className='card-text'>{product.brandName}</p>
            <p className='card-text'>${product.price}</p>
            <Link to={`/product/${product.id}`} className="btn btn-primary p-1" >View Details</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductListingPage;
