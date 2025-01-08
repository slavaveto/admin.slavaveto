import Hero from "@/app/assets/auth/components/hero";
import ConnectSupabaseSteps from "@/app/assets/auth/components/tutorial/connect-supabase-steps";
import Test2 from "@/app/components/Test2";
import { hasEnvVars } from "@/app/assets/auth/utils/supabase/check-env-vars";

export default async function Home() {
  return (
    <>
      <main className="flex-1 flex flex-col gap-6 px-4">
        {hasEnvVars ? <Test2 /> : <ConnectSupabaseSteps />}
      </main>
    </>
  );
}
