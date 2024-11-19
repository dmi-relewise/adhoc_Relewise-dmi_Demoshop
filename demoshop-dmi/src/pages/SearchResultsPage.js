import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { getSettings, createProductSearchBuilder, createSearcher } from "../utils/SearchProductUtils";

const SearchResultsPage = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoriesToSend, setCategoriesToSend] = useState([]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const term = queryParams.get("query");
    setSearchTerm(term);
  }, [location.search]);

  useEffect(() => {
    if (searchTerm) {
      const settings = getSettings("Search Results Page");

      const builder = createProductSearchBuilder(settings, searchTerm, 30, 1, (f) => {
        f.addBrandFacet(selectedBrand);

        if (categoriesToSend.length > 0) {
          f.addCategoryFacet("Ancestors", categoriesToSend);
        }

        if (inStockOnly) {
          f.addProductDataBooleanValueFacet("InStock", 'Product', [true]);
        }
      });
      const searcher = createSearcher();

      const loadData = async () => {
        try {
          const response = await searcher.searchProducts(builder.build());
          setProducts(response.results);

          const uniqueBrandsSet = new Set();
          const categoryList = [];

          response.results.forEach((product) => {
            uniqueBrandsSet.add(product.brand.displayName);

            const categoryPath = product.categoryPaths?.[0]?.pathFromRoot;
            if (categoryPath) {
              categoryPath.forEach((category) => {
                const categoryName = category?.displayName;
                if (categoryName && !categoryList.includes(categoryName)) {
                  categoryList.push(categoryName);
                }
              });
            }
          });

          setBrands(Array.from(uniqueBrandsSet));
          setCategories(categoryList);
        } catch (error) {
          console.error("Error fetching product data:", error);
          setError(error);
        }
      };
      loadData();
    }
  }, [searchTerm, selectedBrand, inStockOnly, categoriesToSend]);

  const handleInStockChange = (event) => {
    setInStockOnly(event.target.checked);
  };

  const handleBrandChange = (event) => {
    setSelectedBrand([event.target.value]);
  };

  const handleCategoryChange = (event) => {
    const selectedCategory = event.target.value;
    if (selectedCategory === "") {
      setCategoriesToSend([]);
    } else {
      setCategoriesToSend([selectedCategory]);
    }
  };

  return (
    <div className="container">
      <h1 className="mt-4 pb-4">Search Results for: {searchTerm}</h1>

      <label className="fw-bold ms-1 mb-2" htmlFor="brand-select">
        Select Brand:
      </label>
      <select className="form-select mb-3" id="brand-select" value={selectedBrand[0] || ""} onChange={handleBrandChange}>
        <option value="">All Brands</option>
        {brands.map((brand, index) => (
          <option key={index} value={brand}>
            {brand}
          </option>
        ))}
      </select>

      <label className="fw-bold ms-1 mb-2" htmlFor="category-select">
        Select Category:
      </label>
      <select className="form-select mb-3" id="category-select" value={categoriesToSend[0] || ""} onChange={handleCategoryChange}>
        <option value="">Select Category</option>
        {categories.map((category, index) => (
          <option key={index} value={category}>
            {category}
          </option>
        ))}
      </select>

      <div className="form-check mb-3">
        <input type="checkbox" className="form-check-input" id="inStockOnly" checked={inStockOnly} onChange={handleInStockChange} />
        <label className="form-check-label" htmlFor="inStockOnly">
          Show only in-stock
        </label>
      </div>

      <div className="d-flex flex-wrap">
        {products.map((product) => (
          <div key={product.productId} className="mb-3 w-50">
            <Link to={`/product/${product.productId}`}>
              <img src={product.data.ImageUrl.value} className="rounded-4 w-75" alt={product.displayName} />
            </Link>
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
