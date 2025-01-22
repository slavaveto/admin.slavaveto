'use client'; // only in App Router

import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
    ClassicEditor,
    InlineEditor,
    BalloonEditor,

    Essentials,
    Heading,

    Bold,
    Italic,
    Underline,
    Alignment,

    FontSize,
    FontBackgroundColor,
    FontColor,
    FontFamily,

    Link,

    Image,
    ImageBlock,
    ImageCaption,
    ImageInline,
    ImageInsertViaUrl,
    ImageResize,
    ImageStyle,
    ImageTextAlternative,
    ImageToolbar,
    ImageUpload,
    ImageInsert,
    SimpleUploadAdapter,

    List,
    ListProperties,

} from 'ckeditor5';

import 'ckeditor5/ckeditor5.css';
import 'ckeditor5-premium-features/ckeditor5-premium-features.css';
import React, { useState } from 'react';

const LICENSE_KEY =
    'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3Mzc4NDk1OTksImp0aSI6IjM2ZTg0ODAzLWRmYzUtNGJkYy04MzFjLTI2Y2IzOTY4ZjQyYiIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6ImUwNGJjZTRkIn0.0YnbXyXGoJigqYpCppDQSwJjhK2EgzbUVgpinviafWfICE4rXYpBgzx-OzViEgDeGRc-X8ergYAPjaFpuPyQnQ';

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
                editor={InlineEditor}
                //@ts-ignore
                data={data as any} // Задаём начальные данные через data
                config={{


                    licenseKey: LICENSE_KEY,
                    // initialData: 'Welcome to CKEditor 5!',
                    placeholder: 'Type or paste your content here!',

                    toolbar: {
                        items: ['bold', 'italic', 'underline', '|', 'fontSize', 'fontColor', 'fontBackgroundColor', '|', 'insertImage', 'link', '|', 'alignment', 'bulletedList'],
                        shouldNotGroupWhenFull: false
                    },



                    plugins: [
                        Essentials,
                        Heading,

                        Bold,
                        Italic,
                        Underline,
                        Alignment,

                        FontSize,
                        FontBackgroundColor,
                        FontColor,
                        FontFamily,

                        Link,

                        Image,
                        ImageBlock,
                        ImageCaption,
                        ImageInline,
                        ImageInsert,
                        ImageInsertViaUrl,
                        ImageResize,
                        ImageStyle,
                        ImageTextAlternative,
                        ImageToolbar,
                        ImageUpload,
                        SimpleUploadAdapter,

                        List,
                        ListProperties,
                    ],

                    simpleUpload: {
                        uploadUrl: '/api/upload',
                    },
                    image: {
                        toolbar: [
                            'imageStyle:wrapText',
                            'imageStyle:breakText',
                            '|',
                            'resizeImage',
                        ],
                        resizeOptions: [
                            {
                                name: 'resizeImage:25',
                                label: '25%',
                                value: '25',
                            },
                            {
                                name: 'resizeImage:50',
                                label: '50%',
                                value: '50',
                            },
                            {
                                name: 'resizeImage:75',
                                label: '75%',
                                value: '75',
                            },
                            {
                                name: 'resizeImage:original',
                                label: 'Original',
                                value: null,
                            },
                        ],
                        resizeUnit: '%',
                    },
                    fontSize: {
                        options: [12, 13, 14, 15, 'default', 17, 18, 19, 20],
                        supportAllValues: true
                    },
                    fontFamily: {
                        options: [
                            'default',
                            'Arial, Helvetica, sans-serif',
                            'Courier New, Courier, monospace',
                            'Georgia, serif',
                            'Lucida Sans Unicode, Lucida Grande, sans-serif',
                            'Tahoma, Geneva, sans-serif',
                            'Times New Roman, Times, serif',
                            'Trebuchet MS, Helvetica, sans-serif',
                            'Verdana, Geneva, sans-serif',
                        ],
                    },
                    list: {
                        properties: {
                            styles: true,
                            startIndex: true,
                            reversed: true
                        }
                    },

                    link: {
                        addTargetToExternalLinks: true,
                        defaultProtocol: 'https://',
                        decorators: {
                            toggleDownloadable: {
                                mode: 'manual',
                                label: 'Downloadable',
                                attributes: {
                                    download: 'file'
                                }
                            }
                        }
                    },
                }}

                onChange={(event, editor) => {
                    const newData = editor.getData();
                    onChange(newData); // Вызываем функцию обратного вызова при изменении данных
                }}

                onReady={(editor) => {
                    setIsEditorReady(true); // Устанавливаем флаг, что редактор готов



                    editor.model.schema.extend('imageBlock', {
                        allowAttributes: ['width'],
                    });

                    editor.conversion.for('editingDowncast').add((dispatcher) => {
                        dispatcher.on('insert:imageBlock', (evt, data, conversionApi) => {
                            const viewWriter = conversionApi.writer;
                            const viewFigure = conversionApi.mapper.toViewElement(data.item);

                            if (viewFigure && viewFigure.is('element', 'figure')) {
                                viewWriter.setStyle('width', '25%', viewFigure);
                                viewWriter.addClass('image_resized', viewFigure);
                                viewWriter.addClass('image-style-align-left', viewFigure);

                                editor.execute('resizeImage', { width: '25%' });

                                const imageStyleCommand = editor.commands.get('imageStyle');
                                if (imageStyleCommand) {
                                    imageStyleCommand.execute({ value: 'alignLeft' });
                                } else {
                                    console.error('Команда imageStyle не найдена.');
                                }
                            } else {
                                console.error('Figure not found or invalid');
                            }
                        });
                    });
                }}
            />
        </div>
    );
};

export default CustomEditor;
