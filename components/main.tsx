
'use client'

import React from "react";
import dynamic from "next/dynamic";
import { ResizablePanel } from "./ui/resizable";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });



export default function Main({ selectedNote }: { selectedNote: Note | null }) {

    const handleEditorChange = (content: string) => {
        if (selectedNote) {
            const parser = new DOMParser();
            const decodedContent = (parser.parseFromString(content, 'text/html').documentElement.textContent ?? '').trim();
            selectedNote.content = decodedContent;
            selectedNote.updatedAt = new Date();
        }
    };


    return (
        <ResizablePanel defaultSize={60} className="">
            <main className="p-5 overflow-hidden">
                {selectedNote ? (
                    <div>
                        <h1 className="pb-5 text-4xl font-semibold">{selectedNote.title}</h1>
                        <p className="text-sm">
                            Date de création:{' '}
                            {selectedNote.createdAt.toLocaleString('default', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric',
                                hour: 'numeric',
                                minute: 'numeric',
                                hour12: false,
                            })}
                        </p>
                        <p className=" text-sm">
                            Date de modification:{' '}
                            {selectedNote.updatedAt.toLocaleString('default', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric',
                                hour: 'numeric',
                                minute: 'numeric',
                                hour12: false,
                            })}
                        </p>
                        <div className="py-5">
                            <Editor
                                note={selectedNote}
                                onChange={handleEditorChange}
                            />
                        </div>

                    </div>
                ) : (
                    <>
                    </>

                )}
            </main>
        </ResizablePanel>
    );
}