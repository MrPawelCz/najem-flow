import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
export const guestSessions = sqliteTable("guest_sessions", {
  tokenHash: text("token_hash").primaryKey(),
  userId: text("user_id").notNull(),
  expiresAt: integer("expires_at").notNull(),
});
export const workspaces = sqliteTable("workspaces", {
  userId: text("user_id").primaryKey(),
  payload: text("payload").notNull(),
  version: integer("version").notNull().default(0),
});
export const invitations = sqliteTable(
  "invitations",
  {
    tokenHash: text("token_hash").primaryKey(),
    userId: text("user_id").notNull(),
    contractId: text("contract_id").notNull(),
    expiresAt: integer("expires_at").notNull(),
  },
  (t) => [index("idx_invitations_user_contract").on(t.userId, t.contractId)],
);
