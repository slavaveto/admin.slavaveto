import { createClient } from '@/app/auth/utils/supabase/server';
import { redirect } from 'next/navigation';
import EditableNotes from './EditableNotes';

export default async function Page() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect('/sign-in');
    }

    // Загружаем данные с сервера
    const { data: notes } = await supabase.from('notes').select();

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Edit Notes</h1>
            <EditableNotes notes={notes || []} />
        </div>
    );
}