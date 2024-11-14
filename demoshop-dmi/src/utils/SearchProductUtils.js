import { ProductSearchBuilder, UserFactory, Searcher } from "@relewise/client";
import getUser from "../userFile";

export const getSettings = (displayedAtLocation) => ({
  language: "en",
  currency: "usd",
  displayedAtLocation,
  user: getUser() || UserFactory.anonymous(),
});

// export const createProductSearchBuilder = (settings, searchTerm, pageSize = 30, page = 1) => {
//   const builder = new ProductSearchBuilder(settings)
//     .setSelectedProductProperties({
//       displayName: true,
//       pricing: true,
//       brand: true,
//       dataKeys: ["ShortDescription", "InStock"],
//       AllData: true,
//     })
//     .pagination((p) => p.setPageSize(pageSize).setPage(page));

//   if (searchTerm) {
//     builder.setTerm(searchTerm);
//   }
//   return builder;
// };

export const createProductSearchBuilder = (
  settings,
  searchTerm,
  pageSize = 30,
  page = 1,
  configureFacets // A callback function to configure facets
) => {
  const builder = new ProductSearchBuilder(settings)
    .setSelectedProductProperties({
      displayName: true,
      pricing: true,
      brand: true,
      allData: true,
      dataKeys: ["ShortDescription", "InStock"],
      categoryPaths: true,
    })
    .pagination((p) => p.setPageSize(pageSize).setPage(page));

  if (searchTerm) {
    builder.setTerm(searchTerm);
  }

  if (configureFacets) {
    builder.facets(configureFacets);
  }

  return builder;
};

export const createSearcher = () => {
  return new Searcher(
    process.env.REACT_APP_RELEWISE_KEY_1,
    process.env.REACT_APP_RELEWISE_KEY_2,
    { serverUrl: process.env.REACT_APP_RELEWISE_URL }
  );
};
