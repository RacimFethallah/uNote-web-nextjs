"use client";

import Aside from "@/components/aside";
import Main from "@/components/main";
import { ResizableHandle, ResizablePanelGroup } from "@/components/ui/resizable";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  return (
    <>
    <ResizablePanelGroup direction="horizontal">
      <Aside setSelectedNote={setSelectedNote} />
      <ResizableHandle disabled={true} />
      <Main selectedNote={selectedNote} />
      </ResizablePanelGroup>
    </>
  );
}
