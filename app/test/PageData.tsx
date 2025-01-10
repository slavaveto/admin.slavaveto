'use client';

import {useState, useEffect} from 'react';
import {createClient} from '@/app/assets/auth/utils/supabase/client';
import {Listbox, ListboxItem, Skeleton} from '@nextui-org/react';

import {loadPages} from './LoadPages';
import EditableTable from './EditableTable';
import PageListbox from './PageListbox';
import EditModal from './EditModal';
import { toast } from 'react-hot-toast';






interface Page {
    page_key: string;
    order?: number;
    btn_type?: string;
}

export default function PagesData() {

    const [isPageContentLoading, setIsPageContentLoading] = useState(true);
    const {pages, selectedPage, isPagesLoading, handlePageSelection} = loadPages();
    const [content, setContent] = useState<{ ru: string; uk: string; item_id: string }[] | null>(null);

    const [isSaving, setIsSaving] = useState(false); // Состояние загрузки сохранения

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRow, setEditingRow] = useState<{
        ru: string;
        uk: string;
        item_id: string;
        page: string | null; // Добавляем поле для страницы
    } | null>(null);

    useEffect(() => {
        if (!selectedPage || isPagesLoading) return;

        setIsPageContentLoading(true);
        const fetchPageContent = async () => {
            const startTime = Date.now();
            const supabase = createClient();
            const {data, error} = await supabase
                .from(selectedPage)
                .select('*')
        .order('item_id', { ascending: false });

            if (error) {
                //console.error(`Failed to fetch content for ${pageKey}:`, error.message);
                setContent([]);
            } else {
                setContent(data || []);
            }

            const elapsedTime = Date.now() - startTime;
            const delay = Math.max(600 - elapsedTime, 0);
            setTimeout(() => setIsPageContentLoading(false), delay);
        };

        fetchPageContent();
    }, [selectedPage, isPagesLoading]);

    const handleEditClick = (row: { ru: string; uk: string; item_id: string }) => {
        // Логика для обработки редактирования (например, открыть модальное окно)
        const pageInfo = { ...row, page: selectedPage }; // Добавляем информацию о текущей странице
        setEditingRow(pageInfo); // Обновляем редактируемую строку с учетом страницы

        //setEditingRow(row);
        setIsModalOpen(true);
        console.log('Редактирование строки:', row);
    };

    const handleSave = async (ru: string, uk: string) => {
        setIsSaving(true); // Устанавливаем состояние загрузки

        if (!editingRow?.item_id || !editingRow?.page) {
            console.error('Missing required information for saving');
            setIsSaving(false);
            return;
        }

        const startTime = Date.now(); // Засекаем время начала сохранения

        try {
            const supabase = createClient();

            const { data, error } = await supabase
                .from(editingRow.page)
                .update({ ru, uk })
                .eq('item_id', editingRow.item_id);

            if (error) {
                console.error('Error updating data:', error.message);
                toast.error('Ошибка при сохранении данных.');
            } else {
                console.log('Updated successfully:', data);

                // Обновление состояния таблицы
                setContent((prevContent) => {
                    if (!prevContent) return prevContent;

                    return prevContent.map((row) =>
                        row.item_id === editingRow.item_id ? { ...row, ru, uk } : row
                    );
                });

                const elapsedTime = Date.now() - startTime;
                const delay = Math.max(1500 - elapsedTime, 0); // Минимальная задержка в 500 мс

                // Добавляем задержку, если нужно
                if (delay > 0) {
                    await new Promise((resolve) => setTimeout(resolve, delay));
                }

                //toast.success('Данные успешно обновлены');
            }
        } catch (err) {
            console.error('Unexpected error:', err);
            toast.error('Неожиданная ошибка при сохранении.');
        } finally {
            setIsSaving(false); // Сбрасываем состояние загрузки
            setIsModalOpen(false); // Закрываем модальное окно

            setTimeout(() => {
                toast.success('Данные успешно обновлены');
            }, 500); // Задержка перед появлением тоста
        }
    };



    const handleClose = () => {
        setIsModalOpen(false);
        setEditingRow(null);
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
            <EditModal
                isOpen={isModalOpen}
                onClose={handleClose}
                onSave={handleSave}
                initialValues={editingRow || { ru: '', uk: '', item_id: '', page: null }}
                isSaving={isSaving}
            />
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

