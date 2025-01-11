import { useState, useEffect, useRef, useMemo } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
    BalloonEditor,
    AutoImage,
    AutoLink,
    Autosave,
    Bold,
    CloudServices,
    Essentials,
    ImageBlock,
    ImageInsertViaUrl,
    ImageStyle,
    ImageToolbar,
    ImageUpload,
    Italic,
    Link,
    Paragraph
} from 'ckeditor5';

import 'ckeditor5/ckeditor5.css';

import './App.css';

const LICENSE_KEY =
    'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3Mzc4NDk1OTksImp0aSI6IjM2ZTg0ODAzLWRmYzUtNGJkYy04MzFjLTI2Y2IzOTY4ZjQyYiIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6ImUwNGJjZTRkIn0.0YnbXyXGoJigqYpCppDQSwJjhK2EgzbUVgpinviafWfICE4rXYpBgzx-OzViEgDeGRc-X8ergYAPjaFpuPyQnQ';

export default function myeditor () {
    const editorContainerRef = useRef(null);
    const editorRef = useRef(null);
    const [isLayoutReady, setIsLayoutReady] = useState(false);

    useEffect(() => {
        setIsLayoutReady(true);

        return () => setIsLayoutReady(false);
    }, []);

    const { editorConfig } = useMemo(() => {
        if (!isLayoutReady) {
            return {};
        }

        return {
            editorConfig: {
                toolbar: {
                    items: ['bold', 'italic', '|', 'link'],
                    shouldNotGroupWhenFull: false
                },
                plugins: [
                    AutoImage,
                    AutoLink,
                    Autosave,
                    Bold,
                    CloudServices,
                    Essentials,
                    ImageBlock,
                    ImageInsertViaUrl,
                    ImageStyle,
                    ImageToolbar,
                    ImageUpload,
                    Italic,
                    Link,
                    Paragraph
                ],
                image: {
                    toolbar: ['imageTextAlternative', '|', 'imageStyle:alignBlockLeft', 'imageStyle:block', 'imageStyle:alignBlockRight'],
                    styles: {
                        options: ['alignBlockLeft', 'block', 'alignBlockRight']
                    }
                },
                initialData:
                    '<h2>Congratulations on setting up CKEditor 5! 🎉</h2>\n<p>\n\tYou\'ve successfully created a CKEditor 5 project. This powerful text editor\n\twill enhance your application, enabling rich text editing capabilities that\n\tare customizable and easy to use.\n</p>\n<h3>What\'s next?</h3>\n<ol>\n\t<li>\n\t\t<strong>Integrate into your app</strong>: time to bring the editing into\n\t\tyour application. Take the code you created and add to your application.\n\t</li>\n\t<li>\n\t\t<strong>Explore features:</strong> Experiment with different plugins and\n\t\ttoolbar options to discover what works best for your needs.\n\t</li>\n\t<li>\n\t\t<strong>Customize your editor:</strong> Tailor the editor\'s\n\t\tconfiguration to match your application\'s style and requirements. Or\n\t\teven write your plugin!\n\t</li>\n</ol>\n<p>\n\tKeep experimenting, and don\'t hesitate to push the boundaries of what you\n\tcan achieve with CKEditor 5. Your feedback is invaluable to us as we strive\n\tto improve and evolve. Happy editing!\n</p>\n<h3>Helpful resources</h3>\n<ul>\n\t<li>📝 <a href="https://portal.ckeditor.com/checkout?plan=free">Trial sign up</a>,</li>\n\t<li>📕 <a href="https://ckeditor.com/docs/ckeditor5/latest/installation/index.html">Documentation</a>,</li>\n\t<li>⭐️ <a href="https://github.com/ckeditor/ckeditor5">GitHub</a> (star us if you can!),</li>\n\t<li>🏠 <a href="https://ckeditor.com">CKEditor Homepage</a>,</li>\n\t<li>🧑‍💻 <a href="https://ckeditor.com/ckeditor-5/demo/">CKEditor 5 Demos</a>,</li>\n</ul>\n<h3>Need help?</h3>\n<p>\n\tSee this text, but the editor is not starting up? Check the browser\'s\n\tconsole for clues and guidance. It may be related to an incorrect license\n\tkey if you use premium features or another feature-related requirement. If\n\tyou cannot make it work, file a GitHub issue, and we will help as soon as\n\tpossible!\n</p>\n',
                licenseKey: LICENSE_KEY,
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
                placeholder: 'Type or paste your content here!'
            }
        };
    }, [isLayoutReady]);

    return (
        <div className="main-container">
            <div className="editor-container editor-container_balloon-editor" ref={editorContainerRef}>
                <div className="editor-container__editor">
                    <div ref={editorRef}>{editorConfig && <CKEditor editor={BalloonEditor} config={editorConfig} />}</div>
                </div>
            </div>
        </div>
    );
}
