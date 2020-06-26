import { Redis, RedisOptions } from "ioredis";
import faker from "faker";

import { Connection } from "../../src/types";
import { connect } from "../../src/redis/connect";

const mocks = require("../../mocks");

describe("redis/connect", () => {
  const bag: Redis[] = [];
  afterAll(async () => {
    await Promise.all(bag.map((r) => r.disconnect()));
    await new Promise((resolve) => setTimeout(resolve, 1500));
  });

  it("should connect succesfully", async () => {
    const connection: Connection<RedisOptions> = {
      uri: mocks.connection.REDIS_URI,
      database: faker.random.uuid(),
      clientOpts: {
        keyPrefix: faker.lorem.word(),
      },
    };

    const redis = await connect(connection);
    bag.push(redis);

    expect(redis.options.keyPrefix).toEqual(
      expect.stringContaining(connection.database as string)
    );
    expect(redis.options.keyPrefix).toEqual(
      expect.stringContaining(
        (connection.clientOpts as RedisOptions).keyPrefix as string
      )
    );
  });

  it("should connect without key prefix as well", async () => {
    const connection: Connection<RedisOptions> = {
      uri: mocks.connection.REDIS_URI,
    };

    const redis = await connect(connection);
    bag.push(redis);

    expect(redis.options.keyPrefix).toBeFalsy();
  });

  it("should connect with scopes as well", async () => {
    const scopes = new Array(faker.random.number({ min: 5, max: 10 }))
      .fill(null)
      .map(() => faker.random.word());
    const connection: Connection<RedisOptions> = {
      uri: mocks.connection.REDIS_URI,
      database: faker.random.uuid(),
    };

    const redis = await connect(connection, scopes);
    bag.push(redis);

    expect(redis.options.keyPrefix).toEqual(
      expect.stringContaining(connection.database as string)
    );
    for (const scope of scopes) {
      expect(redis.options.keyPrefix).toEqual(expect.stringContaining(scope));
    }
  });

  it("should throw connection error as well", async () => {
    expect.assertions(1);

    const connection: Connection<RedisOptions> = {
      uri: "redis://127.0.0.1:16379",
      clientOpts: {
        maxRetriesPerRequest: 1,
      },
    };

    try {
      await connect(connection);
    } catch (error) {
      expect(error.message).toEqual(
        expect.stringContaining("CONNECTION:REDIS.FAILED")
      );
    }
  });
});
