import React, { useRef, useState } from "react";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

type WysiwygProps = {
    fieldTitle?: string
    initialValue?: string
    updateValue: (value: string) => void
    hasError?: string | boolean
}

type QuillHistory = { undo: () => void; redo: () => void }

const modules = {
    toolbar: [
        [{ 'header': [1, 2, false] }],
        ['bold', 'italic', 'underline', 'color'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
        ['link', 'image', 'video']
    ],
    history: {
        delay: 500,
        maxStack: 100,
        userOnly: true
    }
}

const formats = [
    'header',
    'bold', 'italic', 'underline', 'color',
    'list', 'bullet', 'indent',
    'link', 'image', 'video'
]

const Wysiwyg = ({ fieldTitle, initialValue, updateValue, hasError }: WysiwygProps) => {
    const [value, setValue] = useState(initialValue || '');
    const quillRef = useRef<ReactQuill>(null)

    const getHistory = () =>
        quillRef.current?.getEditor().getModule('history') as QuillHistory | undefined

    const changeValue = (input: string) => {
        setValue(input)
        updateValue(input)
    }

    return (
        <div className={`relative border rounded-lg ${hasError ? 'border-red-500' : 'border-transparent'}`}>
            <span className={`block font-medium font-outfit mb-2 text-xs ${hasError ? 'text-red-500' : 'text-black'}`}>{fieldTitle}</span>
            <div className="absolute top-0 left-0">
                <button type="button" className="ql-undo mr-5" aria-label="Undo" onClick={() => getHistory()?.undo()}>
                    ↶
                </button>
                <button type="button" className="ql-redo" aria-label="Redo" onClick={() => getHistory()?.redo()}>
                    ↷
                </button>
            </div>
            <ReactQuill
                ref={quillRef}
                theme="snow"
                value={value}
                modules={modules}
                formats={formats}
                onChange={changeValue}
            />
        </div>
    );
}

export default Wysiwyg
