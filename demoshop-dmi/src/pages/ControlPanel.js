import React, { useEffect, useState } from "react";
import { getSettings, createProductSearchBuilder, createSearcher } from "../utils/SearchProductUtils";
import { ProductUpdateBuilder, Integrator } from "@relewise/integrations";
import { DataValueFactory } from "@relewise/client";
import { useNavigate } from "react-router-dom";

const ControlPanel = () => {

  const [products, setProducts] = useState([]);
  const settings = getSettings("Ctrl Page");
  const builder = createProductSearchBuilder(settings, "", 100, 1)
  const navigate = useNavigate();
  const handleNavigate = (products) => {
    navigate(`/ctrl-panel/${products.productId}`, { state: { products } });
  };
  const searcher = createSearcher();

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await searcher.searchProducts(builder.build());
        setProducts(response.results);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };
    loadData();
  }, []);

  return (
    <div className="container d-flex flex-column my-5">
      <h2 className="fw-bold fs-1 my-3 text-primary">Product Management</h2>

      {products.map((product) => (
        <div className="border border-danger rounded p-3 my-3"
          key={product.productId}
          onClick={() => handleNavigate(product)}
        >
          <h3>{product.displayName}</h3>
          <p>Sales Price: {product.salesPrice}</p>
          <p>List Price: {product.listPrice}</p>
        </div>
      ))}
    </div>
  );
};
export default ControlPanel;
