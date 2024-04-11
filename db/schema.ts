import { integer, text, sqliteTable } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";


export const notes = sqliteTable('notes', {
    id: integer('id' , { mode: 'number' }).primaryKey({ autoIncrement: true }).notNull(),
    listId: integer('listId').notNull().references(() => lists.id),
    title: text('title').notNull(),
    content: text('content').notNull(),
    createdAt: integer('createdAt', { mode: 'timestamp' }).default(sql`(CURRENT_TIMESTAMP)`).notNull(),
    updatedAt: integer('updatedAt', { mode: 'timestamp' }).default(sql`(CURRENT_TIMESTAMP)`).notNull(),
});



export const lists = sqliteTable('lists', {
    id: integer('id' , { mode: 'number' }).primaryKey({ autoIncrement: true }).notNull(),
    name: text('name').notNull(),
 });

