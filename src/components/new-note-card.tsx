import * as Dialog from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { ChangeEvent, FormEvent, useState } from "react"
import { toast } from "sonner";

interface NewNoteCardProp {
    onNoteCreated: (content: string) => void;
}

export function NewNoteCard({ onNoteCreated }: NewNoteCardProp){

    const [shouldShowOnBoarding, setShouldShowOnBoarding] = useState(true);
    const [content, setContent] = useState('');
    const [isRecording, setIsRecording] = useState(false);

    let speechRecognition: SpeechRecognition | null = null;

    function handleStartEditor() {
        setShouldShowOnBoarding(false);
    }

    function handleContentOnChanged(event: ChangeEvent<HTMLTextAreaElement>){
        
        if(event.target.value === ''){
            setShouldShowOnBoarding(true);
        }

        setContent(event.target.value);
    }

    function handleSaveNote(event:  FormEvent){
        event.preventDefault();

        if(content == ''){
            return;
        }

        onNoteCreated(content)

        toast.success('Nota criada com sucesso!');

        setContent('');
        setShouldShowOnBoarding(true);
    }

    function handleStartRecording(){

        const isSpeechRecognitionRecordingAPIAvailable = 'SpeechRecognition' in window
        || 'webkitSpeechRecognition' in window

        if(!isSpeechRecognitionRecordingAPIAvailable){
            alert('Api não disponível');
            return;
        }

        setIsRecording(true);

        const speechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        speechRecognition = new speechRecognitionAPI();
        console.log(speechRecognition);
        
        speechRecognition.lang = 'pt-BR';
        speechRecognition.continuous = true;
        speechRecognition.maxAlternatives = 1;
        speechRecognition.interimResults = true;

        speechRecognition.onresult = (event) => {
            const transcription = Array.from(event.results).reduce((text, result)=>{
                return text.concat(result[0].transcript);
            }, '');

            setContent(transcription);
            setShouldShowOnBoarding(false);
        }

        speechRecognition.onerror = (event) => {
            console.error(event);
        }

        speechRecognition.start();
    }

    function handleStopRecording(){
        
        if(speechRecognition != null){
            speechRecognition.stop();
        }
        setIsRecording(false);
    }

    return (

        <Dialog.Root>

        
            <Dialog.Trigger className='flex flex-col rounded-md bg-slate-700 p-5 gap-3 text-left overflow-hidden hover:ring-slate-600 focus-visible:ring-2 outline-none focus-visible:ring-lime-400 hover:ring-2 hover:ring-slate-60'>
                <span className='text-sm font-medium text-slate-200'>Adicionar nota</span>
                <p className='text-sm leading-6 text-slate-400'>Grave uma nota de audio e onjverta para texto automaticamente</p>
            </Dialog.Trigger>

            <Dialog.Portal>
                <Dialog.Overlay className="inset-0 fixed bg-black/60">
                    <Dialog.Content className="overflow-hidden fixed md:left-1/2 md:top-1/2 md:-translate-x-1/2 outline-none inset-0 md:h-[60vh] md:-translate-y-1/2 bg-slate-700 md:max-w-[640px] flex flex-col w-full md:rounded-md">
                        <Dialog.DialogClose className="absolute top-0 right-0 p-1.5 bg-slate-800 text-slate-400 group">
                            <X className="size-5 group-hover:text-slate-100"/>
                        </Dialog.DialogClose>
                        <form action="#" className="flex-1 flex flex-col">
                            <div className="flex flex-1 flex-col gap-3 p-5">
                                <span className='text-sm font-medium text-slate-300'>
                                    Adicionar nota
                                </span>
                                { shouldShowOnBoarding ? (

                                    <p className='text-sm leading-6 text-slate-400'>
                                    Comece <button type="button" onClick={ handleStartRecording } className="font-medium text-lime-400 hover:underline">gravando uma nota</button> em áudio ou se preferir <button type="button" onClick={ handleStartEditor } className="font-medium text-lime-400 hover:underline">utilize apenas texto</button>.
                                </p>

                                ) : (

                                    <textarea autoFocus value={content} onChange={ handleContentOnChanged } className="text-sm text-slate-400 bg-transparent resize-none flex-1 outline-none"></textarea>
                                )}
                            
                            </div>

                            { (isRecording) ? (
                                <button type="button" onClick={ handleStopRecording } className="w-full flex items-center justify-center gap-2 bg-slate-900 py-4 text-center text-sm text-slate-300 font-medium hover:text-slate-100">
                                    <div className="size-3 rounded-full bg-red-500 animate-pulse" />
                                   Gravando! (Clique para interromper)
                               </button>

                            ) : (
                                <button type="button" onClick={ handleSaveNote } className=" font-medium w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none hover:bg-lime-500">
                                    Salvar nota
                                </button>
                            )}

                         
                        </form>
                    </Dialog.Content>
                </Dialog.Overlay>
            </Dialog.Portal>

        </Dialog.Root>
    )
}