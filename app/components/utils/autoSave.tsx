import {FC, useEffect, useState } from 'react';
import { Spinner } from '@nextui-org/react';
import { CheckCircle } from 'lucide-react';

interface AutoSaveProps {
    isOpen: boolean;
    isDirty: boolean;
    handleSave: () => Promise<void> | void;
}

const AutoSave: FC<AutoSaveProps> = ({ isOpen, isDirty, handleSave }) => {
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>(isDirty ? 'idle' : 'saved');

    useEffect(() => {
        // Сбрасываем статус на 'idle', если текст изменился
        if (isDirty && saveStatus !== 'idle') {
            setSaveStatus('idle');
        }
    }, [isDirty, saveStatus]);

    useEffect(() => {
        let autoSaveInterval: NodeJS.Timeout;

        if (isOpen) {
            autoSaveInterval = setInterval(async () => {
                if (isDirty) {
                    setSaveStatus('saving'); // Показываем спиннер
                    try {
                        await handleSave(); // Ждём завершения сохранения
                        setSaveStatus('saved'); // Успешно сохранено
                        setTimeout(() => setSaveStatus('idle'), 2000); // Возврат к "idle" через 2 секунды
                    } catch (error) {
                        console.error('Ошибка автосохранения:', error);
                        setSaveStatus('idle'); // Возврат к "idle" при ошибке
                    }
                }
            }, 1 * 60 * 1000); // Интервал 5 минут
        }

        return () => {
            clearInterval(autoSaveInterval); // Очистка таймера при закрытии модального окна
        };
    }, [isOpen, isDirty, handleSave]);

    return (
        <div className="save-indicator">
            {saveStatus === 'saving' && <Spinner size="lg" className="text-primary" />}
            {saveStatus === 'saved' && <CheckCircle size={24} className="text-green-500" />}
            {saveStatus === 'idle' && isDirty && <CheckCircle size={24} className="text-gray-500" />}
        </div>
    );
}

export default AutoSave;