import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSettings, createProductSearchBuilder, createSearcher } from "../utils/SearchProductUtils";

const ProductListingPage = () => {
  const [products, setProducts] = useState([]);
  const [RetailMediaProducts, setRetailMediaProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);

  const settings = getSettings("Search Page");
  const builder = createProductSearchBuilder(
    settings,
    searchTerm,
    100,
    1,
    (configureFacets) => {
      configureFacets.addProductDataBooleanValueFacet("InStock", "Product", [true]);
    },
  );

  const searcher = createSearcher();

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await searcher.searchProducts(builder.build());

             const retailMediaProductIds = new Set(response.retailMedia.placements.TOTEM.results.map((product) => product.promotedProduct.result.productId));

             const filteredProducts = response.results.filter((product) => !retailMediaProductIds.has(product.productId));

             setProducts(filteredProducts);
             setRetailMediaProducts(response.retailMedia.placements.TOTEM.results);
      } catch (error) {
        console.error("Error fetching product data:", error);
        setError("Failed to load products. Please try again.");
      }
    };

    loadData();
  }, [searchTerm]);

  return (
    <div className="container d-flex flex-wrap">
      <h1 className="my-4 pb-4 text-center">Products</h1>
      <input type="text" placeholder="Search for products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="form-control mb-3" />

      <div className="row w-75 d-flex flex-wrap">
        {products.map((product) => (
          <div key={product.productId} className="w-25 my-2">
            <div className="card p-1">
              <Link to={`/product/${product.productId}`}>
                <img src={product.data.ImageUrl.value} className="rounded-5 w-100" alt={product.displayName} />
              </Link>
              <div className="card-body">
                <h6 className="card-title">{product.displayName}</h6>
                <p>{product.brand.displayName}</p>
                <p className="card-text fw-bold">${product.salesPrice}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="w-25">
        {RetailMediaProducts.map((product) => (
          <div key={product.promotedProduct.result.productId || 1} className="mb-5">
            <div className="fw-bold text-primary ms-5">SPONSORED</div>

            <div className="card ms-5">
              <Link to={`/product/${product.promotedProduct.result.productId}`}>
                <img src={product.promotedProduct.result.data.ImageUrl.value} className="rounded-5 w-100" alt={product.promotedProduct.result.displayName} />
              </Link>
              <div className="card-body">
                <h6 className="card-title">{product.promotedProduct.result.displayName}</h6>
                <p className="card-text fw-bold">${product.promotedProduct.result.salesPrice}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductListingPage;
