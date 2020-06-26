import { MongoClient } from "mongodb";

export async function disconnect(client?: MongoClient) {
  if (client && client.close) return client.close(true);
}
