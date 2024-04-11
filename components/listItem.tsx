"use client";

import { CiViewList } from "react-icons/ci";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { BsThreeDots } from "react-icons/bs";
import { FaTrash } from "react-icons/fa";
import { deleteList, getNotesCountForList } from "@/app/actions";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ListItemProps {
    id: number;
    name: string;
    onClick: () => void;
    notes: number;
}

export default function ListItem({ id, name, onClick, notes }: ListItemProps) {
    const handleClick = () => {
        onClick();
    };

    const handleDeleteListClick = async (listId: number) => {
        await deleteList(listId);
    };

    return (
        <li
            className={`p-3 flex items-center gap-3 hover:bg-white hover:cursor-pointer rounded-lg group`}
            onClick={() => handleClick()}
        >
            <CiViewList size={24} />
            <span className=" w-32 overflow-hidden whitespace-nowrap text-ellipsis">
                {name}
            </span>
            
            {notes > 0 && (
                <span className=' rounded-lg bg-slate-200 ml-3 px-1.5 '>
                    {notes}
                </span>
            )}
            <DropdownMenu>
                <DropdownMenuTrigger className="ml-auto text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <BsThreeDots size={20} />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => handleDeleteListClick(id)}
                    >
                        <div className="flex flex-row text-red-500 items-center gap-5">
                            <FaTrash /> Delete
                        </div>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </li>
    );
}