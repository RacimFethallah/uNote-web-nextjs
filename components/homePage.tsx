// const [selectedNote, setSelectedNote] = useState<Note | null>(null);

import Aside from "./aside";
import Main from "./main";
import { ResizableHandle, ResizablePanelGroup } from "./ui/resizable";


interface List {
  id: number;
  name: string;
}




export default function HomePage({ lists }: { lists: List[] }) {
  return <ResizablePanelGroup direction="horizontal">
    <Aside lists={lists} />
    <ResizableHandle disabled={true} />
    <Main />
  </ResizablePanelGroup>;
}

