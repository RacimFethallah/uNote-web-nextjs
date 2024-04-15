"use server";

import { db } from "@/db/db";
import { lists, notes } from "@/db/schema";
import { count, sql } from 'drizzle-orm';
import { eq, and, lt, gte, ne, or, asc, desc } from 'drizzle-orm';
import { revalidatePath } from "next/cache";
import { getSession } from "./auth";


export const deleteEverything = async () => {
    try {
        await db.delete(notes);
        await db.delete(lists);
        const remainingLists = await db.select().from(lists);
        console.log('Everything deleted');
        console.log('Remaining lists:', remainingLists);
    } catch (error) {
        console.error('Error deleting everything:', error);
    }
};

export const setupDefaultLists = async () => {
    const session = await getSession();
    const userId = session.user[0].id;

    try {
        const defaultLists = [
            { id: 0, name: 'Favoris', userId: userId },
            { id: 1, name: 'Mes Notes', userId: userId },
        ];


        const existingLists = await db
            .select()
            .from(lists)
            .where(or(...defaultLists.map((list) => and(eq(lists.id, list.id), eq(lists.userId, userId)))));

        const alllists = await db.select().from(lists).where(eq(lists.userId, userId));


        const missingLists = defaultLists.filter(
            (list) => !existingLists.some((existingList) => existingList.name === list.name)
        );


        console.log('Missing lists:', missingLists);

        if (missingLists.length > 0) {
            await db.insert(lists).values(missingLists);
            console.log('Default lists created');
        }

        revalidatePath('/home');
    } catch (error) {
        console.error('Error setting up default lists:', error);
    }
}
export async function addNewList(listName: string) {
    const session = await getSession();
    const userId = session.user[0].id;
    try {
        await db
            .insert(lists)
            .values({ name: listName.trim(), userId: userId });

        revalidatePath('/home');
    } catch (error) {
        console.error('Error inserting new list:', error);
        throw error;
    }
};

export async function addNewNote(noteTitle: string, listId: number) {
    const session = await getSession();
    const userId = session.user[0].id;
    try {
        const insertedNote = await db
            .insert(notes)
            .values({ title: noteTitle.trim(), listId: listId, userId: userId , content: '' }).returning();

        revalidatePath('/home');
        return insertedNote;
    } catch (error) {
        console.error('Error inserting new note:', error);
        throw error;
    }
}


export async function deleteList(listId: number) {
    try {
        await db
            .delete(lists)
            .where(eq(lists.id, listId));


        revalidatePath('/home');
    } catch (error) {
        console.error('Error deleting list:', error);
        throw error;
    }

}


export async function deleteNote(noteId: number) {
    try {
        await db
            .delete(notes)
            .where(eq(notes.id, noteId));

        revalidatePath('/home');
    } catch (error) {
        console.error('Error deleting note:', error);
        throw error;
    }
}


export async function fetchLists() {
    const session = await getSession();
    const userId = session.user[0].id;
    try {
        const Lists = await db
            .select()
            .from(lists)
            .where(eq(lists.userId, userId));
        return Lists;
    } catch (error) {
        console.error('Error fetching lists:', error);
        throw error;
    }
}

export async function fetchNotesFromList(listId: number) {
    const session = await getSession();
    const userId = session.user[0].id;
    try {
        const Notes = (await db.select().from(notes).where(and(eq(notes.listId, listId), eq(notes.userId, userId)))).toReversed();
        return Notes;
    } catch (error) {
        console.error('Error fetching notes:', error);
        throw error;
    }

}


export async function fetchNotes() {
    const session = await getSession();
    const userId = session.user[0].id;
    try {
        const Notes = await db
            .select()
            .from(notes)
            .where(eq(notes.userId, userId));
        return Notes;
    } catch (error) {
        console.error('Error fetching notes:', error);
        throw error;
    }
}

export async function getNotesCountForList(listId: number) {
    const notesCount = await db.select({ count: sql<number>`count(*)` }).from(notes).where(eq(notes.listId, listId));
    revalidatePath('/home');
    return notesCount;
}



export async function updateNote(noteId: number, content: string, updatedAt: string) {
    try {
        await db
            .update(notes)
            .set({ content: content, updatedAt: updatedAt })
            .where(eq(notes.id, noteId));

        revalidatePath('/home');
    } catch (error) {
        console.error('Error updating note:', error);
        throw error;
    }
}


export async function addToFavorite(noteId: number) {
    try {
        await db
            .update(notes)
            .set({ listId: 0 })
            .where(eq(notes.id, noteId));

        revalidatePath('/home');
    } catch (error) {
        console.error('Error updating note:', error);
        throw error;
    }

}



export async function removeFromFavorite(noteId: number) {
    try {
        await db
            .update(notes)
            .set({ listId: 1 })
            .where(eq(notes.id, noteId));

        revalidatePath('/home');
    } catch (error) {
        console.error('Error updating note:', error);
        throw error;
    }
}