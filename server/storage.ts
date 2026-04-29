import { type InsertScan, type Scan } from "@shared/schema";

export interface IStorage {
  // Empty storage for now since it's client-side only
}

export class MemStorage implements IStorage {
  // Empty storage
}

export const storage = new MemStorage();
