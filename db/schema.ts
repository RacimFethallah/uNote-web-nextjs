import { integer, text, sqliteTable } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { use } from "react";



export const users = sqliteTable('users', {
    id: integer('id' , { mode: 'number' }).primaryKey({ autoIncrement: true }).notNull(),
    username: text('username').notNull(),
    email: text('email').notNull(),
    password: text('password').notNull(),
});

export const notes = sqliteTable('notes', {
    id: integer('id' , { mode: 'number' }).primaryKey({ autoIncrement: true }).notNull(),
    listId: integer('listId').notNull().references(() => lists.id, {onDelete: 'cascade'}),
    title: text('title').notNull(),
    content: text('content').notNull(),
    createdAt: text("createdAt").default(sql`(CURRENT_DATE)`).notNull(),
    updatedAt: text("updatedAt").default(sql`(CURRENT_DATE)`).notNull(),
});



export const lists = sqliteTable('lists', {
    id: integer('id' , { mode: 'number' }).primaryKey({ autoIncrement: true }).notNull(),
    name: text('name').notNull(),
    userId: integer('userId').notNull().references(() => users.id, {onDelete: 'cascade'}),
 });

