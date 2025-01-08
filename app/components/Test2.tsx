import { createClient } from '@/app/assets/auth/utils/supabase/server';
import { redirect } from 'next/navigation';
<<<<<<<< HEAD:app/admin/page.tsx
import EditableNotes from '../components/EditableNotes';
========
import EditableNotes from '@/app/components/EditableNotes';
>>>>>>>> 716de0f (доделал layout):app/components/Test2.tsx

export default async function Test2 () {
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
            {/*<EditableNotes notes={notes || []} />*/}
        </div>
    );
}