import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ProductUpdateBuilder, Integrator, ProductAdministrativeActionBuilder } from "@relewise/integrations";
import axios from "axios";

import jsonData from "../product.json";

const SingleForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialProduct = location.state?.products; // Access the product data passed from the previous page

  const [productData, setProductData] = useState(initialProduct);
  const [localJsonData, setLocalJsonData] = useState(() => JSON.parse(JSON.stringify(jsonData)));

  const updateLocalJson = async (productId, updates) => {
    try {
      // Send a POST request to the backend to update the JSON
      const response = await axios.post("http://localhost:3001/update-json", {
        productId,
        updates,
      });

      if (response.status === 200) {
        console.log("JSON updated on server:", response.data);
        setLocalJsonData((prevData) => {
          const updatedData = [...prevData];
          const productIndex = updatedData.findIndex((p) => p.productId === productId);
          if (productIndex !== -1) {
            updatedData[productIndex] = { ...updatedData[productIndex], ...updates };
          }
          return updatedData;
        });
      }
    } catch (error) {
      console.error("Error updating JSON on server:", error);
    }
  };

  const integrator = new Integrator(process.env.REACT_APP_RELEWISE_KEY_1, process.env.REACT_APP_RELEWISE_KEY_2, { serverUrl: process.env.REACT_APP_RELEWISE_URL });

  const createProductUpdate = (product) => {
    const productUpdate = new ProductUpdateBuilder({
      id: product.productId,
      productUpdateKind: "ReplaceProvidedProperties",
    })
      .displayName([{ language: "en", value: product.displayName }])
      .salesPrice([{ currency: "USD", amount: product.salesPrice }])
      .listPrice([{ currency: "USD", amount: product.listPrice }])
      .data({
        InStock: product.data.IsInStock,
      });

    console.log(product.data.IsInStock);

    return productUpdate.build();
  };

  const disableProduct = () => {
    try {
      const NotInStock = new ProductAdministrativeActionBuilder({
        language: null,
        currency: null,
        filters(filterBuilder) {
          filterBuilder.addProductIdFilter(productData.productId).build();
        },
        productUpdateKind: "Disable",
      });
      updateLocalJson(productData.productId, { disabled: true });
      integrator.executeProductAdministrativeAction(NotInStock.build());
    } catch (error) {
      console.error("Error disabling product:", error);
    }
  };
  const deleteProduct = () => {
    try {
      const NotInStock = new ProductAdministrativeActionBuilder({
        language: null,
        currency: null,
        filters(filterBuilder) {
          filterBuilder.addProductIdFilter(productData.productId).build();
        },
        productUpdateKind: "Delete",
      });

      integrator.executeProductAdministrativeAction(NotInStock.build());
    } catch (error) {
      console.error("Error disabling product:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setProductData((prevData) => {
      const updatedProduct = {
        ...prevData,
        ...(name === "data.IsInStock"
          ? {
              data: {
                ...prevData.data,
                IsInStock: checked,
              },
            }
          : {
              [name]: type === "checkbox" ? checked : value,
            }),
      };
      // Update the backend JSON
      updateLocalJson(updatedProduct.productId, {
        [name === "data.IsInStock" ? "inStock" : name]: type === "checkbox" ? checked : value,
      });

      return updatedProduct;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productUpdate = createProductUpdate(productData);

      await integrator.updateProduct(productUpdate);
    } catch (error) {
      console.error("Failed to update product:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="container my-5">
      <h2 className="fw-bold fs-1 my-3 text-primary">Edit {productData.displayName}</h2>
      <label>
        In Stock:
        <input className="mx-2 px-4" type="checkbox" name="data.IsInStock" checked={productData.data?.IsInStock || false} onChange={handleInputChange} />
      </label>
      <label>
        Display Name:
        <input className="ms-2 px-4" type="text" name="displayName" value={productData.displayName || ""} onChange={handleInputChange} />
      </label>
      <label>
        List Price:
        <input type="number" className="ms-2 px-4" name="listPrice" value={productData.listPrice || 0} onChange={handleInputChange} />
      </label>
      <label>
        Sales Price:
        <input type="number" className="ms-2 px-4" name="salesPrice" value={productData.salesPrice || 0} onChange={handleInputChange} />
      </label>
      <button className="btn btn-primary mt-3" type="submit">
        Save Changes
      </button>
      <button className="btn btn-primary mt-3" onClick={disableProduct} type="submit">
        Disable
      </button>
      <button className="btn btn-primary mt-3" onClick={deleteProduct} type="submit">
        Delete
      </button>
    </form>
  );
};

export default SingleForm;
