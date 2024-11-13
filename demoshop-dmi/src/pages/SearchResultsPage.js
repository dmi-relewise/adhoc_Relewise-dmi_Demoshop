import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { getSettings, createProductSearchBuilder, createSearcher } from '../utils/SearchProductUtils';

const SearchResultsPage = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const term = queryParams.get('query');
    setSearchTerm(term);
  }, [location.search]);

  useEffect(() => {
    if (searchTerm) {
      const settings = getSettings('Search Results Page');
      const builder = createProductSearchBuilder(settings, searchTerm);
      const searcher = createSearcher();

      const loadData = async () => {
        try {
          const response = await searcher.searchProducts(builder.build());
          setProducts(response.results);
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
      <h1 className="mt-4 pb-4">Search Results for: {searchTerm}</h1>
      <div className='d-flex flex-wrap'>
        {products.map((product) => (
          <div key={product.productId} className="mb-3 w-50">
            <Link to={`/product/${product.productId}`}><img src="/Ephoto.jpeg" className="rounded-4 w-75" alt={product.productName} /></Link>
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
