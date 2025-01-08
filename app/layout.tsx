import DeployButton from "@/app/assets/auth/components/deploy-button";
import { EnvVarWarning } from "@/app/assets/auth/components/env-var-warning";
import HeaderAuth from "@/app/assets/auth/components/header-auth";
import { ThemeSwitcher } from "@/app/assets/auth/components/theme-switcher";
import { hasEnvVars } from "@/app/assets/auth/utils/supabase/check-env-vars";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground flex flex-col min-h-svh">
      <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange>

          <header className="backdrop-blur-xl py-[10px] bg-blue-50"
                  style={{position: 'sticky', top: 0, zIndex: 50,}}
          >

              <div className="container flex mx-auto px-3 justify-end -max-w-xl">


                  {!hasEnvVars ? <EnvVarWarning/> : <HeaderAuth/>}
              </div>

          </header>

                  {children}

          <footer className="footer_bg flex  items-center bg-blue-50">
              <div className="container flex mx-auto px-3 -justify-between justify-end items-center">
                  <ThemeSwitcher/>
              </div>
          </footer>


      </ThemeProvider>
      </body>
    </html>
  );
}
