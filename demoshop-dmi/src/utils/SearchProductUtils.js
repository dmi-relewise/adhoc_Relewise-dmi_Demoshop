import { ProductSearchBuilder, UserFactory, Searcher } from "@relewise/client";
import getUser from "../userFile";

export const getSettings = (displayedAtLocation) => ({
  language: "en",
  currency: "usd",
  displayedAtLocation,
  user: getUser() || UserFactory.anonymous(),
});

export const createProductSearchBuilder = (
  settings,
  searchTerm,
  pageSize = 100,
  page = 1,
  configureFacets,
  retailMediaLocationKey = "TOTEM_LOCATION",
  retailMediaVariationKey = "TOP",
  retailMediaPlacements = "TOTEM"
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
    .setRetailMedia({
      location: {
        key: retailMediaLocationKey,
        variation: {
          key: retailMediaVariationKey,
        },
        placements: [
          {
            key: retailMediaPlacements,
          },
        ],
      },
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
