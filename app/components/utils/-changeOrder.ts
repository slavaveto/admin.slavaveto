import { createClient } from '@/app/assets/auth/utils/supabase/client';
import { toast } from 'react-hot-toast';

export const handleSaveOrder = async (
    updatedRows: { item_id: string; order: number }[],
    tableName: string
): Promise<void> => {
    //console.log("Rows to update:", updatedRows);
    const supabase = createClient();

    try {
        const updatePromises = updatedRows.map(({ item_id, order }) =>
            supabase
                .from(tableName) // Укажите имя вашей таблицы
                .update({ order }) // Обновляем поле order
                .eq("item_id", item_id) // Фильтруем по item_id
        );

        const results = await Promise.all(updatePromises);

        const hasErrors = results.some(({ error }) => error);
        if (hasErrors) {
            console.error("Some updates failed:", results);
            throw new Error("Failed to update some rows");
        }

        toast.success("Порядок успешно обновлён");
        console.log("Order updated successfully");
    } catch (error) {
        console.error("Failed to save order:", error);
    }
};

export const moveRowUp = (
    index: number,
    tableContent: { ru: string; uk: string; item_id: string; is_rich: boolean; order: number }[],
    setTableContent: React.Dispatch<
        React.SetStateAction<
            { ru: string; uk: string; item_id: string; is_rich: boolean; order: number }[]
        >
    >,
    handleSaveOrder: (updatedRows: { item_id: string; order: number }[]) => void
): void => {
    if (index === 0) return; // Нельзя поднять первый элемент выше

    const updatedContent = [...tableContent];
    // Меняем местами строки
    [updatedContent[index - 1], updatedContent[index]] = [updatedContent[index], updatedContent[index - 1]];

    // Обновляем порядок в `order`
    updatedContent.forEach((row, i) => (row.order = i + 1));
    setTableContent(updatedContent);

    // Создаём массив для сохранения
    const updatedOrder = updatedContent.map((row) => ({
        item_id: row.item_id, // Используем `item_id`
        order: row.order,
    }));

    handleSaveOrder(updatedOrder); // Сохраняем порядок
};