import { fetchLists, fetchNotes } from "@/actions/actions";
import { getSession } from "@/actions/auth";
//import { auth } from "@/actions/auth";
import Aside from "@/components/aside";
import Main from "@/components/main";
import { ResizableHandle, ResizablePanelGroup } from "@/components/ui/resizable";





export default async function Home() {
  const session = await getSession();

  const user = {id: session.user[0].id, username: session.user[0].username, email: session.user[0].email}
  

  //const session = await auth();


  const lists = await fetchLists();


  const notes = await fetchNotes();


  return <ResizablePanelGroup direction="horizontal">
    <Aside lists={lists} Notes={notes} user={user} />
    <ResizableHandle disabled={true} />
    <Main notes={notes} />
  </ResizablePanelGroup>;
}

