"use server";

import { db } from "@/db/db";
import { lists, notes } from "@/db/schema";
import { count, sql } from 'drizzle-orm';
import { eq, lt, gte, ne, or } from 'drizzle-orm';
import { revalidatePath } from "next/cache";


export const setupDefaultLists = async () => {
    try {
        const defaultLists = [
            { name: 'Favoris' },
            { name: 'Mes Notes' },
        ];


        const existingLists = await db
            .select()
            .from(lists)
            .where(or(...defaultLists.map((list) => eq(lists.name, list.name))));

        console.log('Existing lists:', existingLists);

        const missingLists = defaultLists.filter(
            (list) => !existingLists.some((existingList) => existingList.name === list.name)
        );

        console.log('Missing lists:', missingLists);

        if (missingLists.length > 0) {
            await db.insert(lists).values(missingLists);
            console.log('Default lists created');
        }
    } catch (error) {
        console.error('Error setting up default lists:', error);
    }
};



export async function addNewList(listName: string) {
    try {
        await db
            .insert(lists)
            .values({ name: listName.trim() });

        revalidatePath('/');
    } catch (error) {
        console.error('Error inserting new list:', error);
        throw error;
    }
};

export async function addNewNote(noteTitle: string, listId: number) {
    try {
        await db
            .insert(notes)
            .values({ title: noteTitle.trim(), listId: listId, content: '' });

        revalidatePath('/');
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


        revalidatePath('/');
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

        revalidatePath('/');
    } catch (error) {
        console.error('Error deleting note:', error);
        throw error;
    }
}


export async function fetchLists() {
    try {
        const Lists = await db
            .select()
            .from(lists)
            // .orderBy(lists.name.asc)
            .all();
        return Lists;
    } catch (error) {
        console.error('Error fetching lists:', error);
        throw error;
    }
}

export async function fetchNotesFromList(listId: number) {
    try {
        const Notes = await db.select().from(notes).where(eq(notes.listId, listId))
        return Notes;
    } catch (error) {
        console.error('Error fetching notes:', error);
        throw error;
    }

}

export async function getNotesCountForList(listId: number) {
    const notesCount = await db.select({ count: sql<number>`count(*)` }).from(notes).where(eq(notes.listId, listId));
    revalidatePath('/');
    return notesCount;
}