'use client';

import { useState } from 'react';
import { createClient } from '@/app/auth/utils/supabase/client'; // Импорт клиента

export default function EditableNotes({ notes }: { notes: any[] }) {
    return (
        <div>
            {notes.map((note) => (
                <EditableNote key={note.id} note={note} />
            ))}
        </div>
    );
}

function EditableNote({ note }: { note: any }) {
    const supabase = createClient(); // Инициализируем клиент
    const [title, setTitle] = useState(note.title || '');
    const [content, setContent] = useState(note.content || '');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        const { error } = await supabase
            .from('notes')
            .update({ title, content })
            .eq('id', note.id);

        if (error) {
            console.error('Failed to update note:', error.message);
        } else {
            alert('Note updated successfully');
        }
        setIsSaving(false);
    };

    return (
        <div className="border p-4 mb-4 rounded shadow-sm">
            <label className="block mb-2 font-semibold">Title</label>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border w-full p-2 mb-4 rounded"
            />
            <label className="block mb-2 font-semibold">Content</label>
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="border w-full p-2 mb-4 rounded"
                rows={4}
            />
            <button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
                {isSaving ? 'Saving...' : 'Save'}
            </button>
        </div>
    );
}