import React from 'react';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,    
  } from "@nextui-org/react";
import Image from 'next/image';

interface LoadingProps {
    show: boolean;    
}

const Loading: React.FC<LoadingProps> = ({ show }) => {
    return (
        <Modal
            isOpen={show}            
            hideCloseButton={true}
            size='sm'
        >
            <ModalContent>
                <ModalHeader>Cargando...</ModalHeader>
                <ModalBody>
                    <div className="flex justify-center items-center">
                        <Image src="/loading.gif" alt="loading" width="100" height="100" />
                    </div>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default Loading;