'use client';
// You can use this code in a separate component that's imported in your pages.
import { BoldItalicUnderlineToggles, UndoRedo, BlockTypeSelect, type CodeBlockEditorDescriptor, CodeToggle, CreateLink, InsertCodeBlock, InsertFrontmatter, InsertImage, ListsToggle, InsertTable, InsertThematicBreak, thematicBreakPlugin, tablePlugin, imagePlugin, frontmatterPlugin, linkDialogPlugin, toolbarPlugin, MDXEditorMethods } from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';
import React, { useEffect, useState } from 'react';
const { MDXEditor , codeBlockPlugin, headingsPlugin, listsPlugin, linkPlugin, quotePlugin, markdownShortcutPlugin, useCodeBlockEditorContext } = await import('@mdxeditor/editor')

const PlainTextCodeEditorDescriptor: CodeBlockEditorDescriptor = {
    match: () => true,
    priority: 0,
    Editor: (props) => {
        const cb = useCodeBlockEditorContext()
        return (
            <div onKeyDown={(e) => e.nativeEvent.stopImmediatePropagation()}>
                <textarea rows={3} cols={20} defaultValue={props.code} onChange={(e) => cb.setCode(e.target.value)} />
            </div>
        )
    }
}



export default function Editor({ note, onChange }: { note: Note | null; onChange: (content: string) => void }) {
    const ref = React.useRef<MDXEditorMethods>(null);
    
    useEffect(() => {
        ref.current?.setMarkdown(note?.content ?? '');
    }, [note]);


    const handleEditorChange = (content: string) => {
        console.log(ref.current?.getMarkdown())
        onChange(content); // Call the onChange callback with the updated content
    };


    if (!note) return null

    return <MDXEditor
        contentEditableClassName="outline-none min-h-screen max-w-none text-lg px-8 py-5 prose prose-p:my-3 prose-p:leading-relaxed prose-headings:my-4 prose-blockquote:my-4 prose-ul:my-2 prose-li:my-0 prose-code:px-1 prose-code:text-red-500 prose-code:before:content-[''] prose-code:after:content-['']"
        key={note.title}
        placeholder="Note ..."
        ref={ref}
        onChange={handleEditorChange}
        
        markdown={note.content ?? ''}
        plugins={[
            codeBlockPlugin({ codeBlockEditorDescriptors: [PlainTextCodeEditorDescriptor] }),
            headingsPlugin(),
            listsPlugin(),
            linkPlugin(),
            linkDialogPlugin(),
            quotePlugin(),
            markdownShortcutPlugin(),
            thematicBreakPlugin(),
            tablePlugin(),
            imagePlugin(),
            toolbarPlugin({
                toolbarContents: () => (
                    <>
                        {' '}
                        <BlockTypeSelect />
                        <UndoRedo />
                        <BoldItalicUnderlineToggles />
                        <CodeToggle />
                        <CreateLink />
                        <InsertCodeBlock />
                        <InsertImage />
                        <InsertTable />
                        <ListsToggle />
                        <InsertThematicBreak />
                    </>
                )
            })
        ]}
    />
}