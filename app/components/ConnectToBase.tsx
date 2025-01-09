import { createClient } from '@/app/assets/auth/utils/supabase/server';
import { redirect } from 'next/navigation';

import PagesData from '../components/PagesData';


export default async function ConnectToBase () {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect('/sign-in');
    }

    return (
        <div className="flex w-full flex-col">
            <h1 className="text-xl font-bold my-4 pl-2">Edit Notes</h1>
            <PagesData />
        </div>
    );
}