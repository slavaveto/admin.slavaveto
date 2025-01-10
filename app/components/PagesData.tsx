'use client';

import {useState, useEffect} from 'react';
import {createClient} from '@/app/assets/auth/utils/supabase/client';
import {Listbox, ListboxItem, Skeleton, Button} from '@nextui-org/react';

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

interface Translation {
    item_id: string;
    ru: string;
    uk: string;
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
                // Обновление состояния таблицы
                setContent((prevContent) => {
                    if (!prevContent) return prevContent;

                    return prevContent.map((row) =>
                        row.item_id === editingRow.item_id ? { ...row, ru, uk } : row
                    );
                });
            }, 500); // Задержка перед появлением тоста
        }
    };


    const handleCreate = async (item_id: string, ru: string, uk: string) => {
        setIsSaving(true); // Устанавливаем состояние загрузки

        if (!item_id || !selectedPage) {
            console.error('Missing required information for creating');
            setIsSaving(false);
            return;
        }

        const startTime = Date.now(); // Засекаем время начала создания
        //let createdData = null;
        let createdData: Translation[] | null = null;

        try {
            const supabase = createClient();

            const { data, error } = await supabase
                .from(selectedPage)
                .insert([{ item_id, ru, uk }]) // Вставляем новую запись
                .select('*'); // Убедимся, что возвращаются вставленные данные

            if (error) {
                console.error('Error creating data:', error.message);
                toast.error('Ошибка при создании данных.');
            } else {
                console.log('Created successfully:', data);
                createdData = data; // Сохраняем созданные данные для обновления таблицы

                const elapsedTime = Date.now() - startTime;
                const delay = Math.max(1500 - elapsedTime, 0); // Минимальная задержка в 500 мс

                // Добавляем задержку, если нужно
                if (delay > 0) {
                    await new Promise((resolve) => setTimeout(resolve, delay));
                }
            }
        } catch (err) {
            console.error('Unexpected error:', err);
            toast.error('Неожиданная ошибка при создании.');
        } finally {
            setIsSaving(false); // Сбрасываем состояние загрузки
            setIsModalOpen(false); // Закрываем модальное окно

            setTimeout(() => {
                // Обновляем состояние таблицы перед показом тоста
                if (createdData) {
                    setContent((prevContent) => {
                        const updatedContent = [...(createdData || []), ...(prevContent || [])];
                        console.log('Updated content:', updatedContent); // Для отладки
                        return updatedContent;
                    });
                }
                toast.success('Данные успешно созданы');
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
                <Button
                    color="primary"
                    onPress={() => {
                        setEditingRow({ ru: '', uk: '', item_id: '', page: selectedPage }); // Передаём пустую запись с текущей страницей
                        setIsModalOpen(true); // Открываем модальное окно
                    }}
                >
                    Add New Translation
                </Button>
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
                onCreate={handleCreate} // Передаем функцию создания
                initialValues={editingRow || { ru: '', uk: '', item_id: '', page: null }}
                isSaving={isSaving}
                mode={editingRow?.item_id ? 'edit' : 'create'}
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

