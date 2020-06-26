import _ from "lodash";
import Mustache from "mustache";

import { GenericObject } from "../types";

export const query = {
  serialize(query: any): string {
    if (typeof query === "undefined") return "";
    return JSON.stringify(query);
  },
  deserialize<T = any>(data: string, ref: GenericObject): T | null {
    if (typeof data !== "string" || !data) return null;

    try {
      const combinedData = Mustache.render(data, ref);
      return JSON.parse(combinedData, (key, value) => {
        if (typeof value !== "string") return value;
        return value.startsWith("$") ? _.get(ref, value) : value;
      });
    } catch {
      return null;
    }
  },
};
