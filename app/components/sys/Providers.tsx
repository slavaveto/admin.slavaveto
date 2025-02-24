'use client';

import {NextUIProvider} from '@nextui-org/react'
import {ThemeProvider} from '@/app/components/sys/ThemeProvider';


export function Providers ({children}: { children: React.ReactNode }) {
    //const pathname = usePathname();

    return (
            <NextUIProvider>
                <ThemeProvider>
                    {children}
                </ThemeProvider>
            </NextUIProvider>
    )
}