import { Tracker, Recommender, Searcher } from "@relewise/client";



export const recommender = new Recommender(
  process.env.REACT_APP_RELEWISE_KEY_1,
  process.env.REACT_APP_RELEWISE_KEY_2,
  { serverUrl: process.env.REACT_APP_RELEWISE_URL }
);

export const tracker = new Tracker(
  process.env.REACT_APP_RELEWISE_KEY_1,
  process.env.REACT_APP_RELEWISE_KEY_2,
  { serverUrl: process.env.REACT_APP_RELEWISE_URL }
);

export const createSearcher = new Searcher(
    process.env.REACT_APP_RELEWISE_KEY_1,
    process.env.REACT_APP_RELEWISE_KEY_2,
    { serverUrl: process.env.REACT_APP_RELEWISE_URL }
  );
