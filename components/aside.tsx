"use client";
import { useState, useEffect, useRef, use } from 'react';
import { AiOutlineUser } from "react-icons/ai";
import { CgPushChevronLeft, CgPushChevronRight } from "react-icons/cg";
import { IoSettingsOutline, IoAddOutline, IoExitOutline } from "react-icons/io5";
import { CiStar, CiStickyNote, CiViewList } from "react-icons/ci";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BsThreeDots } from 'react-icons/bs';
import { Switch } from "@/components/ui/switch"
import { FaTrash } from "react-icons/fa";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { addNewList, addNewNote, deleteList, deleteNote, fetchLists, fetchNotesFromList, setupDefaultLists } from '@/actions/actions';


import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import listForm from './listForm';
import ListForm from './listForm';
import ListItem from './listItem';
import React from 'react';
import NoteForm from './noteForm';
import { redirect, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { logout } from '@/actions/auth';

interface List {
    id: number;
    name: string;
}

interface Note {
    id: number;
    listId: number;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
}

interface SelectedList {
    id: string;
    name: string;
}

interface User {
    id: string;
    username: string;
    email: string;
}

export default function Aside({ lists, Notes, user }: { lists: List[], Notes: Note[], user: User}) {
    console.log(lists)


    const searchParams = useSearchParams();
    const router = useRouter();
    const selectedList: SelectedList = {
        id: searchParams.get('listId') ?? '1',
        name: searchParams.get('listName') ?? 'Mes Notes',
    };
    const selectedNote = searchParams.get('noteId');

    // console.log(selectedList);

    // if (selectedList.name === 'Mes Notes') {
    //     router.replace('?listId=1&listName=Mes Notes');
    // }


    // const [selectedList, setSelectedList] = useState<List | null>(null);
    // const [notes, setNotes] = useState<Note[]>([]);

    useEffect(() => {
        const setup = async () => {
            await setupDefaultLists();
        };
        setup();
    }, []);



    // const handleNoteClick = (note: Note) => {
    //     setSelectedNote(note);
    // };

    const handleListItemClick = async (list: List) => {
        // setSelectedList(list);

        fetchNotesFromList(list.id).then((notes) => {
            // setNotes(notes);
            console.log(notes);
        });

    };


    const handleNewNoteSubmit = async (noteTitle: string) => {
        if (selectedList && parseInt(selectedList.id) != -1) {
            if (selectedList) {
                const insertedNote = await addNewNote(noteTitle, parseInt(selectedList.id));
                // handleNoteClick(insertedNote[0]);
                fetchNotesFromList(parseInt(selectedList.id)).then((notes) => {
                    // setNotes(notes);
                });
            }
        };
    }


    const handleDeleteNote = async (id: number) => {
        if (selectedList) {
            await deleteNote(id);
            fetchNotesFromList(parseInt(selectedList.id)).then((notes) => {
                // setNotes(notes);
            });
        }

    }

    const getNoteCount = (listName: string) => {
        const list = lists.find((l) => l.name === listName);
        return list ? Notes.filter((note) => note.listId === list.id).length : 0;
    };

    return (
        <ResizablePanel className='' defaultSize={40} maxSize={40} minSize={40}>
            <ResizablePanelGroup direction='horizontal'>
                <aside className=" border-gray-300 transition-all duration-300 ease-in-out overflow-hidden flex flex-row min-w-full">
                    <ResizablePanel minSize={10} defaultSize={45} maxSize={45} collapsedSize={10} className='shadow-xl'>
                        <section className={` bg-[#f7f7f9]  p-3 flex flex-col transition-all duration-300 ease-in-out   h-screen `}>
                            <div className={`flex justify-end text-2xl text-gray-500 hover:text-gray-700 transition-colors duration-300 cursor-pointer`}>
                            </div>
                            <div className="text-xl font-bold p-2 flex justify-between items-center">
                                <div className="flex justify-center items-center">
                                    <div className="rounded-full bg-gray-200 p-2 mr-4">
                                        <AiOutlineUser className="text-gray-700" />
                                    </div>
                                    {user.username ?? "utilisateur"}
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="text-gray-500 hover:text-gray-700 transition-colors duration-300 cursor-pointer">
                                        <BsThreeDots size={20} />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem
                                            className="cursor-pointer"
                                            onClick={async () => {
                                            
                                                await logout();
                                                redirect('/');
                                            }}
                                        >
                                            <div className="flex flex-row text-red-500 items-center gap-5">
                                                <IoExitOutline /> Logout
                                            </div>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <ScrollArea className="flex-1 overflow-y-auto">
                                <nav className="p-2 text-base">
                                    <ul className='space-y-2'>
                                        {/* <li
                                            className={`p-4 flex items-center gap-3 hover:bg-white hover:cursor-pointer rounded-lg ${selectedList?.name === 'Favoris' ? 'bg-white' : ''}`}
                                            onClick={() => handleListItemClick(lists.find((list) => list.name === 'Favoris') as List)}
                                        >
                                            <CiStar size={24} /> Favoris
                                            {getNoteCount('Favoris') > 0 && (
                                                <span className=" rounded-lg bg-slate-200 px-1.5 ml-auto ">{getNoteCount('Favoris')}</span>
                                            )}
                                        </li>
                                        <li
                                            className={`p-4 flex items-center gap-3 hover:bg-white hover:cursor-pointer rounded-lg ${selectedList?.name === 'Mes Notes' ? 'bg-white' : ''}`}
                                            onClick={() => handleListItemClick(lists.find((list) => list.name === 'Mes Notes') as List)}
                                        >
                                            <CiStickyNote size={24} /> Mes notes
                                            {getNoteCount('Mes Notes') > 0 && (
                                                <span className=" rounded-lg bg-slate-200 px-1.5 ml-auto ">{getNoteCount('Mes Notes')}</span>
                                            )}
                                        </li> */}
                                        <Link
                                            href={`home?listId=0&listName=Favoris`}
                                            className={`p-4 flex items-center gap-3 hover:bg-white hover:cursor-pointer rounded-lg ${selectedList.name === 'Favoris' ? 'bg-white' : ''}`}

                                        >
                                            <CiStar size={24} /> Favoris
                                            {getNoteCount('Favoris') > 0 && (
                                                <span className=" rounded-lg bg-slate-200 px-1.5 ml-auto ">{getNoteCount('Favoris')}</span>
                                            )}
                                        </Link>
                                        <Link
                                            href={`home?listId=1&listName=Mes Notes`}
                                            className={`p-4 flex items-center gap-3 hover:bg-white hover:cursor-pointer rounded-lg ${selectedList.name === 'Mes Notes' ? 'bg-white' : ''}`}

                                        >
                                            <CiStickyNote size={24} /> Mes notes
                                            {getNoteCount('Mes Notes') > 0 && (
                                                <span className=" rounded-lg bg-slate-200 px-1.5 ml-auto ">{getNoteCount('Mes Notes')}</span>
                                            )}
                                        </Link>
                                        <hr />
                                        {lists.filter(list => list.name !== 'Favoris' && list.name !== 'Mes Notes').map((list, index) => (
                                            <React.Fragment key={index}>
                                                <ListItem
                                                    {...list}
                                                    onClick={() => handleListItemClick(list)}
                                                    notes={Notes.filter((note) => note.listId === list.id).length}
                                                    selectedList={selectedList} />
                                            </React.Fragment>
                                        ))}
                                    </ul>
                                </nav>
                            </ScrollArea>
                            <ListForm />
                            <div className='flex justify-center'>
                                <Switch className='mb-2 mt-2' />
                            </div>




                        </section>
                    </ResizablePanel>
                    <ResizableHandle />
                    <ResizablePanel defaultSize={40} className=''>
                        <section className="pl-4 pt-4 h-screen flex flex-col">
                            <h2 className="text-2xl font-bold mb-4 overflow-hidden whitespace-nowrap text-ellipsis ">
                                {selectedList.name || ''}
                            </h2>
                            <NoteForm onSubmit={handleNewNoteSubmit} />
                            {selectedList && (
                                <ScrollArea className="flex-1 pr-4">
                                    <ul className='space-y-3 pt-3'>
                                        {Notes.filter(note => note.listId === parseInt(selectedList.id)).slice().reverse().map(note => (
                                            <Link
                                                href={`home?listId=${selectedList.id}&listName=${selectedList.name}&noteId=${note.id}`}>
                                                <Card
                                                    key={note.id}
                                                    className={`hover:cursor-pointer group hover:bg-slate-50 transition-all duration-300 ${selectedNote !== null && parseInt(selectedNote) === note.id ? 'bg-slate-50 border-black' : 'bg-white'
                                                        }`}
                                                    style={{ overflow: 'hidden' }}
                                                >
                                                    <CardHeader className=''>
                                                        <div className='flex flex-row text-sm'>
                                                            {(() => {
                                                                const createdAtDate = new Date(note.createdAt);
                                                                const options = { month: 'short' };
                                                                const formattedDate = createdAtDate.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' });
                                                                return formattedDate;
                                                            })()}
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger className='ml-auto text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300'><BsThreeDots size={20} /></DropdownMenuTrigger>
                                                                <DropdownMenuContent>
                                                                    <DropdownMenuItem className='cursor-pointer'>
                                                                        <div className='flex flex-row text-red-500 items-center gap-5'

                                                                            onClick={() => handleDeleteNote(note.id)}>
                                                                            <FaTrash /> Delete
                                                                        </div> </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </div>

                                                        <CardTitle className=' overflow-hidden whitespace-nowrap text-ellipsis w-60 text-lg'>
                                                            {note.title}
                                                        </CardTitle>
                                                        <CardDescription className=' overflow-hidden whitespace-nowrap text-ellipsis w-60'>
                                                            {note.content}
                                                        </CardDescription>
                                                    </CardHeader>
                                                </Card>
                                            </Link>
                                        ))}
                                    </ul>
                                </ScrollArea>
                            )}
                        </section>
                    </ResizablePanel>
                </aside>
            </ResizablePanelGroup>

        </ResizablePanel>
    );
}