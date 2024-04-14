"use server"
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { NextRequest, NextResponse } from "next/server";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { eq, and, lt, gte, ne, or, asc, desc } from 'drizzle-orm';


import { db } from "@/db/db";
import { users } from "@/db/schema";
import { revalidatePath } from "next/cache";
import bcrypt from "bcrypt";
import { getUserByEmail } from "@/data/user";






const secretKey = process.env.NEXTAUTH_SECRET;
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("30d")
        .sign(key);
}



export async function decrypt(input: string): Promise<any> {
    const { payload } = await jwtVerify(input, key, {
        algorithms: ["HS256"],
    });
    return payload;
}



export async function loginUser(formData: FormData) {
    // Verify credentials && get the user

    const email = formData.get('email') as string;
    console.log("email: ", email)
    const password = formData.get('password') as string;

    const user = await getUserByEmail(email);

    console.log("user:", user);

    if (!user) {
        return { error: 'User not found', message: 'User not found' };
    }

    const isPasswordValid = await bcrypt.compare(password, user[0].password);
    if (isPasswordValid) {
        const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        const session = await encrypt({ user, expires })
        //Save the session in a cookie
        cookies().set("session", session, { expires, httpOnly: true });
        return { success: true, message: 'Login successful' };
    } else {
        return { error: 'Invalid credentials', message: 'Invalid credentials' };
    }



    //Create the session

}




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



export async function logout() {
    // Destroy the session
    cookies().set("session", "", { expires: new Date(0) });
}




export async function getSession() {

    const session = cookies().get("session")?.value;
    console.log("session: ", session);
    if (!session) return null;
    return await decrypt(session);
}



export async function updateSession(request: NextRequest) {
    const session = request.cookies.get("session")?.value;
    if (!session) return;

    // Refresh the session so it doesn't expire
    const parsed = await decrypt(session);
    parsed.expires = new Date(Date.now() + 10 * 1000);
    const res = NextResponse.next();
    res.cookies.set({
        name: "session",
        value: await encrypt(parsed),
        httpOnly: true,
        expires: parsed.expires,
    });
    return res;
}