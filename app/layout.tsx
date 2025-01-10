import { Montserrat } from 'next/font/google';
import "./globals.css";
import { Providers } from "@/app/components/sys/Providers";
import { themeScript } from "@/app/assets/themeScript";
import {hasEnvVars} from "@/app/assets/auth/utils/supabase/check-env-vars";
import {EnvVarWarning} from "@/app/assets/auth/components/env-var-warning";
import HeaderAuth from "@/app/assets/auth/components/header-auth";
import ThemeToggle from "@/app/components/sys/ThemeToggle";



const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
  icons: {
    icon: "/favicon.ico"
  },
};

const montserrat = Montserrat({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={montserrat.className} suppressHydrationWarning>
    <head>
      <script
          dangerouslySetInnerHTML={{
            __html: themeScript,
          }}
      />


    </head>
    <body className="">


    <Providers>
      <div className="flex flex-col min-h-svh">
        <header className=" footer_bg backdrop-blur-xl py-[10px]"
                style={{position: 'sticky', top: 0, zIndex: 50,}}
        >

          <div className="container flex mx-auto px-3 justify-end max-w-screen-lg">

            {!hasEnvVars ? <EnvVarWarning/> : <HeaderAuth/>}
          </div>

        </header>
        {children}

        <footer className="footer_bg flex h-[50px] items-center ">
          <div className="container flex mx-auto px-3 -justify-between justify-end items-center max-w-screen-lg">
            <ThemeToggle/>
          </div>
        </footer>

      </div>
    </Providers>


    </body>
    </html>
  );
}
