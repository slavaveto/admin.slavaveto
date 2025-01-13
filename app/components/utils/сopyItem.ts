import { createClient } from '@/app/assets/auth/utils/supabase/client';
import { toast } from 'react-hot-toast';

interface copyItemProps {
    tableName: string; // Название таблицы в базе данных
    tableContent: { ru: string; uk: string; item_id: string; is_rich: boolean; order: number }[];
    setTableContent: React.Dispatch<
        React.SetStateAction<
            { ru: string; uk: string; item_id: string; is_rich: boolean; order: number }[]
        >
    >;
    handleSaveOrder: (updatedRows: { item_id: string; order: number }[], tableName: string) => Promise<void>;
}

const copyItem = ({
                            tableName,
                            tableContent,
                            setTableContent,
                            handleSaveOrder,
                        }: copyItemProps) => {
    const handleCopyRow = async (index: number) => {
        const copiedRow = { ...tableContent[index] };
        const newOrder = copiedRow.order + 1;



        // Функция для генерации уникального item_id
        const generateUniqueItemId = (baseId: string): string => {
            let newId = `${baseId}-copy`;
            let counter = 1;

            // Проверяем уникальность идентификатора
            while (tableContent.some((row) => row.item_id === newId)) {
                newId = `${baseId}-copy-${counter}`;
                counter++;
            }

            return newId;
        };

        const newItemId = generateUniqueItemId(copiedRow.item_id);

        const newRow = {
            ...copiedRow,
            item_id: newItemId,
            order: newOrder,
        };

        // Добавляем новую запись в таблицу и обновляем `order` последующих строк
        const updatedContent = [
            ...tableContent.slice(0, index + 1),
            newRow,
            ...tableContent.slice(index + 1).map((row) => ({
                ...row,
                order: row.order + 1,
            })),
        ];

        setTableContent(updatedContent);

        // Сохраняем изменения в порядке
        const updatedOrder = updatedContent.map((row) => ({
            item_id: row.item_id,
            order: row.order,
        }));

        try {
            const supabase = createClient();

            // Вставляем новую запись
            const { error } = await supabase
                .from(tableName)
                .insert([{ item_id: newItemId, ru: copiedRow.ru, uk: copiedRow.uk, is_rich: copiedRow.is_rich, order: newOrder }]);

            if (error) {
                console.error('Ошибка при добавлении новой записи:', error.message);
                toast.error('Ошибка при копировании записи.');
                return;
            }

            // Обновляем порядок в базе данных
            await handleSaveOrder(updatedOrder, tableName);



            toast.success('Запись успешно скопирована!');
        } catch (err) {
            console.error('Ошибка при копировании записи:', err);
            toast.error('Ошибка при копировании записи.');
        }
    };

    return {
        handleCopyRow,
    };
};

export default copyItem;