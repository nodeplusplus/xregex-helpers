import faker from "faker";

import { serialize, deserialize } from "../src/serializer";

describe("serializer", () => {
  describe("serialize", () => {
    it("should return serialized data if it is defined", () => {
      expect(serialize(false)).toBe(JSON.stringify(false));
      expect(serialize(null)).toBe(JSON.stringify(null));

      const data = { id: faker.random.uuid() };
      expect(serialize(data)).toBe(JSON.stringify(data));
    });

    it("should return stringify of null if data is undefined", () => {
      expect(serialize()).toBe(JSON.stringify(null));
    });
  });

  describe("deserialize", () => {
    it("should return parsed data successfully", () => {
      const data = { id: faker.random.uuid() };
      expect(deserialize(serialize(data))).toEqual(data);
    });

    it("should return null if data was not truthy value", () => {
      expect(deserialize()).toBeNull();
      expect(deserialize(null as any)).toBeNull();
      expect(deserialize("")).toBeNull();
    });

    it("should return null if parse was failed", () => {
      expect(deserialize("{]}")).toBeNull();
    });
  });
});
