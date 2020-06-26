import { ObjectId } from "mongodb";
import faker from "faker";

import { generateIdsFilter } from "../../src/mongodb/generateIdsFilter";

describe("mongodb/generateIdsFilter", () => {
  const objectId = new ObjectId();
  const id = faker.random.uuid();

  it("should return null if id is not truthy", () => {
    expect(generateIdsFilter(undefined as any)).toBeNull();
    expect(generateIdsFilter(null as any)).toBeNull();
    expect(generateIdsFilter("" as any)).toBeNull();
    expect(generateIdsFilter(0 as any)).toBeNull();
    expect(generateIdsFilter(false as any)).toBeNull();
  });

  it("should add filter by _id if it is hex string", () => {
    expect(generateIdsFilter(objectId.toHexString())).toEqual({
      $or: [{ _id: objectId }],
    });
  });

  it("should add filter by _id if string is instance of ObjectId", () => {
    expect(generateIdsFilter(objectId)).toEqual({
      $or: [{ _id: objectId }],
    });
  });

  it("should add filter by id as well", () => {
    expect(generateIdsFilter(id)).toEqual({ $or: [{ id }] });
  });

  it("should return null if id is not valid ObjectId instance", () => {
    expect(generateIdsFilter(new Date())).toBeNull();
  });
});
