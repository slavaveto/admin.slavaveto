import Hero from "@/app/auth/components/hero";
import ConnectSupabaseSteps from "@/app/auth/components/tutorial/connect-supabase-steps";
import SignUpUserSteps from "@/app/auth/components/tutorial/sign-up-user-steps";
import { hasEnvVars } from "@/app/auth/utils/supabase/check-env-vars";

export default async function Home() {
  return (
    <>
      <main className="flex-1 flex flex-col gap-6 px-4">
        <h2 className="font-medium text-xl mb-4">Next steps</h2>
        {hasEnvVars ? <SignUpUserSteps /> : <ConnectSupabaseSteps />}
      </main>
    </>
  );
}
