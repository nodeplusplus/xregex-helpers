import { RedisOptions } from "ioredis";

import { Connection } from "../../src/types";
import { disconnect } from "../../src/redis/disconnect";

import { connect } from "../../src/redis/connect";

const mocks = require("../../mocks");

describe("redis/disconnect", () => {
  it("should do notthing without redis instance", async () => {
    await disconnect();
    await disconnect({} as any);
  });

  it("should disconnect redis server succesfully", async () => {
    const connection: Connection<RedisOptions> = {
      uri: mocks.connection.REDIS_URI,
    };

    await disconnect(await connect(connection));
  });
});
