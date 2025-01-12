'use client';

import dynamic from 'next/dynamic';
const CustomEditor = dynamic(() => import( './CkEditor' ), {ssr: false});

import { RefreshCw } from 'lucide-react'; // Пример иконки из Lucide

import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    RadioGroup,
    Radio
} from '@nextui-org/react';
import {useState, useEffect} from 'react';

interface EditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (ru: string, uk: string, item_id: string) => void;
    onCreate: (ru: string, uk: string, item_id: string) => void;
    isSaving: boolean; // Новое состояние для загрузки
    initialValues: { ru: string; uk: string; item_id: string; is_rich: boolean; page: string | null; };
    mode: 'edit' | 'create'; // Новый проп для различения режима
}

export default function ModalEdit({isOpen, onClose, onSave, onCreate, isSaving, initialValues, mode}: EditModalProps) {
    const [ru, setRu] = useState(initialValues?.ru || '');
    const [uk, setUk] = useState(initialValues?.uk || '');
    const [itemId, setItemId] = useState(initialValues?.item_id || ''); // Для создания записи
    const [viewMode, setViewMode] = useState<'both' | 'ru-only' | 'uk-only'>('both');

    const [isSyncing, setIsSyncing] = useState(false); // Состояние для синхронизации


    const HtmlString = ({text}: { text: string }) => (
        <span dangerouslySetInnerHTML={{__html: text}}/>
    );

    const handleSave = () => {
        if (mode === 'create') {
            onCreate(itemId, ru, uk); // Используем функцию создания
        } else {
            onSave(itemId, ru, uk); // Используем функцию редактирования
        }
    };

    useEffect(() => {
        if (isOpen) {
            setRu(initialValues.ru || '');
            setUk(initialValues.uk || '');
            setItemId(initialValues.item_id || '');
            setViewMode('both');
        }
    }, [isOpen]);

    const handleSync = async () => {
        if (!ru.trim()) {
            alert('Введите текст для перевода.');
            return;
        }

        setIsSyncing(true);

        try {
            const response = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: ru }),
            });

            if (!response.ok) {
                throw new Error('Ошибка синхронизации. Проверьте подключение.');
            }

            const data = await response.json();
            setUk(data.reply || 'Нет ответа.');
        } catch (error) {
            console.error('Ошибка при синхронизации:', error);
            alert('Ошибка при синхронизации. Попробуйте снова.');
        } finally {
            setIsSyncing(false);
        }
    };

    return (
        <Modal isOpen={isOpen} placement="top"
               size={
                   initialValues.is_rich
                       ? viewMode === 'both'
                           ? '3xl' // Размер для обоих языков
                           : '4xl' // Более широкий размер для одного языка
                       : 'xl'
               }
               isDismissable={false}
               isKeyboardDismissDisabled={true}
               onOpenChange={(isOpen) => !isOpen && onClose()}>
            <ModalContent>
                <>

                    <ModalHeader className="flex flex-row items-center justify-between pr-14">
                        {mode === 'create' ? 'Create New Translation' : `Edit Translation`}

                        {/* Радиогруппа для переключения режимов */}
                        {initialValues.is_rich && (
                            <RadioGroup
                                orientation="horizontal"
                                value={viewMode}
                                onChange={(e) => setViewMode(e.target.value as 'both' | 'ru-only' | 'uk-only')}
                                className="space-x-4"
                            >
                                <Radio value="both"/>
                                <Radio value="ru-only"/>
                                <Radio value="uk-only"/>
                            </RadioGroup>
                        )}
                    </ModalHeader>
                    <ModalBody className="pb-4">
                        {viewMode === 'both' &&(
                            <div className="mb-4">
                                <Input
                                    labelPlacement="outside"
                                    // className="font-bold"
                                    style={{fontWeight: 'bold'}}
                                    classNames={{
                                        label: "ml-[8px]"
                                    }}
                                    placeholder=" "
                                    isRequired
                                    variant="bordered"
                                    color="primary"
                                    type="text"
                                    label="ItemId"
                                    value={itemId}
                                    onChange={(e) => setItemId(e.target.value)}
                                />
                            </div>
                        )}


                        {viewMode !== 'uk-only' && initialValues.is_rich && (
                                <div className={`mb-5 ${
                                    viewMode === 'ru-only' ? 'h-[450px]' : 'h-[132px]'
                                }`} // Динамическое изменение класса
                            >
                                    <p className="text-primary ml-[8px]">Ru</p>
                                    <CustomEditor
                                        data={ru} // Передаём данные RU в редактор
                                        onChange={(newData: string) => setRu(newData)} // Обновляем состояние RU
                                    />
                                </div>
                        )}

                            {viewMode !== 'ru-only' && initialValues.is_rich && (
                                <div className={`mb-5 ${
                                    viewMode === 'uk-only' ? 'h-[450px]' : 'h-[132px]'
                                }`} // Динамическое изменение класса
                                >
                                    <p className="text-primary ml-[8px]">Uk</p>
                                    <CustomEditor
                                        data={uk} // Передаём данные RU в редактор
                                        onChange={(newData: string) => setUk(newData)} // Обновляем состояние RU
                                    />
                                </div>
                            )}

                        {!initialValues.is_rich && (
                            <>
                            <div className="mt-4">
                                <Input
                                    variant="bordered"
                                    // labelPlacement="outside"
                                    classNames={{
                                        // label: "-ml-[8px]",
                                    }}
                                    // placeholder=" "
                                    color="primary"
                                    type="text"
                                    label="RU"
                                    value={ru}
                                    onChange={(e) => setRu(e.target.value)}
                                />
                            </div>

                                <div className="mt-4">
                                    <Input
                                        variant="bordered"
                                        // labelPlacement="outside"
                                        color="primary"
                                        // placeholder=" "
                                        classNames={{
                                            // label: "-ml-[8px]",
                                        }}
                                        type="text"
                                        label="UA"
                                        value={uk}
                                        onChange={(e) => setUk(e.target.value)}
                                    />
                                </div>
                            </>
                        )}

                    </ModalBody>
                    <ModalFooter className="m-0 pt-0 flex items-center justify-end">
                        {viewMode === 'both' &&  (
                        <RefreshCw
                            className="mr-10 cursor-pointer text-default-500 hover:text-primary"
                            onClick={handleSync}
                            size={24}
                        />
                            )}

                        <Button color="danger" variant="light" onPress={onClose} isDisabled={isSaving}>
                            Cancel
                        </Button>
                        <Button color="primary" onPress={handleSave} isLoading={isSaving}>
                            {isSaving ? 'Saving...' : 'Save'}
                        </Button>
                    </ModalFooter>
                </>
            </ModalContent>
        </Modal>
);
}