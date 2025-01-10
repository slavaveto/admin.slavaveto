'use client';

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from '@nextui-org/react';
import { useState, useEffect } from 'react';




interface CreateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (item_id: string, ru: string, uk: string) => void;
    isSaving: boolean;
}

export default function CreateModal({ isOpen, onClose, onCreate, isSaving }: CreateModalProps) {
    const [itemId, setItemId] = useState('');
    const [ru, setRu] = useState('');
    const [uk, setUk] = useState('');

    const handleCreate = () => {
        onCreate(itemId, ru, uk);
    };

    return (
        <Modal isOpen={isOpen} placement="top" size="lg" onOpenChange={(isOpen) => !isOpen && onClose()}>
            <ModalContent>
                <>
                    <ModalHeader className="flex flex-col gap-1">Create New Translation</ModalHeader>
                    <ModalBody>
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
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="light" onPress={onClose} isDisabled={isSaving}>
                            Cancel
                        </Button>
                        <Button color="primary" onPress={handleCreate} isLoading={isSaving}>
                            {isSaving ? 'Creating...' : 'Create'}
                        </Button>
                    </ModalFooter>
                </>
            </ModalContent>
        </Modal>
    );
}