'use client'; // only in App Router

import { CKEditor } from '@ckeditor/ckeditor5-react';
import BalloonEditor from '@ckeditor/ckeditor5-build-balloon';

import 'ckeditor5/ckeditor5.css';
import 'ckeditor5-premium-features/ckeditor5-premium-features.css';

interface CustomEditorProps {
    data: string; // Данные для редактора
    onChange: (data: string) => void; // Функция обратного вызова для изменений
}

const CustomEditor = ({ data, onChange }: CustomEditorProps) => {
    return (
        <CKEditor
            editor={BalloonEditor}
            data={data} // Задаём начальные данные через data
            config={{
                licenseKey: 'GPL',
                toolbar: ['undo', 'redo', '|', 'bold', 'italic'],
                removePlugins: ['CKEditorInspector', 'EasyImage'], // Убираем ненужные плагины
            }}
            onChange={(event, editor) => {
                const newData = editor.getData();
                onChange(newData); // Вызываем функцию обратного вызова при изменении данных
            }}
        />
    );
};

export default CustomEditor;