import faker from "faker";

import { generateKey } from "../../src/redis/generateKey";

describe("redis/generateKey", () => {
  const keys = new Array(faker.random.number({ min: 5, max: 10 }))
    .fill("")
    .map(() => faker.random.word());

  it("should return empty string if keys was only includes falsy item", () => {
    const string = generateKey([false as any, null as any, "", undefined]);
    expect(string).toBe("");
  });

  it("should return key with delimiter at end of string", () => {
    const delimiter = "#";
    const string = generateKey(keys, true, delimiter);

    for (const key of keys) {
      expect(string).toEqual(expect.stringContaining(key));
    }
    expect(string.endsWith(delimiter)).toBeTruthy();
  });
  it("should return key WITHOUT delimiter at end of string", () => {
    const delimiter = "#";
    const string = generateKey(keys, false, delimiter);

    for (const key of keys) {
      expect(string).toEqual(expect.stringContaining(key));
    }
    expect(string.endsWith(delimiter)).toBeFalsy();
  });
});
