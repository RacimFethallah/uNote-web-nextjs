import { fetchLists, fetchNotes } from "@/actions/actions";
import { auth } from "@/actions/auth";
import Aside from "@/components/aside";
import Main from "@/components/main";
import { ResizableHandle, ResizablePanelGroup } from "@/components/ui/resizable";





export default async function Home() {

  const session = await auth();


  const lists = await fetchLists();


  const notes = await fetchNotes();


  return <ResizablePanelGroup direction="horizontal">
    <Aside lists={lists} Notes={notes} />
    <ResizableHandle disabled={true} />
    <Main notes={notes} />
  </ResizablePanelGroup>;
}

