"use client";

import { CiStar, CiStickyNote } from "react-icons/ci";
import { ScrollArea } from "./ui/scroll-area";
import { BsThreeDots } from "react-icons/bs";
import React, { useRef } from "react";
import ListItem from "./listItem";


export default function ListView(lists: { name: string; id: number; }[]) {
    const scroll = useRef<HTMLUListElement>(null);



    return <ScrollArea className="flex-1 overflow-y-auto">
        <nav className="p-2 text-base">
            <ul className='space-y-2' ref={scroll}>
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
                        <ListItem {...list} />
                    </React.Fragment>
                ))}
            </ul>
        </nav>
    </ScrollArea>;
}