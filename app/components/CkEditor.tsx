'use client'; // only in App Router

import { CKEditor } from '@ckeditor/ckeditor5-react';
import BalloonEditor from '@ckeditor/ckeditor5-build-balloon';
import React, { useState } from 'react';

import 'ckeditor5/ckeditor5.css';
import 'ckeditor5-premium-features/ckeditor5-premium-features.css';

interface CustomEditorProps {
    data: string; // Данные для редактора
    onChange: (data: string) => void; // Функция обратного вызова для изменений
}

const CustomEditor = ({ data, onChange }: CustomEditorProps) => {
    const [isEditorReady, setIsEditorReady] = useState(false);

    return (
        <div
            style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            className={`editor-wrapper ${isEditorReady ? 'editor-ready' : 'editor-loading'}`}
        >
            <CKEditor
                editor={BalloonEditor}
                //@ts-ignore
                data={data as any}// Задаём начальные данные через data
                config={{
                    licenseKey: 'GPL',
                    toolbar: ['undo', 'redo', '|', 'bold', 'italic'],
                    removePlugins: ['CKEditorInspector', 'EasyImage'], // Убираем ненужные плагины
                    //initialData:{data}
                }}
                onChange={(event, editor) => {
                    const newData = editor.getData();
                    onChange(newData); // Вызываем функцию обратного вызова при изменении данных
                }}
                onReady={(editor) => {
                    //console.log('Editor is ready', editor);
                    setIsEditorReady(true); // Устанавливаем флаг, что редактор готов
                }}
            />
        </div>
            );
            };

            export default CustomEditor;