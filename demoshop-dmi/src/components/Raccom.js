import { ProductsViewedAfterViewingProductBuilder, Recommender, PurchasedWithProductBuilder } from '@relewise/client';
import { useParams } from 'react-router-dom'; // Import useParams
import { useEffect, useState } from 'react';
import { getSettings } from '../utils/SearchProductUtils';
import { Link } from 'react-router-dom';

const recommender = new Recommender(process.env.REACT_APP_RELEWISE_KEY_1, process.env.REACT_APP_RELEWISE_KEY_2, { serverUrl: process.env.REACT_APP_RELEWISE_URL });

const Raccom = () => {
    const [raccArray, setRaccArray] = useState([]);
    const [purchasedWith, setPurchasedWith] = useState([]);
    const settings = getSettings('Product Details Page');
    const { productId } = useParams();

    // ProductsViewedAfterViewingProductRequest
    const viewedAfterViewingBuilder = new ProductsViewedAfterViewingProductBuilder(settings)
        .setSelectedProductProperties({
            displayName: true,
            pricing: true,
            allData: true
        })
        .product({ productId: productId })
        .setNumberOfRecommendations(4);
    // ProductsViewedAfterViewingProductRequest


    //PurchasedWithProduct
    const purchasedWithBuilder = new PurchasedWithProductBuilder(settings)
        .setSelectedProductProperties({
            displayName: true,
            pricing: true,
            allData: true
        })
        .product({ productId: productId })
        .setNumberOfRecommendations(4);
    //PurchasedWithProduct

    useEffect(() => {

        const fetchRecommendations = async () => {
            try {
                // pvavp
                const response = await recommender.recommendProductsViewedAfterViewingProduct(viewedAfterViewingBuilder.build());
                setRaccArray(response.recommendations);

                // pwprp
                const responsePurchWith = await recommender.recommendPurchasedWithProduct(purchasedWithBuilder.build());
                setPurchasedWith(responsePurchWith.recommendations);

            } catch (error) {
                console.error('Error fetching recommendations:', error);
            }
        };
        fetchRecommendations();
    }, [productId]);

    return (
      <div className=" container p-2 d-flex flex-wrap align-items-center justify-content-center">
        <h2 className="text-center">Recommended Products (ProductsViewedAfterViewingProductRequest)</h2>

        {raccArray.length > 1 &&
          raccArray.map((product) => (
            <div key={product.productId} className="card-body p-1 mb-4 w-25">
              <Link to={`/product/${product.productId}`}>
                <img src={product.data.ImageUrl.value} className="rounded-4 w-75" alt={product.productName} />
              </Link>
              <h5 className="card-title">{product.displayName}</h5>
              <p className="card-text fw-bold">${product.salesPrice}</p>
            </div>
          ))}
        <h2 className="text-center w-100 mt-5">Recommended Products (PurchasedWithProductRequest)</h2>
        {purchasedWith.length > 1 &&
          purchasedWith.map((product) => (
            <div key={product.productId} className="card-body p-1 mb-4 w-25">
              <Link to={`/product/${product.productId}`}>
                <img src={product.data.ImageUrl.value} className="rounded-4 w-75" alt={product.productName} />
              </Link>
              <h5 className="card-title">{product.displayName}</h5>
              <p className="card-text fw-bold">${product.salesPrice}</p>
            </div>
          ))}
      </div>
    );
};

export default Raccom;
