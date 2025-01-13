
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { createClient } from '@/app/assets/auth/utils/supabase/client';

interface UseDeleteHandlerProps {
    selectedPage: string | null;
    setContent: React.Dispatch<React.SetStateAction<any[] | null>>;
}

export const useDeleteHandler = ({ selectedPage, setContent }: UseDeleteHandlerProps) => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deletingRow, setDeletingRow] = useState<{
        item_id: string;
        ru: string;
        uk: string;
    } | null>(null);

    const handleDeleteClick = (row: { item_id: string; ru: string; uk: string }) => {
        setDeletingRow(row);
        setIsDeleteModalOpen(true); // Открываем модальное окно
    };

    const handleConfirmDelete = async () => {
        if (!deletingRow?.item_id || !selectedPage) return;

        setIsDeleting(true); // Устанавливаем состояние загрузки
        const startTime = Date.now(); // Засекаем время начала удаления

        try {
            const supabase = createClient();

            const { error } = await supabase
                .from(selectedPage)
                .delete()
                .eq('item_id', deletingRow.item_id);

            if (error) {
                console.error('Error deleting data:', error.message);
                toast.error('Ошибка при удалении записи.');
            } else {
                const elapsedTime = Date.now() - startTime;
                const delay = Math.max(1000 - elapsedTime, 0); // Минимальная задержка в 1 сек

                if (delay > 0) {
                    await new Promise((resolve) => setTimeout(resolve, delay));
                }
            }
        } catch (err) {
            console.error('Unexpected error:', err);
            toast.error('Неожиданная ошибка при удалении.');
        } finally {
            setIsDeleting(false); // Сбрасываем состояние загрузки
            setIsDeleteModalOpen(false); // Закрываем модальное окно

            setTimeout(() => {
                toast.success('Запись успешно удалена.');
                // Обновление состояния таблицы
                setContent((prevContent) =>
                    prevContent ? prevContent.filter((row) => row.item_id !== deletingRow.item_id) : []
                );
            }, 500); // Задержка перед появлением тоста
        }
    };

    return {
        isDeleteModalOpen,
        setIsDeleteModalOpen,
        isDeleting,
        deletingRow,
        handleDeleteClick,
        handleConfirmDelete,
    };
};