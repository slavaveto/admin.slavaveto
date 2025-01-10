
import ConnectSupabaseSteps from "@/app/assets/auth/components/tutorial/connect-supabase-steps";
import ConnectToBase from "@/app/components/ConnectToBase";
import {Modal, ModalBody, Spinner} from "@nextui-org/react";
import {Button} from "@nextui-org/button";
import {Link} from "@nextui-org/react";

import ThemeToggle from "@/app/components/ThemeToggle";

import {hasEnvVars} from "@/app/assets/auth/utils/supabase/check-env-vars";
import {EnvVarWarning} from "@/app/assets/auth/components/env-var-warning";
import HeaderAuth from "@/app/assets/auth/components/header-auth";


export default async function Home() {



    return (
        <>
            <div className="flex flex-col min-h-svh">

                <header className=" footer_bg backdrop-blur-xl py-[10px]"
                        style={{position: 'sticky', top: 0, zIndex: 50,}}
                >

                    <div className="container flex mx-auto px-3 justify-end max-w-screen-lg">

                        {!hasEnvVars ? <EnvVarWarning/> : <HeaderAuth/>}
                    </div>

                </header>
                <main className="flex flex-grow container mx-auto px-3 max-w-screen-lg">

                    {hasEnvVars ? <ConnectToBase/> : <ConnectSupabaseSteps/>}

                </main>
                <footer className="footer_bg flex h-[50px] items-center ">
                    <div className="container flex mx-auto px-3 -justify-between justify-end items-center max-w-screen-lg">
                        <ThemeToggle/>
                    </div>
                </footer>

            </div>

        </>
    );
}
