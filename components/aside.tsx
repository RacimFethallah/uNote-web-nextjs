"use client";
import { useState, useEffect, useRef } from 'react';
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
import { addNewList } from '@/app/actions';


import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"



interface List {
    id: string;
    name: string;
    notes: Note[];
}

export default function Aside({ setSelectedNote }: { setSelectedNote: (note: Note | null) => void }) {
    const [isDrawerOpen, setIsDrawerOpen] = useState(true);
    const [lists, setLists] = useState<List[]>([]);
    const [newListInputValue, setNewListInputValue] = useState('');
    const [newNoteInputValue, setNewNoteInputValue] = useState('');
    const listRef = useRef<HTMLUListElement>(null);
    const [selectedList, setSelectedList] = useState<List | null>(null);
    const [selectedNoteState, setSelectedNoteState] = useState<Note | null>(null);

    const handleListClick = (list: List) => {
        setSelectedList(list);
    };
    const handleNoteClick = (note: Note) => {
        setSelectedNote(note);
        setSelectedNoteState(note);
    };

    const handleDeleteList = (listId: string) => {
        setLists(lists.filter((l) => l.id !== listId));
        setTimeout(() => {
            setSelectedList(null);
            setSelectedNote(null);
        }, 0);
    };

    const handleDeleteNote = (noteId: string) => {
        if (selectedList) {
            const updatedList = {
                ...selectedList,
                notes: selectedList.notes.filter((note) => note.id !== noteId)
            };
            const updatedLists = lists.map((list) =>
                list.id === selectedList.id
                    ? updatedList
                    : list
            );
            setLists(updatedLists);
            setTimeout(() => {
                setSelectedList(updatedList);
                setSelectedNote(null);
            }, 0);
        }
    };


    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };



    const addList = async () => {

        if (newListInputValue.trim()) {
            try {
                await addNewList(newListInputValue);
                setNewListInputValue('');
            } catch (error) {
                console.error('Error adding new list:', error);
            }
        }
    };



    const handleAddNewNote = () => {
        if (newNoteInputValue.trim() !== '' && selectedList) {
            const newNote: Note = {
                id: Math.random().toString(36).substring(7),
                title: newNoteInputValue.trim(),
                content: '',
                createdAt: new Date(),
                updatedAt: new Date()
            };
            const updatedLists = lists.map((list) =>
                list.id === selectedList.id
                    ? { ...list, notes: [...list.notes, newNote] }
                    : list
            );
            handleNoteClick(newNote);
            setLists(updatedLists);
            setNewNoteInputValue('');
            setSelectedList(prevList => {
                if (prevList) {
                    return {
                        ...prevList,
                        notes: [...prevList.notes, newNote]
                    };
                }
                return null;
            });
        }
    };

    const handleNewListInputChange = (e: any) => {
        setNewListInputValue(e.target.value);
    };
    const handleNewNoteInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewNoteInputValue(e.target.value);
    };

    useEffect(() => {
        const handleListUpdate = () => {
            if (selectedList) {
                const updatedList = lists.find((list) => list.id === selectedList.id);
                if (updatedList) {
                    setSelectedList(updatedList);
                }
            }
        };
        // const handleResize = () => {
        //     if (window.innerWidth < 768 || window.innerHeight < 420) {
        //         setIsDrawerOpen(false);
        //     } else {
        //         setIsDrawerOpen(true);
        //     }
        // };

        // window.addEventListener('resize', handleResize);
        handleListUpdate();
        // return () => {
        //     window.removeEventListener('resize', handleResize);
        // };
        // This will trigger a re-render whenever selectedList changes
    }, [selectedList, lists]);

    useEffect(() => {
        const favoritesList: List = {
            id: "1",
            name: "Favoris",
            notes: []
        };
        const mesNotesList: List = {
            id: "2",
            name: "Mes Notes",
            notes: []
        };

        // Set the lists state with predefined lists
        setLists([favoritesList, mesNotesList]);
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            if (newListInputValue.trim() !== '') {
                addList();
            } else if (newNoteInputValue.trim() !== '' && selectedList) {
                handleAddNewNote();
            }
            setTimeout(() => {
                const newItem = listRef.current?.lastElementChild;
                newItem?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
        }
    };

    return (
        <ResizablePanel className='' defaultSize={40} maxSize={40} minSize={40}>

            <ResizablePanelGroup direction='horizontal'>

                <aside className=" border-gray-300 transition-all duration-300 ease-in-out overflow-hidden flex flex-row min-w-full">
                    <ResizablePanel minSize={10} defaultSize={35} maxSize={45} collapsedSize={10} className='shadow-xl'>
                        <section className={` bg-[#f7f7f9]  p-3 flex flex-col transition-all duration-300 ease-in-out   h-screen `}>
                            <div className={`${isDrawerOpen ? 'pr-2' : ''} flex justify-end text-2xl text-gray-500 hover:text-gray-700 transition-colors duration-300 cursor-pointer`} onClick={toggleDrawer}>
                                {isDrawerOpen ? <CgPushChevronLeft /> : <CgPushChevronRight />}
                            </div>
                            {isDrawerOpen ? (
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
                                            onSubmit={addList}
                                            onChange={handleNewListInputChange}
                                            value={newListInputValue}
                                            onKeyDown={handleKeyDown}
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
                            )}
                        </section>
                    </ResizablePanel>
                    <ResizableHandle />
                    <ResizablePanel defaultSize={40} className=''>
                        <section className="p-4 h-screen flex flex-col">
                            <h2 className="text-2xl font-bold mb-4 overflow-hidden whitespace-nowrap text-ellipsis ">{selectedList?.name || 'Select a list'}</h2>
                            <div className=''>
                                <Input
                                    required={true}
                                    placeholder="+ New Note"
                                    onSubmit={handleAddNewNote}
                                    onChange={handleNewNoteInputChange}
                                    value={newNoteInputValue}
                                    onKeyDown={handleKeyDown}
                                    className="border-2 border-gray-400 focus:border-gray-500 focus:bg-slate-200 transition-colors duration-300 focus-visible:ring-transparent bg-slate-50 text-black "
                                />
                            </div>

                            {selectedList && (
                                <ScrollArea className="flex-1 pr-5">
                                    <ul className='space-y-3 pt-3'>
                                        {selectedList.notes.slice().reverse().map(note => (
                                            <Card key={note.id} className={`hover:cursor-pointer group hover:bg-slate-50 transition-all duration-300 ${selectedNoteState?.id === note.id ? 'bg-slate-50 border-black' : 'bg-white'}`}
                                                style={{ overflow: 'hidden' }}
                                                onClick={() => handleNoteClick(note)}>
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