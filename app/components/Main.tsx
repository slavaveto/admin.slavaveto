'use client';

import {useState, useEffect} from 'react';
import {createClient} from '@/app/assets/auth/utils/supabase/client';
import {Listbox, ListboxItem, Skeleton, Button} from '@nextui-org/react';

import {pageList} from './PageList';
import MainTable from './MainTable';
import PageListBox from './PageListBox';
import ModalEdit from './ModalEdit';
import ModalDelete from './ModalDelete';
import { toast } from 'react-hot-toast';
import {Trash, CirclePlus} from "lucide-react";
import {Link} from "@nextui-org/link";

import { useDeleteHandler } from './utils/deleteItem';

interface Translation {
    item_id: string; ru: string; uk: string; is_rich: boolean; order: number
}

export default function Main() {

    const [isPageContentLoading, setIsPageContentLoading] = useState(true);
    const {pages, selectedPage, isPagesLoading, handlePageSelection} = pageList();
    const [content, setContent] = useState<Translation[] | null>(null);
    const [isSaving, setIsSaving] = useState(false); // Состояние загрузки сохранения

    const {isDeleteModalOpen, setIsDeleteModalOpen, isDeleting, deletingRow, handleDeleteClick, handleConfirmDelete,
    } = useDeleteHandler({selectedPage, setContent,
    });



    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRow, setEditingRow] = useState<{
        ru: string;
        uk: string;
        item_id: string;
        page: string | null; // Добавляем поле для страницы
        is_rich?: boolean;
        order?: number; // Добавляем поле `order`
    } | null>(null);

    useEffect(() => {
        if (!selectedPage || isPagesLoading) return;

        setIsPageContentLoading(true);
        const fetchPageContent = async () => {
            const startTime = Date.now();
            const supabase = createClient();
            const {data, error} = await supabase
                .from(selectedPage)
                .select('item_id, ru, uk, is_rich, order')
                // .order('item_id', { ascending: false });
                .order("order", { ascending: true });

            if (error) {
                //console.error(`Failed to fetch content for ${pageKey}:`, error.message);
                setContent([]);
            } else {
                setContent(
                    data?.map((item) => ({
                        ...item,
                        order: item.order ?? 0, // Добавляем значение по умолчанию для `order`, если его нет
                    })) || []
                );

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
        //console.log('Редактирование строки:', row);
    };




    const handleSave = async (item_id: string, ru: string, uk: string) => {
        setIsSaving(true); // Устанавливаем состояние загрузки

        if (!editingRow?.item_id || !editingRow?.page) {
            console.error('Missing required information for saving');
            setIsSaving(false);
            return;
        }

        const startTime = Date.now(); // Засекаем время начала сохранения

        try {
            const supabase = createClient();

            // Сохраняем текущее значение order (ДОБАВЛЕНО)
            const currentOrder = editingRow.order ?? 0;

            // Если item_id изменился, удаляем старую запись и создаем новую
            if (editingRow.item_id !== item_id) {
                // Удаляем старую запись
                const { error: deleteError } = await supabase
                    .from(editingRow.page)
                    .delete()
                    .eq('item_id', editingRow.item_id);

                if (deleteError) {
                    console.error('Error deleting old item_id:', deleteError.message);
                    toast.error('Ошибка при удалении старой записи.');
                    setIsSaving(false);
                    return;
                }

                // Создаем новую запись с сохранением order (ИЗМЕНЕНО)
                const { data: newData, error: createError } = await supabase
                    .from(editingRow.page)
                    .insert([{ item_id, ru, uk, is_rich: editingRow.is_rich || false, order: currentOrder }]) // Добавлено сохранение order
                    .select('*');

                if (createError) {
                    console.error('Error creating new item_id:', createError.message);
                    toast.error('Ошибка при создании новой записи.');
                    setIsSaving(false);
                    return;
                }

                console.log('Created new record:', newData);
            } else {
                // Обновляем существующую запись
                const { error: updateError } = await supabase
                    .from(editingRow.page)
                    .update({ ru, uk }) // Обновляются только ru и uk
                    .eq('item_id', editingRow.item_id);

                if (updateError) {
                    console.error('Error updating data:', updateError.message);
                    toast.error('Ошибка при сохранении данных.');
                    setIsSaving(false);
                    return;
                }
            }

            const elapsedTime = Date.now() - startTime;
            const delay = Math.max(1500 - elapsedTime, 0); // Минимальная задержка в 500 мс

            // Добавляем задержку, если нужно
            if (delay > 0) {
                await new Promise((resolve) => setTimeout(resolve, delay));
            }

        } catch (err) {
            console.error('Unexpected error:', err);
            toast.error('Неожиданная ошибка при сохранении.');
        } finally {
            setIsSaving(false); // Сбрасываем состояние загрузки

            // setIsModalOpen(false); // Закрываем модальное окно

            setTimeout(() => {
                toast.success('Данные успешно обновлены');
                const currentOrder = editingRow.order ?? 0;

                // Обновляем состояние таблицы
                setContent((prevContent) => {
                    if (!prevContent) return prevContent;

                    // Если item_id изменился, заменяем запись полностью
                    if (editingRow.item_id !== item_id) {
                        // Создаем новый объект с сохраненным order (ИЗМЕНЕНО)
                        const newItem: Translation = {
                            item_id,
                            ru,
                            uk,
                            is_rich: editingRow.is_rich || false,
                            order: currentOrder, // Используем сохраненное значение order
                        };

                        return [
                            newItem, // Новый объект
                            ...prevContent.filter((row) => row.item_id !== editingRow.item_id), // Удаляем старую запись
                        ];
                    }

                    // Обновляем только существующую запись
                    return prevContent.map((row) =>
                        row.item_id === editingRow.item_id
                            ? { ...row, ru, uk } // Обновляем ru и uk, оставляем остальные поля
                            : row
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

            // Определяем текущий максимальный `order`
            const { data: maxOrderData, error: maxOrderError } = await supabase
                .from(selectedPage)
                .select('order')
                .order('order', { ascending: false })
                .limit(1);

            if (maxOrderError) {
                console.error('Error fetching max order:', maxOrderError.message);
                toast.error('Ошибка при получении максимального порядка.');
                setIsSaving(false);
                return;
            }

            const maxOrder = maxOrderData?.[0]?.order || 0; // Максимальное значение `order`, по умолчанию 0
            const newOrder = maxOrder + 1; // Новый порядок для записи

            const { data, error } = await supabase
                .from(selectedPage)
                //.insert([{ item_id, ru, uk }]) // Вставляем новую запись
                .insert([{ item_id: item_id, ru: ru, uk: uk , order: newOrder }])
                .select('*'); // Убедимся, что возвращаются вставленные данные
            console.log('Inserting data:', { item_id, ru, uk });

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
                        const updatedContent = [...(prevContent || []), ...(createdData || [])];
                        console.log('Updated content:', updatedContent); // Для отладки
                        return updatedContent.sort((a, b) => a.order - b.order); // Убедимся, что сортировка по `order` сохраняется
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

    const handleToggleRich = async (row: { item_id: string; is_rich: boolean }) => {

        if (!selectedPage) {
            console.error('Selected page is null or undefined.');
            return; // Выход из функции, если selectedPage не задан
        }

        const supabase = createClient();

        try {
            const { error } = await supabase
                .from(selectedPage) // Замените на вашу таблицу
                .update({ is_rich: !row.is_rich }) // Инвертируем значение
                .eq('item_id', row.item_id);

            if (error) {
                console.error('Error updating is_rich:', error.message);
                toast.error('Ошибка при обновлении is_rich.');
            } else {
                setContent((prevContent) =>
                    prevContent
                        ? prevContent.map((item) =>
                            item.item_id === row.item_id
                                ? { ...item, is_rich: !row.is_rich }
                                : item
                        )
                        : []
                );
                toast.success('is_rich обновлено.');
            }
        } catch (err) {
            console.error('Unexpected error:', err);
            toast.error('Неожиданная ошибка.');
        }
    };



    // @ts-ignore
    return (
        <div className="flex w-full flex-col">

            <div className="w-full flex justify-between items-center">
            <p className="text-xl font-medium my-4 pl-2">Pages Translations</p>


                {/*<CustomEditor />*/}


            <Link
                color="success"
                className="cursor-pointer mr-2"
                onPress={() => {
                    setEditingRow({ru: '', uk: '', item_id: '', page: selectedPage}); // Передаём пустую запись с текущей страницей
                    setIsModalOpen(true); // Открываем модальное окно
                }}
            >
                <CirclePlus size={27}/>
            </Link>

            </div>



            <div className="flex w-full">


                <div className="min-w-[150px]">

                    {isPagesLoading ? (
                        <SkeletonList/>
                    ) : (
                        <PageListBox
                            pages={pages}
                            selectedPage={selectedPage}
                            onSelectPage={handlePageSelection}
                            onRename={(pageKey) => console.log(`Rename page: ${pageKey}`)}
                            onCopy={(pageKey) => console.log(`Copy page: ${pageKey}`)}

                        />
                    )}
                </div>

                <div className="flex-grow ml-5 -bg-blue-50 -p-2">
                    {isPageContentLoading ? (
                        <SkeletonPageContent/>
                    ) : (
                        <>

                            {content && content.length > 0 ? (
                                <MainTable
                                    tableName={selectedPage ?? ''}
                                    content={content}
                                    onEdit={handleEditClick}
                                    onDelete={handleDeleteClick}
                                    onToggleRich={handleToggleRich}/>
                            ) : (
                                <p>Нет данных для отображения</p>
                            )}
                        </>
                    )}
                </div>
                <ModalEdit
                    isOpen={isModalOpen}
                    onClose={handleClose}
                    onSave={handleSave}
                    onCreate={handleCreate} // Передаем функцию создания
                    initialValues={{
                        ru: editingRow?.ru || '',
                        uk: editingRow?.uk || '',
                        item_id: editingRow?.item_id || '',
                        page: editingRow?.page || null,
                        is_rich: editingRow?.is_rich ?? false,
                        // order: editingRow?.order || 0,// Устанавливаем значение по умолчанию для is_rich
                    }}
                    isSaving={isSaving}
                    mode={editingRow?.item_id ? 'edit' : 'create'}
                />
                <ModalDelete
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={handleConfirmDelete}
                    itemId={deletingRow?.item_id}
                    isDeleting={isDeleting}
                />

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

