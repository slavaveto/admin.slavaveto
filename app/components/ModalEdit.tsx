'use client';

import dynamic from 'next/dynamic';
const CustomEditor = dynamic(() => import('./CkEditor'), { ssr: false });

import { RefreshCw } from 'lucide-react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, RadioGroup, Radio, Link } from '@nextui-org/react';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface EditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (ru: string, uk: string, item_id: string) => void;
    onCreate: (ru: string, uk: string, item_id: string) => void;
    isSaving: boolean;
    initialValues: { ru: string; uk: string; item_id: string; is_rich: boolean; page: string | null; };
    mode: 'edit' | 'create';
}

export default function ModalEdit({ isOpen, onClose, onSave, onCreate, isSaving, initialValues, mode }: EditModalProps) {
    const [ru, setRu] = useState(initialValues?.ru || '');
    const [uk, setUk] = useState(initialValues?.uk || '');
    const [itemId, setItemId] = useState(initialValues?.item_id || '');
    const [viewMode, setViewMode] = useState<'both' | 'ru-only' | 'uk-only'>('both');
    const [isSyncing, setIsSyncing] = useState(false);
    const [isDirty, setIsDirty] = useState(false);

    const checkIfDirty = (newRu: string, newUk: string, newItemId: string) => {
        const isChanged =
            newRu !== initialValues.ru ||
            newUk !== initialValues.uk ||
            newItemId !== initialValues.item_id;
        setIsDirty(isChanged);
    };

    const resetState = () => {
        setRu(initialValues.ru || '');
        setUk(initialValues.uk || '');
        setItemId(initialValues.item_id || '');
        setIsDirty(false);
    };

    useEffect(() => {
        if (!isOpen) {
            resetState(); // Сбрасываем состояние, когда модальное окно закрывается
        }
    }, [isOpen]);


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
            toast.error('Введите текст для перевода.');
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
            toast.success('Перевод успешно получен!');
        } catch (error) {
            console.error('Ошибка при синхронизации:', error);
            toast.error('Ошибка при синхронизации. Попробуйте снова.');
        } finally {
            setIsSyncing(false);
        }
    };

    const handleSave = () => {
        if (mode === 'create') {
            onCreate(itemId, ru, uk);
        } else {
            onSave(itemId, ru, uk);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            placement="top"
            size={
                initialValues.is_rich
                    ? viewMode === 'both'
                        ? '3xl'
                        : '4xl'
                    : 'xl'
            }
            isDismissable={false}
            isKeyboardDismissDisabled={true}
            onOpenChange={(isOpen) => !isOpen && onClose()}
        >
            <ModalContent>
                <>
                    <ModalHeader className="flex flex-row items-center justify-between pr-14">
                        {mode === 'create' ? 'Create New Translation' : `Edit Translation`}
                        {initialValues.is_rich && (
                            <RadioGroup
                                orientation="horizontal"
                                value={viewMode}
                                onChange={(e) => setViewMode(e.target.value as 'both' | 'ru-only' | 'uk-only')}
                                className="space-x-4"
                            >
                                <Radio value="both" />
                                <Radio value="ru-only" />
                                <Radio value="uk-only" />
                            </RadioGroup>
                        )}
                    </ModalHeader>
                    <ModalBody className="pb-4">
                        {viewMode === 'both' && (
                            <div className="mb-4">
                                <Input
                                    labelPlacement="outside"
                                    style={{ fontWeight: 'bold' }}
                                    classNames={{
                                        label: 'ml-[8px]',
                                    }}
                                    placeholder=" "
                                    isRequired
                                    variant="bordered"
                                    color="primary"
                                    type="text"
                                    label="ItemId"
                                    value={itemId}
                                    onChange={(e) => {
                                        setItemId(e.target.value); // Обновляем значение
                                        const newValue = e.target.value;
                                        setItemId(newValue);
                                        checkIfDirty(ru, uk, newValue);        // Проверяем, изменилось ли что-то
                                    }}
                                />
                            </div>
                        )}

                        {viewMode !== 'uk-only' && initialValues.is_rich && (
                            <div className={`mb-5 ${viewMode === 'ru-only' ? 'h-[450px]' : 'h-[132px]'}`}>
                                <p className="text-primary ml-[8px]">Ru</p>
                                <CustomEditor data={ru}
                                              onChange={(newData: string) => {
                                                  setRu(newData); // Обновляем состояние ru
                                                  checkIfDirty(newData, uk, itemId);// Проверяем, изменилось ли что-то
                                              }} />
                            </div>
                        )}

                        {viewMode !== 'ru-only' && initialValues.is_rich && (
                            <div className={`mb-5 ${viewMode === 'uk-only' ? 'h-[450px]' : 'h-[132px]'}`}>
                                <p className="text-primary ml-[8px]">Uk</p>
                                <CustomEditor data={uk}
                                              onChange={(newData: string) => {
                                                  setUk(newData); // Обновляем состояние uk
                                                  checkIfDirty(ru, newData, itemId); // Проверяем, изменилось ли что-то
                                              }} />
                            </div>
                        )}
                        {!initialValues.is_rich && (
                            <>
                                <div className="mt-4">
                                    <Input
                                        variant="bordered"
                                        color="primary"
                                        type="text"
                                        label="RU"
                                        value={ru}
                                        onChange={(e) => {
                                            setRu(e.target.value); // Обновляем значение
                                            const newValue = e.target.value;
                                            setItemId(newValue);
                                            checkIfDirty(ru, uk, newValue);       // Проверяем, изменилось ли что-то
                                        }}
                                    />
                                </div>
                                <div className="mt-4">
                                    <Input
                                        variant="bordered"
                                        color="primary"
                                        type="text"
                                        label="UA"
                                        value={uk}
                                        onChange={(e) => {
                                            setUk(e.target.value); // Обновляем значение
                                            const newValue = e.target.value;
                                            setItemId(newValue);
                                            checkIfDirty(ru, uk, newValue);    // Проверяем, изменилось ли что-то
                                        }}
                                    />
                                </div>
                            </>
                        )}
                    </ModalBody>
                    <ModalFooter className="m-0 pt-0 flex items-center justify-end">
                        {viewMode === 'both' && (
                            <Link
                                className={`mr-10 cursor-pointer text-default-500 hover:text-primary ${
                                    isSyncing ? 'animate-spin text-primary' : ''
                                }`}
                                onClick={handleSync}
                                isDisabled={isSyncing || isSaving}
                            >
                                <RefreshCw size={24} />
                            </Link>
                        )}
                        <Button color="danger" variant="light" onPress={onClose} isDisabled={isSaving || isSyncing}>
                            Cancel
                        </Button>
                        <Button color="primary" onPress={handleSave} isLoading={isSaving} isDisabled={!isDirty || isSyncing}>
                            {isSaving ? 'Saving...' : 'Save'}

                        </Button>
                    </ModalFooter>
                </>
            </ModalContent>
        </Modal>
    );
}