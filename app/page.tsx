import ConnectSupabaseSteps from "@/app/assets/auth/components/tutorial/connect-supabase-steps";
import Test2 from "@/app/components/Test2";

import {Button} from "@nextui-org/button";

import {hasEnvVars} from "@/app/assets/auth/utils/supabase/check-env-vars";
import {EnvVarWarning} from "@/app/assets/auth/components/env-var-warning";
import HeaderAuth from "@/app/assets/auth/components/header-auth";

export default async function Home() {
    return (
        <>



            <div className="flex flex-col min-h-svh">

                <header className="backdrop-blur-xl py-[10px] bg-blue-50"
                        style={{position: 'sticky', top: 0, zIndex: 50,}}
                >

                    <div className="container flex mx-auto px-3 justify-end -max-w-xl">

                        {!hasEnvVars ? <EnvVarWarning/> : <HeaderAuth/>}
                    </div>

                </header>
                <main className="flex flex-grow container mx-auto px-3 ">
                    <Button color="primary">Button</Button>

                    {hasEnvVars ? <Test2/> : <ConnectSupabaseSteps/>}

                </main>
                <footer className="footer_bg flex h-[50px] items-center bg-blue-50">
                    <div className="container flex mx-auto px-3 -justify-between justify-end items-center">
                        {/*<ThemeSwitcher/>*/}
                    </div>
                </footer>

            </div>

                </>
                );
                }
