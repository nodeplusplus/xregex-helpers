import { MongoClientOptions } from "mongodb";

import { Connection } from "../../src/types";
import { disconnect } from "../../src/mongodb/disconnect";
import { connect } from "../../src/mongodb/connect";

const mocks = require("../../mocks");

describe("mongodb/disconnect", () => {
  it("should do notthing without mongodb instance", async () => {
    await disconnect();
    await disconnect({} as any);
  });

  it("should disconnect mongodb server succesfully", async () => {
    const connection: Connection<MongoClientOptions> = {
      uri: mocks.connection.MONGO_URI,
      database: mocks.connection.MONGO_DATABASE,
      clientOpts: {
        useUnifiedTopology: true,
      },
    };

    const { client } = await connect(connection);
    await disconnect(client);
  });
});
