"use server"
import { db } from "@/db/db"
import { users } from "@/db/schema";
import { eq, lt, gte, ne, or, asc, desc } from 'drizzle-orm';

interface User {
    id: number;
    username: string;
    email: string;
    password: string;

}

export const getUserByEmail = async (email: string) => {
    try {
        const user: User[] = await db.select().from(users).where(eq(users.email, email));
        return user;
    } catch (error) {
        console.log(error);
    }
}


export const getUserById = async (id: number) => {
    try {
        const user = await db.select().from(users).where(eq(users.id, id));
        return user;
    } catch (error) {
        console.log(error);
    }
}