// "use client";

import Aside from "@/components/aside";
import HomePage from "@/components/homePage";
import Main from "@/components/main";
import { ResizableHandle, ResizablePanelGroup } from "@/components/ui/resizable";
import Image from "next/image";
import { useState } from "react";
import { fetchLists } from "./actions";

export default async function Home() {

  const lists = await fetchLists();



  return (
    <>
      <HomePage lists={lists} />
    </>
  );
}


