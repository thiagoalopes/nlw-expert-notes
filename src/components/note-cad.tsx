import * as Dialog from "@radix-ui/react-dialog"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { X } from "lucide-react"

interface NoteCardProps {
    note: {
        id: string,
        date: Date,
        content: string
    }
    onNoteDeleted: (id: string) => void;
}


export function NoteCard({note, onNoteDeleted}: NoteCardProps) {
    return (
        <Dialog.Root>
            <Dialog.Trigger className='flex flex-col rounded-md text-left focus-visible:ring-2 focus-visible:ring-lime-400 bg-slate-800 p-5 gap-3 overflow-hidden relative hover:ring-2 hover:ring-slate-600 outline-none'>
                <span className='text-sm font-medium text-slate-300'>{ formatDistanceToNow(note.date, {locale: ptBR, addSuffix: true}) }</span>
                <p className='text-sm leading-6 text-slate-400'>
                    { note.content }
                </p>
                <div className='absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-black/0 pointer-events-none'/>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="inset-0 fixed bg-black/60">
                    <Dialog.Content className="overflow-hidden fixed md:left-1/2 md:top-1/2 inset-0 md:-translate-x-1/2 outline-none md:h-[60vh] md:-translate-y-1/2 bg-slate-700 md:max-w-[640px] flex flex-col w-full md:rounded-md">
                        <Dialog.DialogClose className="absolute top-0 right-0 p-1.5 bg-slate-800 text-slate-400 group">
                            <X className="size-5 group-hover:text-slate-100"/>
                        </Dialog.DialogClose>
                        <div className="flex flex-1 flex-col gap-3 p-5">
                        <span className='text-sm font-medium text-slate-300'>{ formatDistanceToNow(note.date, {locale: ptBR, addSuffix: true}) }</span>
                        <p className='text-sm leading-6 text-slate-400'>
                            { note.content }
                            </p>
                        </div>
                        <button type="button" onClick={ () => { onNoteDeleted(note.id) }} className=" font-medium w-full bg-slate-800 py-4 text-center text-sm text-slate-300 outline-none group">
                            Deseja <span className="text-red-400 group-hover:underline">apagar esta nota?</span>
                        </button>
                    </Dialog.Content>
                </Dialog.Overlay>
            </Dialog.Portal>
        </Dialog.Root>
    )
}