import faker from "faker";

import { query } from "../../src/mongodb/query";

describe("mongodb/query", () => {
  describe("serialize", () => {
    it("should return emty string if data is undefined", () => {
      expect(query.serialize(undefined as any)).toBe("");
    });

    it("should serialize data successfully", () => {
      const data = { id: faker.random.uuid() };
      expect(query.serialize(data)).toEqual(JSON.stringify(data));
    });
  });

  describe("deserialize", () => {
    const ref = {
      $context: { id: faker.random.uuid() },
      payload: {
        domain: faker.internet.domainName(),
        status: true,
      },
    };

    it("should return null if data is falsy value or not a string", () => {
      expect(query.deserialize("", ref)).toBeNull();
      expect(query.deserialize(null as any, ref)).toBeNull();
      expect(query.deserialize(undefined as any, ref)).toBeNull();
      expect(query.deserialize(false as any, ref)).toBeNull();
      expect(query.deserialize(new Date() as any, ref)).toBeNull();
    });

    it("should return null if parse was failed", () => {
      expect(query.deserialize("a", ref)).toBeNull();
    });

    it("should render template then parse successfull", () => {
      const data =
        '{"id": "$context.id","url":"http://{{payload.domain}}","status":{{payload.status}}}';
      expect(query.deserialize(data, ref)).toEqual({
        id: ref.$context.id,
        url: `http://${ref.payload.domain}`,
        status: ref.payload.status,
      });
    });
  });
});
