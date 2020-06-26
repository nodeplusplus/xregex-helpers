import { MongoClient, MongoClientOptions } from "mongodb";
import faker from "faker";

import { Connection } from "../../src/types";
import { connect } from "../../src/mongodb/connect";

const mocks = require("../../mocks");

describe("mongodb/connect", () => {
  const bag: MongoClient[] = [];
  afterAll(async () => {
    await Promise.all(bag.map((d) => d.close(true)));
  });

  it("should connect succesfully", async () => {
    const connection: Connection<MongoClientOptions> = {
      uri: mocks.connection.MONGO_URI,
      database: mocks.connection.MONGO_DATABASE,
      clientOpts: {
        useUnifiedTopology: true,
      },
    };

    const mongodb = await connect(connection);
    bag.push(mongodb.client);
  });

  it("should throw connection error as well", async () => {
    expect.assertions(1);

    const connection: Connection<MongoClientOptions> = {
      uri: "mongodb://127.0.0.1:7017",
      database: mocks.connection.MONGO_DATABASE,
      clientOpts: {
        useUnifiedTopology: false,
      },
    };

    try {
      await connect(connection);
    } catch (error) {
      expect(error.message).toEqual(
        expect.stringContaining("CONNECTION:MONGODB.FAILED")
      );
    }
  });
});
