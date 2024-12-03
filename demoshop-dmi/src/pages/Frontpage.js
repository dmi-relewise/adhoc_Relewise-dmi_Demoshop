// src/pages/Frontpage.js
import { React } from "react";
import { useState, useEffect } from "react";
import { getSettings } from "../utils/SearchProductUtils";
import { PopularProductsBuilder } from "@relewise/client";
import { recommender } from "../utils/Utils";

const Frontpage = () => {
  const settings = getSettings("Front Page");
  const [responsePopoular, setResponsePopoular] = useState([]);

  const popoularProduct = new PopularProductsBuilder(settings)
    .setSelectedProductProperties({
      displayName: true,
      pricing: true,
      brandName: true,
      allData: true,
    })
    .setNumberOfRecommendations(12);

  useEffect(() => {
    const frontPageSort = async () => {
      try {
        const response = await recommender.recommendPopularProducts(popoularProduct.build());
        setResponsePopoular(response.recommendations);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      }
    };
    frontPageSort();
  }, []);

  return (
    <div className="container text-center">
      <h1 className="p-5 ">Most popular products</h1>
      <div className="d-flex flex-wrap">
        {responsePopoular.map((product) => (
          <div key={product.productId} className="p-1 m-4 card w-25">
            <a href={`/product/${product.productId}`}>
              <img src={product.data.ImageUrl.value} alt={product.displayName} className="w-75"></img>
            </a>
            <h4 className="m-auto">{product.displayName}</h4>
            <p className="m-auto">{product.listPrice}$</p>
            <p className="m-auto">{product.data.ShortDescription.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Frontpage;
