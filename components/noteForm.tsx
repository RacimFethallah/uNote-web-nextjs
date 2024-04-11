import { useState } from "react";
import { Input } from "./ui/input";

interface NoteFormProps {
    onSubmit: (noteTitle: string) => Promise<void>;
  }
  
  export default function NoteForm({ onSubmit }: NoteFormProps) {
    const [newNoteInputValue, setNewNoteInputValue] = useState("");
  
    const handleNewNoteInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setNewNoteInputValue(e.target.value);
    };
  
    const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        const noteInput = newNoteInputValue.trim();
        if (noteInput !== "" && noteInput !== "Favoris" && noteInput !== "Mes Notes") {
          await onSubmit(noteInput);
          setNewNoteInputValue("");
        }
      }
    };
  
    return (
      <div className="">
        <Input
          required={true}
          placeholder="+ New Note"
          onChange={handleNewNoteInputChange}
          value={newNoteInputValue}
          onKeyDown={handleKeyDown}
          className="border-2 border-gray-400 focus:border-gray-500 focus:bg-slate-200 transition-colors duration-300 focus-visible:ring-transparent bg-slate-50 text-black"
        />
      </div>
    );
  }