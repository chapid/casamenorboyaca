import { Button, Flex, Grid, TextField, Label, Input, View } from "@aws-amplify/ui-react";
import { generateClient } from 'aws-amplify/data';
import { useState, useEffect } from 'react';
import MessagesHandler from "./MessagesHandler";
import { type Schema } from '@/amplify/data/resource';
import { useMunicipioIdContext } from "./IdContext";

const client = generateClient<Schema>();
export default function MunicipiosForm() {
    const [municipio, setMunicipio] = useState<string>('');
    const { municipioId, setMunicipioId } = useMunicipioIdContext();
    const [saveResultType, setSaveResultType] = useState("");
    const [saveMessage, setSaveMessage] = useState("");

    useEffect(() => {
        if (municipioId) {
            client.models.Municipio.get({ id: municipioId }, { selectionSet: ['nombreMunicipio'] })
                .then(({ data }: { data: any }) => {
                    setMunicipio(data.nombreMunicipio);
                });
        }
    }, [municipioId]);

    return (
        <Grid
            as="form"
            rowGap="15px"
            columnGap="15px"
            padding="20px"
            onSubmit={async (event) => {
                event.preventDefault();
                if (municipio === "") {
                    setSaveResultType("error");
                    setSaveMessage("Por favor, ingrese un municipio.");
                    return;
                }
                if (municipioId) {
                    try {
                        await client.models.Municipio.update({
                            id: municipioId,
                            nombreMunicipio: municipio,
                        });
                        setSaveResultType("success");
                        setSaveMessage("Municipio actualizado correctamente.");
                        setMunicipio("");
                    } catch (error) {
                        setSaveResultType("error");
                        setSaveMessage("Error al crear la capacitación");
                    }
                } else {
                    //Municipio field can have a comma separated list of municipios
                    const municipios = municipio.split(",");
                    for (const m of municipios) {
                        try {
                            await client.models.Municipio.create({
                                nombreMunicipio: m,
                            });
                            setSaveResultType("success");
                            setSaveMessage("Municipio creado correctamente.");
                            setMunicipio("");
                        } catch (error) {
                            setSaveResultType("error");
                            setSaveMessage("Error al crear el municipio");
                        }
                    }
                }
            }
            }
        >
            <TextField
                label="Nombre municipio"
                isRequired={true}
                isReadOnly={false}
                value={municipio}
                onChange={(e) => {
                    let { value } = e.target;
                    setMunicipio(value);
                }}
            />
            <Flex
                justifyContent="space-between"
            >
                <Button
                    type="reset"
                    onClick={(event) => {
                        event.preventDefault();
                        setMunicipio("");
                    }}>Limpiar</Button>
                <Flex
                    gap="15px">
                    <Button
                        type="submit"
                        variation="primary"
                    >Guardar</Button>
                </Flex>
            </Flex>
            <MessagesHandler messageType={saveResultType} messageContent={saveMessage} />
        </Grid>
    );
}
