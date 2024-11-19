import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSettings, createProductSearchBuilder, createSearcher } from '../utils/SearchProductUtils';

const ProductListingPage = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  const settings = getSettings('Search Page');
  const builder = createProductSearchBuilder(settings, searchTerm, 100, 1);
  const searcher = createSearcher();

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await searcher.searchProducts(builder.build());
        setProducts(response.results);
        console.log(products)
      } catch (error) {
        console.error('Error fetching product data:', error);
        setError('Failed to load products. Please try again.');
      }
    };

    loadData();
  }, [searchTerm]);

  return (
    <div className="container">
      <h1 className="my-3 pb-4">Product Listing Page</h1>
      <input type="text" placeholder="Search for products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="form-control mb-3" />
      <div className="d-flex flex-wrap w-100">
        {products.map((product) => (
          <div key={product.productId} className="card-body p-1 mb-4 w-25">
            <Link to={`/product/${product.productId}`}>
              <img src={product.data.ImageUrl.value ? product.data.ImageUrl.value : "https://picsum.photos/300"} className="rounded-4 w-100" alt={product.productName} />
            </Link>
            <h6 className="card-title">{product.displayName}</h6>
            <p>{product.brand.displayName}</p>
            <p className="card-text fw-bold">${product.salesPrice}</p>
          </div>
        ))}
      </div>
      {error && <p className="text-danger">{error}</p>}
    </div>
  );
};

export default ProductListingPage;
