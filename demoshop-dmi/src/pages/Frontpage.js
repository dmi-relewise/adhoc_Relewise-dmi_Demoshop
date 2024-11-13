// src/pages/Frontpage.js
import { React, Link } from "react";
import { useState, useEffect } from "react";
import { getSettings } from "../utils/SearchProductUtils";
import { Recommender, PopularProductsBuilder } from "@relewise/client";

const recommender = new Recommender(
  process.env.REACT_APP_RELEWISE_KEY_1,
  process.env.REACT_APP_RELEWISE_KEY_2,
  { serverUrl: process.env.REACT_APP_RELEWISE_URL }
);

const Frontpage = () => {
  const settings = getSettings("Front Page");
  const [responsePopoular, setResponsePopoular] = useState([]);

  const popoularProduct = new PopularProductsBuilder(settings)
    .setSelectedProductProperties({
      displayName: true,
      pricing: true,
      allData: true,
    })
    .setNumberOfRecommendations(8);

  useEffect(() => {
    const frontPageSort = async () => {
      try {
        const response = await recommender.recommendPopularProducts(
          popoularProduct.build()
        );
        setResponsePopoular(response.recommendations);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      }
    };

    frontPageSort();
  }, []);


  return (
    <div className="container">
      <h1 className="p-5 text-center">Homepage</h1>
      { responsePopoular.map((product) => (
          <div key={product.productId} className="mb-3 w-50">

            {product.displayName}
          </div>
        ))
      }
    </div>

      );
    }
export default Frontpage;
