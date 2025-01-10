'use client';

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from '@nextui-org/react';
import { useState, useEffect } from 'react';

interface EditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (ru: string, uk: string) => void;
    onCreate: (ru: string, uk: string, item_id: string) => void;
    isSaving: boolean; // Новое состояние для загрузки
    initialValues: { ru: string; uk: string; item_id: string; page: string | null; };
    mode: 'edit' | 'create'; // Новый проп для различения режима
}

export default function EditModal({ isOpen, onClose, onSave, onCreate, isSaving, initialValues, mode }: EditModalProps) {
    const [ru, setRu] = useState(initialValues?.ru || '');
    const [uk, setUk] = useState(initialValues?.uk || '');
    const [itemId, setItemId] = useState(initialValues?.item_id || ''); // Для создания записи

    const handleSave = () => {
        if (mode === 'create') {
            onCreate(ru, uk, itemId); // Используем функцию создания
        } else {
            onSave(ru, uk); // Используем функцию редактирования
        }
    };

    useEffect(() => {
        if (initialValues) {
            setRu(initialValues.ru || '');
            setUk(initialValues.uk || '');
            setItemId(initialValues.item_id || '');
        }
    }, [initialValues]);

    return (
        <Modal isOpen={isOpen} placement= "top" size="lg" onOpenChange={(isOpen) => !isOpen && onClose()}>
            <ModalContent>
                <>
                    <ModalHeader className="flex flex-col gap-1">
                        {mode === 'create' ? 'Create New Translation' : `Edit Translation - ${initialValues?.page || 'Unknown Page'}`}
                    </ModalHeader>
                    <ModalBody>
                        <div>
                            <p><strong>ID:</strong> {initialValues?.item_id}</p>


                            {mode === 'create' && (
                                <div className="mt-4">
                                    <label className="block mb-2">Item ID</label>
                                    <Input
                                        variant="bordered"
                                        color="primary"
                                        type="text"
                                        value={itemId}
                                        onChange={(e) => setItemId(e.target.value)}
                                    />
                                </div>
                            )}


                            <div className="mt-4">
                                <label className="block mb-2">RU</label>
                                <Input
                                    variant="bordered"
                                    color="primary"
                                    type="text"
                                    value={ru}
                                    onChange={(e) => setRu(e.target.value)}
                                />
                            </div>
                            <div className="mt-4">
                                <label className="block mb-2">UK</label>
                                <Input
                                    variant="bordered"
                                    color="primary"
                                    type="text"
                                    value={uk}
                                    onChange={(e) => setUk(e.target.value)}
                                />
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
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