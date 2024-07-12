/* eslint-disable */
import { useCapacitacionIdContext } from "./IdContext";
import { Button, Flex, Grid, TextField, Autocomplete, Label, TextAreaField, Input, View } from "@aws-amplify/ui-react";
import { SelectionSet, generateClient } from "aws-amplify/api";
import { useState, useEffect } from 'react';
import type { Schema } from '@/amplify/data/resource';
import { CheckboxGroup, Checkbox } from "@nextui-org/react";
import MessagesHandler from "./MessagesHandler";

//Define the options type with id and label
type Option = {
    id: string;
    label: string;
}


const client = generateClient<Schema>();
export default function CapacitacionesForm() {
    const [municipio, setMunicipio] = useState<string | null>(null);
    const [municipios, setMunicipios] = useState<Schema['Municipio'][]>([]);
    const [nombreMunicipio, setNombreMunicipio] = useState<string>("");
    const [institucion, setInstitucion] = useState<string | null>(null);
    const [instituciones, setInstituciones] = useState<Schema['Institucion'][]>([]);
    const [nombreInstitucion, setNombreInstitucion] = useState<string>("")
    const [errors, setErrors] = useState({});
    //municipioOptions is an empty array of type Option
    const [municipioOptions, setMunicipioOptions] = useState(new Array<Option>());
    const [institucionOptions, setInstitucionOptions] = useState(new Array<Option>());
    const [descripcion, setDescripcion] = useState("");
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");
    const [listaTemas, setListaTemas] = useState<Schema['Tema'][]>([]);
    const [temas, setTemas] = useState(new Array());
    const [temaOptions, setTemaOptions] = useState(new Array());
    const [saveResultType, setSaveResultType] = useState("");
    const [saveMessage, setSaveMessage] = useState("");
    const { capacitacionId, setCapacitacionId } = useCapacitacionIdContext();
    const [savedTemas, setSavedTemas] = useState(new Array());

    async function listMunicipios() {
        const { data } = await client.models.Municipio.list();
        setMunicipios(data);
        let municipioOptions = data.map((municipio) => ({ id: municipio.id, label: municipio.nombreMunicipio }));
        setMunicipioOptions(municipioOptions);
    }

    async function changeMunicipio(municipioSel: any) {
        setMunicipio(municipioSel);
        setNombreMunicipio(municipioSel.label);
        setInstitucion(null);    
        const { data } = await client.models.Institucion.list({
            filter: {
                municipioInstitucionesId: {
                    eq: municipioSel.id
                }
            }
        });
        if (data.length === 0) {
            return;
        }    
        setInstituciones(data);
        let institucionOptions = data.map((institucion) => ({ id: institucion.id, label: institucion.nombreInstitucion }));
        setInstitucionOptions(institucionOptions);
    }

    async function listTemas() {
        const { data } = await client.models.Tema.list();
        if (data.length === 0) {
            return;
        }
        setListaTemas(data);
        let temaOptions = data.map((tema) => ({ id: tema.id, label: tema.nombreTema }));
        setTemaOptions(temaOptions);    
        //await fetch('/api/metadata').then(response => response.json()).then(data => console.log(data));        
    }

    useEffect(() => {
        listMunicipios();
        listTemas();        
    }, []);

    useEffect(() => {
        if (capacitacionId !== "") loadCapacitacion();
    }, [capacitacionId]);

    const resetStateValues = () => {
        setCapacitacionId("");
        setMunicipio(null);
        setNombreMunicipio("");
        setInstitucion(null);
        setNombreInstitucion("");
        setDescripcion("");  
        setFechaInicio("");
        setFechaFin("");
        setTemas([]);  
        setErrors({});
    };

    async function loadCapacitacion() {
        const { data } = await client.models.Capacitacion.get(
            { id: capacitacionId }, 
            { selectionSet: ['descripcion', 'fechaInicio', 'fechaFin', 'institucion.id', 
            'institucion.nombreInstitucion', 'institucion.municipio.nombreMunicipio', 'institucion.municipio.id'] });        
        setDescripcion(data.descripcion);
        setFechaInicio(data.fechaInicio);
        setFechaFin(data.fechaFin? data.fechaFin : "");
        setNombreMunicipio(data.institucion.municipio.nombreMunicipio);
        changeMunicipio({id: data.institucion.municipio.id, label: data.institucion.municipio.nombreMunicipio});
        setInstitucion(data.institucion.id);   
        setNombreInstitucion(data.institucion.nombreInstitucion); 
        
        //@ts-ignore
        const { data: dataTemas } = await client.models.CapacitacionTema.list({
            //@ts-ignore
            filter: {
                capacitacionId: {
                    eq: capacitacionId
                }
            },
            //@ts-ignore
            selectionSet: ['id', 'temaId']
        });
        setTemas(dataTemas.map((tema: any) => tema.temaId));   
        setSavedTemas(dataTemas.map((tema: any) => tema.id)); 
    }
//#region render
    return (
        <Grid
            as="form"
            rowGap="15px"
            columnGap="15px"
            padding="20px"
            onSubmit={async (event) => {
                event.preventDefault();
                console.log("Temas: ", temas);
                setSaveResultType("");
                setSaveMessage("");
                if (institucion === null || municipio === null || descripcion === "" || fechaInicio === "" || temas.length === 0) {                
                    setSaveResultType("error");
                    setSaveMessage("Todos los campos son requeridos");
                    return;
                }                        
                try {
                    if (capacitacionId !== "") {
                        await client.models.Capacitacion.update({
                            id: capacitacionId,
                            descripcion: descripcion,
                            fechaInicio: fechaInicio,
                            fechaFin: fechaFin,
                            institucion: instituciones.find((i) => i.id === institucion),
                        });
                        savedTemas.forEach(async (tema) => {
                            await client.models.CapacitacionTema.delete({id: tema});                            
                        });
                        console.log("Temas: ", temas);
                        //console.log("Lista Temas: ", listaTemas.filter((t) => temas.includes(t.id)));
                        temas.forEach(async (tema) => {
                            await client.models.CapacitacionTema.create({
                                capacitacion: {id: capacitacionId},
                                tema: {id: tema}
                            });
                        });                                          
                        setSaveMessage("Capacitación actualizada correctamente");                    
                    }else{
                        const {data: capacitacion} = await client.models.Capacitacion.create({
                            descripcion: descripcion,
                            fechaInicio: fechaInicio,
                            fechaFin: fechaFin,
                            institucion: instituciones.find((i) => i.id === institucion),
                        });
                        temas.forEach(async (tema) => {
                            await client.models.CapacitacionTema.create({
                                capacitacion: {id: capacitacion.id},
                                tema: {id: tema}
                            });
                        });                                              
                        setSaveMessage("Capacitación creada correctamente");
                    }                   
                    resetStateValues();
                    setSaveResultType("success");                    
                } catch (err: any) {
                    console.error(err);
                    setSaveResultType("error");
                    setSaveMessage("Error al crear la capacitación");
                }
            }}
        >
            <p className="italic">IMPORTANTE: Luego de crear la capacitaci&oacute;n podr&aacute; a&ntilde;adir evidencias</p>
            <Flex direction="column" gap="small">
                <Label htmlFor="municipio">Municipio</Label>
                <Autocomplete
                    label="Municipio"
                    required
                    placeholder="Seleccione un municipio"
                    value={nombreMunicipio}
                    options={municipioOptions}
                    onClear={() => {
                        setInstitucion(null);
                        setNombreInstitucion("");                    
                        setMunicipio(null);
                        setNombreMunicipio("");
                    }}
                    onSelect={(e) => {
                        changeMunicipio(e);
                    }}
                    menuSlots={{
                        Empty: <View>No se encontraron resultados</View>,
                      }}
                />
            </Flex>
            <Flex direction="column" gap="small">
                <Label htmlFor="institucion">Institución</Label>
                <Autocomplete
                    required
                    label="Institución"
                    placeholder="Seleccione la institución donde se realizará la capacitación"
                    value={nombreInstitucion}
                    options={institucionOptions}
                    onSelect={(e) => {                    
                        setInstitucion(e.id);    
                        setNombreInstitucion(e.label);                
                    }}
                    onClear={() => {
                        setInstitucion(null);
                        setNombreInstitucion("");
                    }
                    }
                    menuSlots={{
                        Empty: <View>No se encontraron resultados</View>,
                      }}
                />
            </Flex>
            <TextAreaField
                required
                descriptiveText="Describa lo que se va a tratar en la capacitación"
                label="Descripción"
                onChange={(e) => {
                    let { value } = e.target;
                    setDescripcion(value);
                }
                }
                value={descripcion}
            />
            <Flex direction="row">
                <Flex direction="column" gap="small">
                    <Label htmlFor="fechaInicio">Fecha de inicio</Label>
                    <Input                    
                        isRequired={true}
                        isReadOnly={false}
                        type="datetime-local"
                        value={fechaInicio}
                        onChange={(e) => {
                            let { value } = e.target;
                            setFechaInicio(value);
                        }}
                    />
                </Flex>
                <Flex direction="column" gap="small">
                    <Label htmlFor="fechaFin">Fecha de fin</Label>
                    <Input
                        isRequired={false}
                        isReadOnly={false}
                        type="datetime-local"
                        value={fechaFin}
                        onChange={(e) => {
                            let { value } = e.target;
                            setFechaFin(value);
                        }}
                    />
                </Flex>
            </Flex>
            <Flex direction="column">
                <CheckboxGroup
                    label="Seleccione los temas de la capacitación"
                    color="warning"
                    value={temas}
                    onValueChange={setTemas}
                >
                   {temaOptions.map((tema) => (
                        <Checkbox key={tema.id} value={tema.id}>{tema.label}</Checkbox>
                    ))}
                   
                </CheckboxGroup>                
            </Flex>
            <Flex
                justifyContent="space-between"
            >
                <Button
                    children="Limpiar"
                    type="reset"
                    onClick={(event) => {
                        event.preventDefault();
                        resetStateValues();
                    }}

                ></Button>
                <Flex
                    gap="15px"

                >
                    <Button
                        children="Guardar"
                        type="submit"
                        variation="primary"
                    ></Button>
                </Flex>
            </Flex>
            <MessagesHandler messageType={saveResultType} messageContent={saveMessage} />
        </Grid>
    );
}
