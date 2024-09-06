import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import { generateClient } from 'aws-amplify/data';
import { type Schema } from '@/amplify/data/resource';
import { useState, useEffect } from 'react';

interface DetallesCapacitacionModalProps {
    capacitacionId: string;
    isOpen: boolean;
    onCloseFunction: () => void;
}
const client = generateClient<Schema>();
const DetallesCapacitacionModal: React.FC<DetallesCapacitacionModalProps> = ({
    capacitacionId,
    isOpen,
    onCloseFunction
}) => {
    const { onOpenChange } = useDisclosure();
    const [capacitacion, setCapacitacion] = useState<any>();
    // Fetch the capacitacion details based on the capacitacionId
    useEffect(() => {
        async function fetchCapacitacionDetails() {
            const response = await client.models.Capacitacion.get(
                { id: capacitacionId },
                {
                    selectionSet: ['descripcion', 'fechaInicio', 'fechaFin', 'tema.nombreTema',
                        'institucion.nombreInstitucion', 'institucion.municipio.nombreMunicipio', 'institucion.municipio.id', 
                        'zona', 'linea', 'poblacion', 'tipoIntervencion', 'rangoEdad', 'totalMujeres', 'totalHombres', 'totalOtro',
                        'grupoPoblacional', 'observaciones', 'personasGrupoPoblacional.discapacidad', 
                        'personasGrupoPoblacional.migrante', 'personasGrupoPoblacional.indigena', 'personasGrupoPoblacional.afro', 'personasGrupoPoblacional.victima']
                });
            setCapacitacion(response.data);
        }
        fetchCapacitacionDetails();
    }, [capacitacionId]);

    // Render the modal content with the fetched details

    return (
        <Modal size='lg' isOpen={isOpen} onOpenChange={onOpenChange} onClose={onCloseFunction} isDismissable={false} scrollBehavior='inside'>
            <ModalContent>
                <ModalHeader>Detalles de la capacitación</ModalHeader>                     
                <ModalBody>
                    <div className='flex'>
                        <h2><strong>Fecha de inicio:&nbsp;</strong></h2>
                        <p>{new Date(capacitacion?.fechaInicio).toLocaleString()}</p>
                    </div>
                    <div className='flex'>
                        <h2><strong>Fecha de fin:&nbsp;</strong></h2>
                        <p>{(capacitacion?.fechaFin)? new Date(capacitacion?.fechaFin).toLocaleString() : 'No especificada'}</p>
                    </div>
                    <div className='flex'>
                        <h2><strong>Descripción:&nbsp;</strong></h2>
                        <p>{capacitacion?.descripcion}</p>
                    </div>
                    
                    <div className='flex'>
                        <h2><strong>Institución:&nbsp;</strong></h2>
                        <p>{capacitacion?.institucion?.nombreInstitucion} ({capacitacion?.institucion.municipio.nombreMunicipio})</p>
                    </div>
                    <div className='flex'>
                        <h2><strong>Tema principal:&nbsp;</strong></h2>
                        <p>{capacitacion?.tema?.nombreTema}</p>
                    </div>
                    <div className='flex'>
                        <h2><strong>Zona:&nbsp;</strong></h2>
                        <p>{capacitacion?.zona}</p>
                    </div>
                    <div className='flex'>
                        <h2><strong>Línea:&nbsp;</strong></h2>
                        <p>{capacitacion?.linea}</p>
                    </div>
                    <div className='flex'>
                        <h2><strong>Población:&nbsp;</strong></h2>
                        <p>{capacitacion?.poblacion}</p>
                    </div>
                    <div className='flex'>
                        <h2><strong>Tipo de intervención:&nbsp;</strong></h2>
                        <p>{capacitacion?.tipoIntervencion}</p>
                    </div>
                    <div className='flex'>
                        <h2><strong>Rango de edad:&nbsp;</strong></h2>
                        <p>{capacitacion?.rangoEdad}</p>
                    </div>
                    <div className='flex'>
                        <h2><strong>Total de mujeres:&nbsp;</strong></h2>
                        <p>{capacitacion?.totalMujeres}</p>
                    </div>
                    <div className='flex'>
                        <h2><strong>Total de hombres:&nbsp;</strong></h2>
                        <p>{capacitacion?.totalHombres}</p>
                    </div>
                    <div className='flex'>
                        <h2><strong>Total de otros:&nbsp;</strong></h2>
                        <p>{capacitacion?.totalOtro}</p>
                    </div>
                    <div className='flex'>
                        <h2><strong>Grupo poblacional:&nbsp;</strong></h2>
                        <p>{capacitacion?.grupoPoblacional}</p>
                    </div>
                    <div>
                        <h2><strong>Personas por grupo poblacional:&nbsp;</strong></h2>
                        <ul>
                            <li>Discapacidad: {capacitacion?.personasGrupoPoblacional.discapacidad}</li>
                            <li>Migrante: {capacitacion?.personasGrupoPoblacional.migrante}</li>
                            <li>Indígena: {capacitacion?.personasGrupoPoblacional.indigena}</li>
                            <li>Afro: {capacitacion?.personasGrupoPoblacional.afro}</li>
                            <li>Víctima: {capacitacion?.personasGrupoPoblacional.victima}</li>
                        </ul>
                    </div>
                    <div className='flex'>
                        <h2><strong>Observaciones:&nbsp;</strong></h2>
                        <p>{capacitacion?.observaciones}</p>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={onCloseFunction}>
                        Cerrar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default DetallesCapacitacionModal;