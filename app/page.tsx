import ConnectSupabaseSteps from "@/app/assets/auth/components/tutorial/connect-supabase-steps";
import { createClient } from "@/app/assets/auth/utils/supabase/server";
import { redirect } from "next/navigation";
import { hasEnvVars } from "@/app/assets/auth/utils/supabase/check-env-vars";


import Main from "@/app/components/Main";

export default async function Home() {
    if (hasEnvVars) {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return redirect("/sign-in");
        }

        return (
            <main className="flex flex-grow container mx-auto px-3 xl:max-w-screen-xl">

                    <Main />



            </main>
        );
    } else {
        return (
            <main className="flex flex-grow container mx-auto px-3 max-w-screen-lg">
                <ConnectSupabaseSteps />
            </main>
        );
    }
}