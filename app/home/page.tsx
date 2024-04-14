import { fetchLists, fetchNotes } from "@/app/actions";
import Aside from "@/components/aside";
import Main from "@/components/main";
import { ResizableHandle, ResizablePanelGroup } from "@/components/ui/resizable";





export default async function Home() {


  const lists = await fetchLists();

  const notes = await fetchNotes();

  return <ResizablePanelGroup direction="horizontal">
    <Aside lists={lists} Notes={notes} />
    <ResizableHandle disabled={true} />
    <Main notes={notes} />
  </ResizablePanelGroup>;
}

