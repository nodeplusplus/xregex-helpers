import IORedis, { Redis, RedisOptions } from "ioredis";

import { Connection } from "../types";
import { generateKey } from "./generateKey";

export async function connect(
  connection: Connection<RedisOptions>
): Promise<Redis> {
  const { uri, database, clientOpts } = connection;
  const keyPrefix = generateKey([database, clientOpts?.keyPrefix], "/", true);
  const options = { ...clientOpts, keyPrefix };

  const redis = new IORedis(uri, options);
  try {
    await redis.ping();
  } catch (e) {
    redis.disconnect();
    throw new Error("CONNECTION:REDIS.FAILED");
  }

  return redis;
}
