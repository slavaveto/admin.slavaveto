import { signOutAction } from "@/app/actions";
import { hasEnvVars } from "@/app/assets/auth/utils/supabase/check-env-vars";
import Link from "next/link";
import { Badge } from "./ui/badge";
// import { Button } from "./ui/button";
import {Button, ButtonGroup} from "@nextui-org/button";

import { createClient } from "@/app/assets/auth/utils/supabase/server";

export default async function AuthButton() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!hasEnvVars) {
    return (
      <>
        <div className="flex gap-4 items-center">
          <div>
            <Badge
              variant={"default"}
              className="font-normal pointer-events-none"
            >
              Please update .env.local file with anon key and url
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              disabled
              className="opacity-75 cursor-none pointer-events-none"
            >
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button
              size="sm"
              disabled
              className="opacity-75 cursor-none pointer-events-none"
            >
              <Link href="/sign-up">Sign up</Link>
            </Button>
          </div>
        </div>
      </>
    );
  }
  return user ? (
    <div className="flex items-center gap-4">
      {/*Hey, {user.email}!*/}
      <form action={signOutAction}>
        <Button type="submit" color="default" variant={"faded"}>
          Sign out
        </Button>
      </form>
    </div>
  ) : (
    <div className="flex gap-2">
      <Button color="primary" >
        <Link href="/sign-in">Sign in</Link>
      </Button>
      {/*<Button asChild size="sm" variant={"default"}>*/}
      {/*  <Link href="/sign-up">Sign up</Link>*/}
      {/*</Button>*/}
    </div>
  );
}
