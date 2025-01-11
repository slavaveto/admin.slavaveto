'use client';

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@nextui-org/react';

interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    itemId?: string;
    isDeleting: boolean; // Новый проп для состояния загрузки
}

export default function ModalDelete({ isOpen, onClose, isDeleting, onConfirm, itemId }: DeleteModalProps) {
    return (
        <Modal isOpen={isOpen} placement= "top" size="lg" onClose={onClose} >
            <ModalContent>
                <ModalHeader className="text-center">
                    Уверены, что хотите удалить запись?
                </ModalHeader>
                <ModalBody>
                   {itemId ? `${itemId}` : ''}

                </ModalBody>
                <ModalFooter className="flex justify-center space-x-4">
                    <Button color="primary" variant="light" onPress={onClose}>
                        Нет
                    </Button>
                    <Button color="danger" onPress={onConfirm} isLoading={isDeleting}>
                        {isDeleting ? 'Удаляем...' : 'Да, удалить'}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}