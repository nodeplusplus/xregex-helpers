import { Redis } from "ioredis";
import faker from "faker";

import { connect } from "../../src/redis/connect";
import { disconnect } from "../../src/redis/disconnect";
import { clear } from "../../src/redis/clear";

const mocks = require("../../mocks");

describe("redis/clear", () => {
  const pattern = String(faker.random.number({ min: 1000 }));
  let redis: Redis;

  beforeAll(async () => {
    redis = await connect({
      uri: mocks.connection.REDIS_URI,
      database: faker.random.word(),
    });
  });
  afterAll(async () => {
    await disconnect(redis);
  });
  beforeEach(async () => {
    await redis.flushall();
    await feed(redis, pattern);
  });

  it("should remove all items successfully", async () => {
    const preKeys = await redis.keys("*");
    expect(preKeys.length).toBeTruthy();

    await clear(redis);

    const keys = await redis.keys("*");
    expect(keys.length).toBe(0);
  });

  it("should remove all items WITH pattern successfully", async () => {
    const keyPrefix = redis.options.keyPrefix;

    const preKeys = await redis.keys("*");
    expect(preKeys.length).toBeTruthy();

    await clear(redis, pattern);

    const keys = await redis.keys(`${keyPrefix}*`);
    expect(keys.length).toBeTruthy();

    const deletedKeys = await redis.keys([keyPrefix, pattern, "*"].join(""));
    expect(deletedKeys.length).toBeFalsy();
  });

  it("should do notthing if we couldn't found any items", async () => {
    const keyPrefix = redis.options.keyPrefix;

    const preKeys = await redis.keys("*");
    expect(preKeys.length).toBeTruthy();

    await clear(redis, faker.random.uuid());

    const keys = await redis.keys([keyPrefix, pattern, "*"].join(""));
    expect(keys.length).toBeTruthy();
  });

  it("should clear all items if both key prefix and pattern were not used", async () => {
    const redis = await connect({ uri: mocks.connection.REDIS_URI });

    await redis.flushall();
    await feed(redis, pattern);

    const preKeys = await redis.keys("*");
    expect(preKeys.length).toBeTruthy();

    await clear(redis);

    const keys = await redis.keys("*");
    expect(keys.length).toBe(0);

    await disconnect(redis);
  });
});

async function feed(redis: Redis, pattern: string) {
  const count = faker.random.number({ min: 300, max: 600 });
  const promises: Promise<any>[] = [];

  for (let i = 0; i < count; i++) {
    if (i % 2 === 0) {
      promises.push(
        redis.hset(faker.random.uuid(), "username", faker.internet.userName())
      );
      continue;
    }

    if (i % 3 === 0) {
      promises.push(redis.sadd(faker.internet.userName(), faker.random.uuid()));
      continue;
    }

    promises.push(redis.set([pattern, faker.random.uuid()].join("/"), 1));
  }

  return promises;
}
