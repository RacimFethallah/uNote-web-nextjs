"use client";
import { useState, useEffect, useRef, use } from 'react';
import { AiOutlineUser } from "react-icons/ai";
import { CgPushChevronLeft, CgPushChevronRight } from "react-icons/cg";
import { IoSettingsOutline, IoAddOutline } from "react-icons/io5";
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
import { addNewList, addNewNote, deleteList, deleteNote, fetchLists, fetchNotesFromList } from '@/app/actions';


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

interface List {
    id: number;
    name: string;
}

interface Note {
    id: number;
    listId: number;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

export default function Aside({ lists }: { lists: List[] }) {

    const [selectedList, setSelectedList] = useState<List | null>(null);
    const [notes, setNotes] = useState<Note[]>([]);


    const handleListItemClick = async (list: List) => {
        setSelectedList(list);

        fetchNotesFromList(list.id).then((notes) => {
            setNotes(notes);
        });

    };


    const handleNewNoteSubmit = async (noteTitle: string) => {
        if (selectedList && selectedList.id != -1) {
            await addNewNote(noteTitle, selectedList.id);
            fetchNotesFromList(selectedList.id).then((notes) => {
                setNotes(notes);
            });
        }
    };


    const handleDeleteNote = async (id: number) => {
        if (selectedList) {
            await deleteNote(id);
            fetchNotesFromList(selectedList.id).then((notes) => {
                setNotes(notes);
            });
        }

    }

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
                                    Utilisateur
                                </div>
                                <div className="text-gray-500 hover:text-gray-700 transition-colors duration-300 cursor-pointer">
                                    <IoSettingsOutline />
                                </div>
                            </div>

                            <ScrollArea className="flex-1 overflow-y-auto">
                                <nav className="p-2 text-base">
                                    <ul className='space-y-2'>
                                        <li className={`p-4 flex items-center gap-3 hover:bg-white hover:cursor-pointer rounded-lg`}
                                        >
                                            <CiStar size={24} /> Favoris
                                            <BsThreeDots className="ml-auto text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={20} />
                                        </li>
                                        <li className={`p-4 flex items-center gap-3 hover:bg-white hover:cursor-pointer rounded-lg`}
                                        >
                                            <CiStickyNote size={24} />
                                            Mes notes
                                            <BsThreeDots className="ml-auto text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={20} />
                                        </li>
                                        <hr />
                                        {lists.filter(list => list.name !== 'Favoris' && list.name !== 'Mes Notes').map((list, index) => (
                                            <React.Fragment key={index}>
                                                <ListItem
                                                    {...list}
                                                    onClick={() => handleListItemClick(list)}
                                                    notes={notes.filter((note) => note.listId === list.id).length} />
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
                        <section className="p-4 h-screen flex flex-col">
                            <h2 className="text-2xl font-bold mb-4 overflow-hidden whitespace-nowrap text-ellipsis ">
                                {selectedList?.name || ''}
                            </h2>
                            <NoteForm onSubmit={handleNewNoteSubmit} />
                            {selectedList && (
                                <ScrollArea className="flex-1 ">
                                    <ul className='space-y-3 pt-3'>
                                        {notes.slice().reverse().map(note => (
                                            <Card key={note.id} className={`hover:cursor-pointer group hover:bg-slate-50 transition-all duration-300`}
                                                style={{ overflow: 'hidden' }}>
                                                <CardHeader className=''>
                                                    <div className='flex flex-row text-sm'>
                                                        {new Intl.DateTimeFormat('fr', { month: 'short', day: 'numeric' }).format(note.createdAt)}
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







{/* {isDrawerOpen ? (
                                <>
                                    <div className="text-xl font-bold p-2 flex justify-between items-center">
                                        <div className="flex justify-center items-center">
                                            <div className="rounded-full bg-gray-200 p-2 mr-4">
                                                <AiOutlineUser className="text-gray-700" />
                                            </div>
                                            Utilisateur
                                        </div>
                                        <div className="text-gray-500 hover:text-gray-700 transition-colors duration-300 cursor-pointer">
                                            <IoSettingsOutline />
                                        </div>
                                    </div>

                                    <ScrollArea className="flex-1 overflow-y-auto">
                                        <nav className="p-2 text-base">
                                            <ul ref={listRef} className='space-y-2'>

                                                <li className={`p-4 flex items-center gap-3 hover:bg-white hover:cursor-pointer rounded-lg ${selectedList?.name === 'Favoris' ? 'bg-white' : ''}`}
                                                    onClick={() => handleListClick(lists.find(list => list.name === 'Favoris') as List)}>
                                                    <CiStar size={24} /> Favoris
                                                    <BsThreeDots className="ml-auto text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={20} />
                                                </li>
                                                <li className={`p-4 flex items-center gap-3 hover:bg-white hover:cursor-pointer rounded-lg ${selectedList?.name === 'Mes Notes' ? 'bg-white' : ''}`}
                                                    onClick={() => handleListClick(lists.find(list => list.name === 'Mes Notes') as List)}>
                                                    <CiStickyNote size={24} />
                                                    Mes notes
                                                    <BsThreeDots className="ml-auto text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={20} />
                                                </li>
                                                <hr />
                                                {lists.filter(list => list.name !== 'Favoris' && list.name !== 'Mes Notes').map((list, index) => (
                                                    <li key={index} className={`p-3 flex items-center gap-3 hover:bg-white hover:cursor-pointer rounded-lg group ${selectedList === list ? 'bg-white' : ''}`}
                                                        onClick={() => handleListClick(list)}>
                                                        <CiViewList size={24} />
                                                        <span className=' w-32 overflow-hidden whitespace-nowrap text-ellipsis'>
                                                            {list.name}
                                                        </span>
                                                        {list.notes.length > 0 && (
                                                            <span className=' rounded-lg bg-slate-200 ml-3 px-1.5 '>
                                                                {list.notes.length}
                                                            </span>
                                                        )}
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger className='ml-auto text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300'><BsThreeDots size={20} /></DropdownMenuTrigger>
                                                            <DropdownMenuContent>
                                                                <DropdownMenuItem className='cursor-pointer'
                                                                    onClick={() => handleDeleteList(list.id)}>
                                                                    <div className='flex flex-row text-red-500 items-center gap-5'>
                                                                        <FaTrash /> Delete
                                                                    </div>
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </li>
                                                ))}
                                            </ul>
                                        </nav>
                                    </ScrollArea>
                                    <div className="mt-auto p-3 flex items-center gap-2">
                                        <Input
                                            required={true}
                                            placeholder="+ New List"
                                            // onSubmit={addList}
                                            // onChange={handleNewListInputChange}
                                            // value={newListInputValue}
                                            // onKeyDown={handleKeyDown}
                                            className="border-2 border-gray-400 focus:border-gray-500 transition-colors duration-300 focus-visible:ring-transparent"
                                        />
                                    </div>
                                    <div className='flex justify-center'>
                                        <Switch className='mb-2 mt-2' />

                                    </div>
                                </>
                            ) : (
                                <nav className="pl-5 pt-5 items-center"
                                    onMouseOver={toggleDrawer}>
                                    <ul className='items-center flex flex-col gap-5'>
                                        <li className="rounded-full bg-gray-200 p-2 mr-4">
                                            <AiOutlineUser className="text-gray-700" />
                                        </li>
                                        <li className="p-2 mr-4">
                                            <CiStar size={24} />
                                        </li>
                                        <li className="p-2 mr-4">
                                            <CiStickyNote size={24} />
                                        </li>
                                    </ul>
                                </nav>
                            )} */}