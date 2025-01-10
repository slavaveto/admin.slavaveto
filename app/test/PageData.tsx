'use client';

import {useState, useEffect} from 'react';
import {createClient} from '@/app/assets/auth/utils/supabase/client';
import {Listbox, ListboxItem, Skeleton} from '@nextui-org/react';

import {loadPages} from './LoadPages';
import EditableTable from './EditableTable';
import PageListbox from './PageListbox';

interface Page {
    page_key: string;
    order?: number;
    btn_type?: string;
}

export default function PagesData() {

    const [isPageContentLoading, setIsPageContentLoading] = useState(true);
    const {pages, selectedPage, isPagesLoading, handlePageSelection} = loadPages();
    const [content, setContent] = useState<{ ru: string; uk: string; item_id: string }[] | null>(null);

    useEffect(() => {
        if (!selectedPage || isPagesLoading) return;

        setIsPageContentLoading(true);
        const fetchPageContent = async () => {
            const startTime = Date.now();
            const supabase = createClient();
            const {data, error} = await supabase
                .from(selectedPage)
                .select('*');

            if (error) {
                //console.error(`Failed to fetch content for ${pageKey}:`, error.message);
                setContent([]);
            } else {
                setContent(data || []);
            }

            const elapsedTime = Date.now() - startTime;
            const delay = Math.max(1000 - elapsedTime, 0);
            setTimeout(() => setIsPageContentLoading(false), delay);
        };

        fetchPageContent();
    }, [selectedPage, isPagesLoading]);

    const handleEditClick = (row: { ru: string; uk: string; item_id: string }) => {
        // Логика для обработки редактирования (например, открыть модальное окно)
        console.log('Редактирование строки:', row);
    };

    return (
        <div className="flex w-full">
            <div className="min-w-[200px]">
                {isPagesLoading ? (
                    <SkeletonList/>
                ) : (
                    <PageListbox
                        pages={pages}
                        selectedPage={selectedPage}
                        onSelectPage={handlePageSelection}
                    />
                )}
            </div>

            <div className="flex-grow ml-5 -bg-blue-50 -p-2">
                {isPageContentLoading ? (
                    <SkeletonPageContent/>
                ) : (
                    <>
                        {content && content.length > 0 ? (
                            <EditableTable content={content} onEdit={handleEditClick} />
                        ) : (
                            <p>Нет данных для отображения</p>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

function SkeletonList() {
    return (
        <div className="w-full flex flex-col gap-1">
            <Skeleton className="h-[30px] w-12/12 rounded"/>
            <Skeleton className="h-[30px] w-10/12 rounded"/>
            <Skeleton className="h-[30px] w-11/12 rounded"/>
        </div>
    );
}

function SkeletonPageContent() {
    return (
        <Skeleton className="w-full h-[200px]  rounded -bg-blue-50"/>
    );
}

