import IORedis, { Redis, RedisOptions } from "ioredis";

import { Connection } from "../types";
import { generateKey } from "./generateKey";

export async function connect(
  connection: Connection<RedisOptions>,
  scopes?: string[]
): Promise<Redis> {
  const { uri, database, clientOpts } = connection;

  const keys = [clientOpts?.keyPrefix, database].concat(scopes);
  const keyPrefix = generateKey(keys, true);
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
