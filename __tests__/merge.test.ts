import _ from "lodash";
import faker from "faker";

import { merge } from "../src/merge";

describe("merge", () => {
  it("should merge array instead of replace them", () => {
    const object = {
      username: [faker.random.uuid()],
      password: faker.internet.password(),
      name: {
        first: faker.name.firstName(),
        last: faker.name.lastName(),
      },
    };
    const source = {
      username: [faker.internet.userName()],
      password: faker.internet.password(),
    };

    const merged = merge(object, source);
    expect(merged).toEqual({
      username: [...object.username, ...source.username],
      ..._.omit(object, ["username"]),
      ..._.omit(source, ["username"]),
    });
  });
});
