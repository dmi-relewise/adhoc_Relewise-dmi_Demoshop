// src/pages/SearchResultsPage.js
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ProductSearchBuilder, UserFactory, Searcher } from '@relewise/client';
import getUser from '../userFile';

const SearchResultsPage = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();

  useEffect(() => {
    // Extract the search term from the query parameter
    const queryParams = new URLSearchParams(location.search);
    const term = queryParams.get('query');
    setSearchTerm(term);
  }, [location.search]);

  useEffect(() => {
    if (searchTerm) {
      const settings = {
        language: 'en',
        currency: 'usd',
        displayedAtLocation: 'Search Results Page',
        user: getUser() || UserFactory.anonymous(),
      };

      const builder = new ProductSearchBuilder(settings)
        .setTerm(searchTerm)
        .setSelectedProductProperties({
          displayName: true,
          pricing: true,
          brand: true,
          dataKeys: ['ShortDescription', 'InStock'],
        })
        .pagination((p) => p.setPageSize(30).setPage(1));

      const searcher = new Searcher(
        process.env.REACT_APP_RELEWISE_KEY_1,
        process.env.REACT_APP_RELEWISE_KEY_2,
        {
          serverUrl: process.env.REACT_APP_RELEWISE_URL,
        }
      );

      const loadData = async () => {
        try {
          const response = await searcher.searchProducts(builder.build());
          setProducts(response.results);
          console.log(products);
        } catch (error) {
          console.error('Error fetching product data:', error);
          setError('Failed to load products. Please try again later.');
        }
      };

      loadData();
    }
  }, [searchTerm]);

  return (
    <div className="container">
      <h1 className="my-3 pb-4">Search Results for: {searchTerm}</h1>
      {error && <p className="text-danger">{error}</p>}
      <div className="d-flex flex-wrap">
        {products.map((product) => (
          <div key={product.id} className="card-body p-1 mb-4">
            <img
              src="https://picsum.photos/300"
              className="rounded-4"
              alt={product.productName}
            />
            <h5 className="card-title">{product.displayName}</h5>
            <p className="card-text fw-bold">{product.brand.displayName}</p>
            <p className="card-text fw-bold">${product.salesPrice}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResultsPage;
