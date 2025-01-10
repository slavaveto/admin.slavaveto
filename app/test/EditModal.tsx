'use client';

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from '@nextui-org/react';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';




interface EditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (ru: string, uk: string) => void;
    isSaving: boolean; // Новое состояние для загрузки
    initialValues: { ru: string; uk: string; item_id: string; page: string | null; };

}

export default function EditModal({ isOpen, onClose, onSave, isSaving, initialValues }: EditModalProps) {
    const [ru, setRu] = useState(initialValues?.ru || '');
    const [uk, setUk] = useState(initialValues?.uk || '');


    //const [isLoading, setIsLoading] = useState(false); // Локальное состояние загрузки


    const handleSave = () => {
        onSave(ru, uk);
    };


    useEffect(() => {
        // Обновляем локальное состояние при изменении начальных значений
        if (initialValues) {
            setRu(initialValues.ru);
            setUk(initialValues.uk);

        }
    }, [initialValues]);

    return (
        <Modal isOpen={isOpen} placement= "top" size="lg" onOpenChange={(isOpen) => !isOpen && onClose()}>
            <ModalContent>
                <>
                    <ModalHeader className="flex flex-col gap-1">
                        Edit Translation - {initialValues?.page || 'Unknown Page'}
                    </ModalHeader>
                    <ModalBody>
                        <div>
                            <p><strong>ID:</strong> {initialValues?.item_id}</p>
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