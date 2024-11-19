import { Integrator, ProductUpdateBuilder } from "@relewise/integrations";
import { DataValueFactory } from "@relewise/client";
import jsonData from "./product.json";

const integrator = new Integrator(
  process.env.REACT_APP_RELEWISE_KEY_1,
  process.env.REACT_APP_RELEWISE_KEY_2,
  { serverUrl: process.env.REACT_APP_RELEWISE_URL }
);

var date = Date.now();

// CREATE PRODUCT ON MYRELEWISE
export async function createProducts() {
  const loadData = JSON.parse(JSON.stringify(jsonData));
    const productUpdates = [];

  loadData.forEach((element) => {
    const product = new ProductUpdateBuilder({
      id: element.productId, // The Id should be the primary id of the product
      productUpdateKind: "ReplaceProvidedProperties",
      // Replace existing variants = true will delete all variants in Relewise
      // (for the listed products) not included in this update request.
    })
      .displayName([
        // We only set the English translation in this example
        // but more can be set by parsing more MultilingualValue
        // to the Multilingual::create method.
        { language: "en", value: element.productName },
      ])
      .salesPrice([{ currency: "usd", amount: element.salesPrice.replace("$", "") }])
      .listPrice([{ currency: "usd", amount: element.listPrice.replace("$", "") }])

      .brand({
        id: element.brandName, // Displayname can be left out, but Id is required
        displayName: element.brandName,
      })

      .data({
        // We only set the English translation in this example
        // but more can be set by parsing more MultilingualValue
        // to the Multilingual::create method.
        ShortDescription: DataValueFactory.multilingual([{ language: "en", value: element.shortDescription }]),
        // Important to set this timestamp to
        // the exact same value for all products
        ImportedAt: DataValueFactory.number(date),
        InStock: DataValueFactory.boolean(element.inStock === "in stock"),
        ImageUrl: DataValueFactory.multilingual([{ language: "en", value: element.ImageUrl }]),
        // Add any additional fields you would want returned from Relewise
      });

    const categories = element.category.split(">").map(function (item) {
      return { id: item, displayName: [{ language: "en", value: item }] };
    });

    product.categoryPaths((b) =>
      b.path((p) => {
        categories.forEach((category) => {
          p.category(category);
        });
      })
    );

    productUpdates.push(product.build());
  });
  await integrator.batch(productUpdates);
}
