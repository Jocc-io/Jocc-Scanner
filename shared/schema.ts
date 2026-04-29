import { pgTable, text, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// A minimal schema as no database persistence is strictly required 
// for the client-side QR validation logic.
export const scans = pgTable("scans", {
  id: serial("id").primaryKey(),
  collectionAddress: text("collection_address").notNull(),
  nftId: text("nft_id").notNull(),
  status: text("status").notNull(),
});

export const insertScanSchema = createInsertSchema(scans).omit({ id: true });
export type InsertScan = z.infer<typeof insertScanSchema>;
export type Scan = typeof scans.$inferSelect;
