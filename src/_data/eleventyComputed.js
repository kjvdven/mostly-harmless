import { buildGraph } from "../_config/json-ld.js";

export default {
  structuredData: (data) => buildGraph(data),
};
