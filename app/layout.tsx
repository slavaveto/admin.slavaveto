import { Montserrat } from 'next/font/google';
import "./globals.css";
import { Providers } from "@/app/components/Providers";
import { themeScript } from "@/app/assets/themeScript";


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

      {children}

    </Providers>


    </body>
    </html>
  );
}
