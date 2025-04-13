import { MongoClient, Db, Collection } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config();

export class DatabaseService {
  private readonly client: MongoClient;
  private readonly db: Db;

  constructor() {
    const uri = process.env.MONGO_URI;
    const dbName = process.env.MONGO_DB_NAME;
    if (!uri || !dbName) {
      throw new Error('MongoDB URI or DB_NAME is not defined in .env file');
    }

    this.client = new MongoClient(uri);
    this.db = this.client.db(dbName);
  }

  async getCollection(name: string): Promise<Collection> {
    await this.client.connect();
    return this.db.collection(name);
  }

  async close() {
    await this.client.close();
  }
}
