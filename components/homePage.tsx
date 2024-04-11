// const [selectedNote, setSelectedNote] = useState<Note | null>(null);

"use client";
import { useState } from "react";
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




export default function HomePage({ lists }: { lists: List[] }) {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);


  return <ResizablePanelGroup direction="horizontal">
    <Aside lists={lists} selectedNote={selectedNote} setSelectedNote={setSelectedNote} />
    <ResizableHandle disabled={true} />
    <Main selectedNote={selectedNote} />
  </ResizablePanelGroup>;
}

