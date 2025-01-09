'use client';

import { Tabs, Tab } from '@nextui-org/react';
import { LightThemeIcon, DarkThemeIcon, AutoThemeIcon } from '@/app/assets/svgIcons';
import React from 'react';
import { useTheme } from '@/app/components/ThemeProvider';

const ThemeToggle: React.FC = () => {
    const { theme, setTheme } = useTheme();

    return (
        <Tabs
            aria-label="Выбор темы"
            color="default"
            size="sm"
            selectedKey={theme}
            onSelectionChange={(key) => setTheme(key as 'light' | 'dark' | 'system')}
            classNames={{
                tabList: "gap-[4px] p-[0px] ",
                tab: "h-[34px] md:h-[30px] px-[10px] md:px-[8px]",
                tabContent: " group-data-[selected=true]:text-primary-400",
            }}
        >
            <Tab
                key="light"
                title={
                    <div className="flex items-center">
                        <LightThemeIcon />
                    </div>
                }
            />
            <Tab
                key="system"
                title={
                    <div className="flex items-center">
                        <AutoThemeIcon />
                    </div>
                }
            />
            <Tab
                key="dark"
                title={
                    <div className="flex items-center">
                        <DarkThemeIcon />
                    </div>
                }
            />
        </Tabs>
    );
};


export default ThemeToggle;
