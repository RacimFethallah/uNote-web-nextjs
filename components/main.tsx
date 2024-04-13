'use client';
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { ResizablePanel } from './ui/resizable';
import { addToFavorite, removeFromFavorite, updateNote } from '@/app/actions';
import { time } from 'console';
import { CiStar } from 'react-icons/ci';
import { GoStarFill, GoStar } from "react-icons/go";
import { useRouter, useSearchParams } from 'next/navigation';

const Editor = dynamic(() => import('@/components/editor'), { ssr: false });

interface Note {
    id: number;
    listId: number;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
}

export default function Main({notes} : {notes : Note[]}) {
    const searchParams = useSearchParams();
    const router = useRouter();

    const selectedNoteId = searchParams.get('noteId');
    const selectedNote = selectedNoteId ? notes.find((note) => note.id === parseInt(selectedNoteId)) : null;
    const [isNoteModified, setIsNoteModified] = useState(false);

    const handleEditorChange = (content: string) => {
        if (selectedNote) {
            const parser = new DOMParser();
            const decodedContent = (parser.parseFromString(content, 'text/html').documentElement.textContent ?? '').trim();
            selectedNote.content = decodedContent;
            setTimeout(() => { setIsNoteModified(true); }, 5000);
        }
    };

    useEffect(() => {
        if (selectedNote && isNoteModified) {
            selectedNote.updatedAt = new Date().toISOString();
            updateNote(selectedNote.id, selectedNote.content, selectedNote.updatedAt);
            setIsNoteModified(false);
        }
    }, [selectedNote, isNoteModified, updateNote]);

    const setFavorite = async (id: number) => {
        await addToFavorite(id);

    }
    const removeFavorite = async (id: number) => {
        await removeFromFavorite(id);

    }

    return (
        <ResizablePanel defaultSize={60} className="">
            <main className="p-5 overflow-hidden">
                {selectedNote ? (
                    <div>
                        <h1 className="pb-5 text-4xl font-semibold">{selectedNote.title}</h1>
                        <p className="text-sm">
                            Date de création:{' '}
                            {(() => {
                                const createdAtDate = new Date(selectedNote.createdAt);
                                return createdAtDate.toLocaleString('fr-FR', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric',
                                    hour: 'numeric',
                                    minute: 'numeric',
                                    hour12: false,
                                });
                            })()}
                        </p>
                        <div className='flex flex-row items-center'>
                            <p className="text-sm">
                                Date de modification:{' '}
                                {(() => {
                                    const updatedAtDate = new Date(selectedNote.updatedAt);
                                    return updatedAtDate.toLocaleString('fr-FR', {
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric',
                                        hour: 'numeric',
                                        minute: 'numeric',
                                        hour12: false,
                                    });
                                })()}
                            </p>
                            <span className='ml-auto cursor-pointer' onClick={() => 
                                {selectedNote.listId === 0 ? removeFavorite(selectedNote.id) : setFavorite(selectedNote.id)}}>
                                {selectedNote.listId === 0 ? <GoStarFill size={24} /> : <GoStar size={24} />}

                            </span>

                        </div>

                        <div className="py-5">
                            <Editor note={selectedNote} onChange={handleEditorChange} />
                        </div>
                    </div>
                ) : (
                    <></>
                )}
            </main>
        </ResizablePanel>
    );
}