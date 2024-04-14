"use server"

import { db } from "@/db/db";
import { users } from "@/db/schema";
import { revalidatePath } from "next/cache";
import bcrypt from "bcrypt";


export const registerUser = async (formData: FormData) => {


    const rawFormData = {
        username: formData.get('username') as string,
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const hashedPassword = await bcrypt.hash(rawFormData.password, 10);

    try {
        await db
            .insert(users)
            .values({ username: rawFormData.username, email: rawFormData.email, password: hashedPassword });

        revalidatePath('/');
    } catch (error) {
        console.error('Error inserting new note:', error);
        throw error;
    }



}
