import { boolean, doublePrecision, integer, pgEnum, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { defineRelations } from "drizzle-orm";
import { user } from "./auth";

export const boxTypeEnum = pgEnum("BoxType", [
  'public', 'pharm', 'welfare', 'apt', 'post', 'religion', 'gym', 'others'
]);

export const suggestionType = pgEnum("SgType", [
  'new_box', 'edit_box', 'error', 'suggest', 'delete_box', 'others'
]);

export const supported_states = pgTable("supported_states", {
  code: text("code").primaryKey(),
  name: text("name").notNull().unique(),
  avail: boolean("available").notNull().default(false)
});

export const supported_cities = pgTable("supported_cities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").notNull(),
  lat: doublePrecision("lat"),
  lng: doublePrecision("lng"),
  state: text("state").references(() => supported_states.code, { onUpdate: "cascade" }),
  avail: boolean("available").notNull().default(false),
  origin: text("origin")
});

export const pharm_boxes = pgTable("pharm_boxes", {
  id: serial("id").primaryKey(),
  region: integer("region").references(() => supported_cities.id, { onUpdate: "cascade", onDelete: "cascade" }),
  updated: timestamp("last_updated").$onUpdate(() => new Date()).notNull(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  call: text("call"),
  lat: doublePrecision("lat").notNull(),
  lng: doublePrecision("lng").notNull(),
  type: boxTypeEnum("type").notNull(),
  memo: text("memo"),
});

export const favorites = pgTable("user_favorites", {
  id: serial("id").primaryKey(),
  user_id: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  box_id: integer("box_id").references(() => pharm_boxes.id, { onUpdate: "cascade", onDelete: "cascade" }),
});

// for the future function : do not uncomment before enabling feature.

// export const sugestions = pgTable("user_suggestions", {
//   id: serial("id").primaryKey(),
//   user_id: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
//   type: suggestionType("type").notNull(),
//   box_id: integer("box_id").references(() => pharm_boxes.id, { onUpdate: "cascade" }),
//   user_body: text("body"),
//   status: boolean("done").default(false).notNull(),
//   admin_comment: text("response")
// });

