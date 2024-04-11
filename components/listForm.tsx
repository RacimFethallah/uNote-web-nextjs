"use client"

import { useState } from "react";
import { Input } from "./ui/input";
import { addNewList } from "@/app/actions";




export default function ListForm() {

    const [newListInputValue, setNewListInputValue] = useState('');

    const handleNewListInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewListInputValue(e.target.value);
    };

    const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            if (newListInputValue.trim() !== '') {
                await addNewList(newListInputValue);
                setNewListInputValue('');
            }
        }
    };


    return <div className="mt-auto p-3 flex items-center gap-2">
        <Input
            required={true}
            placeholder="+ New List"
            onChange={handleNewListInputChange}
            value={newListInputValue}
            onKeyDown={handleKeyDown}
            className="border-2 border-gray-400 focus:border-gray-500 transition-colors duration-300 focus-visible:ring-transparent" />
    </div>;
}