"use server"

import { db } from "@/db/db";
import { users } from "@/db/schema";
import { revalidatePath } from "next/cache";
import bcrypt from "bcrypt";
import { getUserByEmail } from "@/data/user";
import { toast } from "sonner";


export const registerUser = async (formData: FormData) => {
    const rawFormData = {
        username: formData.get('username') as string,
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    };

    const hashedPassword = await bcrypt.hash(rawFormData.password, 10);
    const existingUser = await getUserByEmail(rawFormData.email);
    console.log('Existing user:', existingUser);

    if (existingUser && existingUser[0]?.email === rawFormData.email) {
        return { error: 'User already exists', message: 'Email already exists' };
    }

    console.log('Registering user:', rawFormData);

    try {
        await db.insert(users).values({
            username: rawFormData.username,
            email: rawFormData.email,
            password: hashedPassword,
        });
        revalidatePath('/');
        return { success: true, message: 'Registration successful' };
    } catch (error) {
        console.error('Error inserting new note:', error);
        return { error: 'Error registering user', message: 'Error registering user' };
    }
};
