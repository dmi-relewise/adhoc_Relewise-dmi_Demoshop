import React, { useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import jsonData from '../product.json';
import getUser from '../userFile';
import {Tracker} from '@relewise/client';

const ProductDetailsPage = () => {
  const {productId} = useParams(); 
  console.log(productId);
  const products = JSON.parse(JSON.stringify(jsonData)); 
  const product = products.find(item => item.productId === productId);

  const tracker = new Tracker('c77f1e38-9102-46c9-af43-1effea7621cb', 'Ixs:iMcj_BW%z2B', {
    serverUrl: 'https://sandbox-api.relewise.com/',
  }); 

  useEffect(() => {
    const pdpTracker = async () => {
      try {
        await tracker.trackProductView({
          productId,
          user: getUser(),
      });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    pdpTracker();
  }, []);
  
  return (
    <div className='container p-5 text-center'>
      <img src="https://picsum.photos/800" alt="image" />
      <p>{product.productName}</p>
      <p>{product.salesPrice}</p>
      <button className='btn btn-dark'>Add to Cart</button>
    </div>
  );
};

export default ProductDetailsPage;
