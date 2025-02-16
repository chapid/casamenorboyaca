import React, { use, useState, useEffect } from 'react';
import { Button, Flex, Grid, TextField, Autocomplete, Label, View, ComboBoxOption } from "@aws-amplify/ui-react";
import MessagesHandler from "./MessagesHandler";
import { generateClient } from "aws-amplify/api";
import type { Schema } from '@/amplify/data/resource';

interface RegistroAsistenciaFormProps {
    setAssistantName: (name: string) => void;
}

export function RegistroAsistenciaForm ({setAssistantName}:RegistroAsistenciaFormProps) {
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [correo, setCorreo] = useState('');
    const [capacitacionesOptions, setCapacitacionesOptions] = useState(new Array<ComboBoxOption>());
    const [capacitaciones, setCapacitaciones] = useState<Schema['Capacitacion']['type'][]>([]);
    const [capacitacionId, setCapacitacionId] = useState('');
    const [capacitacionNombre, setCapacitacionNombre] = useState('');
    const [saveResultType, setSaveResultType] = useState("");
    const [saveMessage, setSaveMessage] = useState("");
    
    const client = generateClient<Schema>({
        authMode: 'iam'
    });

    async function loadCapacitaciones() {        
        const { data } = await client.models.Capacitacion.list();
        console.log('capacitaciones', data);
        setCapacitaciones(data || []);
        setCapacitacionesOptions(data.map((capacitacion: { id: any; descripcion: any; }) => ({ id: capacitacion.id, label: capacitacion.descripcion })));
    }

    useEffect(() => {
        loadCapacitaciones();
    }, []);



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();    
        setSaveResultType("");
        setSaveMessage("");
        if (nombre === "" || apellido === "" || correo === "" || capacitacionId === "") {
            setSaveResultType("error");
            setSaveMessage("Por favor llene todos los campos");
            return;
        }
        try {

            const { data: Asistente } = await client.models.Asistente.create({
                nombre: nombre,
                apellido: apellido,
                correo: correo,
                capacitacionId: capacitacionId
            });

            setSaveMessage("Asistente registrado exitosamente");
            setSaveResultType("success");
            setAssistantName(`${nombre} ${apellido}`);
            resetStateValues();
        } catch (err: any) {
            console.error(err);
            setSaveResultType("error");
            setSaveMessage("Error al registrar el asistente");
        }
    };

    const resetStateValues = () => {
        setNombre("");
        setApellido("");
        setCorreo("");
    }

    return (
        <Grid
            as="form"
            rowGap="15px"
            columnGap="15px"
            padding="20px"
            onSubmit={handleSubmit}
        >
            <TextField
                label="Nombre"
                isRequired={true}
                isReadOnly={false}
                value={nombre}
                onChange={(e) => {
                    let { value } = e.target;
                    setNombre(value);
                }}
            />
            <TextField
                label="Apellido"
                isRequired={true}
                isReadOnly={false}
                value={apellido}
                onChange={(e) => {
                    let { value } = e.target;
                    setApellido(value);
                }}
            />

            <TextField
                label="Correo electrónico"
                isRequired={true}
                isReadOnly={false}
                value={correo}
                onChange={(e) => {
                    let { value } = e.target;
                    setCorreo(value);
                }}
            />

            <Flex direction="column" gap="small">
                <Label htmlFor="municipio">Capacitación a la que asisti&oacute;</Label>
                <Autocomplete
                    label="Capacitación"
                    required
                    placeholder="Seleccione la capacitación"
                    value={capacitacionNombre}
                    options={capacitacionesOptions}
                    onClear={() => {
                        setCapacitacionId("");
                        setCapacitacionNombre("");
                    }}
                    onSelect={(e) => {
                        setCapacitacionNombre(e.label);
                        setCapacitacionId(e.id);
                    }}
                    onChange={(e) => {
                        let { value } = e.target;
                        setCapacitacionNombre(value);
                    }}
                    menuSlots={{
                        Empty: <View>No se encontraron resultados</View>,
                    }}
                />
            </Flex>


            <Flex
                justifyContent="space-between"
            >
                <Button
                    type="reset"
                    onClick={(event) => {
                        event.preventDefault();
                        resetStateValues();
                    }}
                >Limpiar</Button>
                <Flex
                    gap="15px"

                >
                    <Button
                        type="submit"
                        variation="primary"
                    >Guardar</Button>
                </Flex>
            </Flex>
            <MessagesHandler messageType={saveResultType} messageContent={saveMessage} />
        </Grid>
    );
};