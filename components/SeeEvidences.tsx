'use client';
import React, { useEffect, useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@heroui/react";
import { list } from 'aws-amplify/storage';
import { StorageImage } from '@aws-amplify/ui-react-storage';

interface SeeEvidencesProps {
    capacitacionId: string;
    isOpen: boolean;
    onCloseFunction: () => void;
}

const SeeEvidences: React.FC<SeeEvidencesProps> = ({ capacitacionId, isOpen, onCloseFunction }) => {
    const { onOpenChange } = useDisclosure();
    const [imageUrls, setImageUrls] = useState<string[]>([]);

    useEffect(() => {                
        const fetchUrls = async () => {
            const { items } = await list({ path: `protected/${capacitacionId}/evidencias/` });
            console.log('items', items);
            setImageUrls(items.map((item) => item.path));
        };
        fetchUrls();        
    }, [capacitacionId]);

    return (
        <Modal size='4xl' isOpen={isOpen} onOpenChange={onOpenChange} onClose={onCloseFunction} isDismissable={false}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1" >Evidencias de capacitación</ModalHeader>
                        <ModalBody>
                            <div className="grid grid-cols-3 gap-2 p-4">
                                {imageUrls.map((url, index) => (
                                    <div key={index} className="relative w-full aspect-square overflow-hidden rounded-lg shadow">
                                        <StorageImage alt="evidencia" path={url} />
                                    </div>
                                ))}
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                                Cerrar
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default SeeEvidences;