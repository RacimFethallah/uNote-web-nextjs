// const [selectedNote, setSelectedNote] = useState<Note | null>(null);

"use client";
// import { useState } from "react";
import Aside from "./aside";
import Main from "./main";
import { ResizableHandle, ResizablePanelGroup } from "./ui/resizable";


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




export default function HomePage({ lists, notes }: { lists: List[], notes: Note[] }) {
  // const [selectedNote, setSelectedNote] = useState<Note | null>(null);


  return <ResizablePanelGroup direction="horizontal">
    <Aside lists={lists} Notes={notes} />
    <ResizableHandle disabled={true} />
    <Main notes={notes} />
  </ResizablePanelGroup>;
}

