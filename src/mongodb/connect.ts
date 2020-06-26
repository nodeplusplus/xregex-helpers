import { MongoClient, Db as MongoClientDB, MongoClientOptions } from "mongodb";

import { Connection } from "../types";

export async function connect(
  connection: Connection<MongoClientOptions>
): Promise<{ client: MongoClient; db: MongoClientDB }> {
  try {
    const { uri, database, clientOpts } = connection;
    const client = await MongoClient.connect(uri, clientOpts);
    const db = client.db(database);
    return { client, db };
  } catch {
    throw new Error("CONNECTION:MONGODB.FAILED");
  }
}
