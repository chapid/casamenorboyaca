/* eslint-disable */
import { useCapacitacionIdContext } from "./IdContext";
import { Button, Flex, Grid, TextField, Autocomplete, Label, TextAreaField, Input, View } from "@aws-amplify/ui-react";
import { generateClient } from 'aws-amplify/data';
import { useState, useEffect } from 'react';
import MessagesHandler from "./MessagesHandler";
import { type Schema } from '@/amplify/data/resource';

//Define the options type with id and label
type Option = {
    id: string;
    label: string;
}
type PersonasPorGrupo = {
    discapacidad: number,
    migrante: number,
    indigena: number,
    afro: number,
    victima: number
}

const client = generateClient<Schema>();
export default function CapacitacionesForm() {
    const [municipio, setMunicipio] = useState<string | null>(null);
    const [municipios, setMunicipios] = useState<Schema['Municipio']['type'][]>([]);
    const [nombreMunicipio, setNombreMunicipio] = useState<string>("");
    const [institucion, setInstitucion] = useState<string | null>(null);
    const [instituciones, setInstituciones] = useState<Schema['Institucion']['type'][]>([]);
    const [nombreInstitucion, setNombreInstitucion] = useState<string>("")
    const [errors, setErrors] = useState({});
    //municipioOptions is an empty array of type Option
    const [municipioOptions, setMunicipioOptions] = useState(new Array<Option>());
    const [institucionOptions, setInstitucionOptions] = useState(new Array<Option>());
    const [descripcion, setDescripcion] = useState("");
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");
    const [listaTemas, setListaTemas] = useState(new Array<Option>());
    const [nombreTema, setNombreTema] = useState<string>("");
    const [zona, setZona] = useState<string>("");
    const [temaId, setTemaId] = useState<string>("");
    const [linea, setLinea] = useState<string>("");
    const [poblacion, setPoblacion] = useState<string>("");
    const [tipoIntervencion, setTipoIntervencion] = useState<string>("");
    const [rangoEdad, setRangoEdad] = useState<string | null>(null);
    const [totalMujeres, setTotalMujeres] = useState<number>(0);
    const [totalHombres, setTotalHombres] = useState<number>(0);
    const [totalOtro, setTotalOtro] = useState<number>(0);
    const [grupoPoblacional, setGrupoPoblacional] = useState<string>("");
    const [personasPorGrupo, setPersonasPorGrupo] = useState<PersonasPorGrupo>({ discapacidad: 0, migrante: 0, indigena: 0, afro: 0, victima: 0 });
    const [observaciones, setObservaciones] = useState<string>("");
    const [temaOptions, setTemaOptions] = useState(new Array());
    const [saveResultType, setSaveResultType] = useState("");
    const [saveMessage, setSaveMessage] = useState("");
    const { capacitacionId, setCapacitacionId } = useCapacitacionIdContext();
    const zonas = client.enums.Zona.values();
    const lineas = client.enums.Linea.values();
    const poblaciones = client.enums.Poblacion.values();
    const tiposIntervencion = client.enums.TipoIntervencion.values();
    const rangosEdad = client.enums.RangoEdad.values();
    const gruposPoblacionales = client.enums.GrupoPoblacional.values();
    


    async function listMunicipios() {
        const { data: municipios, errors } = await client.models.Municipio.list();
        setMunicipios(municipios);
        let municipioOptions = municipios.map((municipio: Schema["Municipio"]["type"]) => ({ id: municipio.id, label: municipio.nombreMunicipio }));
        setMunicipioOptions(municipioOptions);
    }

    async function changeMunicipio(municipioSel: any) {
        setMunicipio(municipioSel);
        setNombreMunicipio(municipioSel.label);
        setInstitucion(null);
        const { data } = await client.models.Institucion.list({
            filter: {
                municipioId: {
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
        setListaTemas(data.map((tema) => ({ id: tema.id, label: tema.nombreTema })));
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
        setNombreTema("");
        setTemaId("");
        setErrors({});
        setZona("");
        setLinea("");
        setPoblacion("");
        setTipoIntervencion("");
        setRangoEdad(null);
        setTotalMujeres(0);
        setTotalHombres(0);
        setTotalOtro(0);
        setGrupoPoblacional("");
        setPersonasPorGrupo({ discapacidad: 0, migrante: 0, indigena: 0, afro: 0, victima: 0 });
        setObservaciones("");
    };

    async function loadCapacitacion() {
        // @ts-ignore
        const { data } = await client.models.Capacitacion.get(
            { id: capacitacionId },
            {
                selectionSet: ['descripcion', 'fechaInicio', 'fechaFin', 'institucion.id', 'tema.id', 'tema.nombreTema',
                    'institucion.nombreInstitucion', 'institucion.municipio.nombreMunicipio', 'institucion.municipio.id', 
                    'zona', 'linea', 'poblacion', 'tipoIntervencion', 'rangoEdad', 'totalMujeres', 'totalHombres', 'totalOtro',
                    'grupoPoblacional', 'observaciones', 'personasGrupoPoblacional.discapacidad', 
                    'personasGrupoPoblacional.migrante', 'personasGrupoPoblacional.indigena', 'personasGrupoPoblacional.afro', 'personasGrupoPoblacional.victima']
            });
        if (data === null) {
            return;
        }
        setDescripcion(data.descripcion);
        setFechaInicio(data.fechaInicio);
        setFechaFin(data.fechaFin ? data.fechaFin : "");
        setNombreMunicipio(data.institucion.municipio.nombreMunicipio);
        changeMunicipio({ id: data.institucion.municipio.id, label: data.institucion.municipio.nombreMunicipio });
        setInstitucion(data.institucion.id);
        setNombreInstitucion(data.institucion.nombreInstitucion);
        setNombreTema(data.tema.nombreTema);
        setTemaId(data.tema.id);
        setZona(data.zona ?? "");
        setLinea(data.linea ?? "");
        setPoblacion(data.poblacion ?? "");
        setTipoIntervencion(data.tipoIntervencion ?? "");
        setRangoEdad(data.rangoEdad);
        setTotalMujeres(data.totalMujeres ?? 0);
        setTotalHombres(data.totalHombres ?? 0);
        setTotalOtro(data.totalOtro ?? 0);
        setGrupoPoblacional(data.grupoPoblacional ?? "");
        setPersonasPorGrupo({
            discapacidad: data.personasGrupoPoblacional?.discapacidad || 0, 
            migrante: data.personasGrupoPoblacional?.migrante || 0, 
            indigena: data.personasGrupoPoblacional?.indigena || 0,
            afro: data.personasGrupoPoblacional?.afro || 0,
            victima: data.personasGrupoPoblacional?.victima || 0
        });
        setObservaciones(data.observaciones || "");        
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
                setSaveResultType("");
                setSaveMessage("");
                if (!institucion || municipio === null || descripcion === "" || fechaInicio === "" || temaId === null || zona === null || linea === null || poblacion === null || tipoIntervencion === null || rangoEdad === null || grupoPoblacional === null) {
                    setSaveResultType("error");
                    setSaveMessage("Tiene que llenar todos los campos obligatorios");
                    return;
                }
                try {
                    if (capacitacionId !== "") {
                        await client.models.Capacitacion.update({
                            id: capacitacionId,
                            descripcion: descripcion,
                            fechaInicio: fechaInicio,
                            fechaFin: fechaFin,
                            institucionId: institucion,
                            temaId: temaId,
                            zona: client.enums.Zona.values().find((z) => z === zona),
                            linea: client.enums.Linea.values().find((l) => l === linea),
                            poblacion: client.enums.Poblacion.values().find((p) => p === poblacion),
                            tipoIntervencion: client.enums.TipoIntervencion.values().find((t) => t === tipoIntervencion),
                            rangoEdad: client.enums.RangoEdad.values().find((r) => r === rangoEdad),
                            totalMujeres: totalMujeres,
                            totalHombres: totalHombres,
                            totalOtro: totalOtro,
                            grupoPoblacional: client.enums.GrupoPoblacional.values().find((g) => g === grupoPoblacional),
                            personasGrupoPoblacional: {
                                discapacidad: personasPorGrupo.discapacidad,
                                migrante: personasPorGrupo.migrante,
                                indigena: personasPorGrupo.indigena,
                                afro: personasPorGrupo.afro,
                                victima: personasPorGrupo.victima
                            },
                            observaciones: observaciones
                        });
                        setSaveMessage("Capacitación actualizada correctamente");
                    } else {
                        const { data: capacitacion } = await client.models.Capacitacion.create({
                            descripcion: descripcion,
                            fechaInicio: fechaInicio,
                            fechaFin: fechaFin,
                            institucionId: institucion,
                            temaId: temaId,
                            zona: client.enums.Zona.values().find((z) => z === zona),
                            linea: client.enums.Linea.values().find((l) => l === linea),
                            poblacion: client.enums.Poblacion.values().find((p) => p === poblacion),
                            tipoIntervencion: client.enums.TipoIntervencion.values().find((t) => t === tipoIntervencion),
                            rangoEdad: client.enums.RangoEdad.values().find((r) => r === rangoEdad),
                            totalMujeres: totalMujeres,
                            totalHombres: totalHombres,
                            totalOtro: totalOtro,
                            grupoPoblacional: client.enums.GrupoPoblacional.values().find((g) => g === grupoPoblacional),
                            personasGrupoPoblacional: personasPorGrupo,
                            observaciones: observaciones
                        });
                        setSaveMessage("Capacitación creada correctamente");
                    }
                    resetStateValues();
                    setSaveResultType("success");
                } catch (err: any) {
                    console.error(err.toString());
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
                    onChange={(e) => {
                        let { value } = e.target;
                        setNombreMunicipio(value);
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
                    }}
                    onChange={(e) => {
                        let { value } = e.target;
                        setNombreInstitucion(value);
                    }}
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
            <Flex direction="column" gap="small">
                <Label htmlFor="tema">Seleccione el tema principal de la capacitación</Label>
                <Autocomplete
                    required
                    label="Tema principal"
                    placeholder="Seleccione el tema principal de la capacitación"
                    value={nombreTema}
                    options={listaTemas}
                    onSelect={(e) => {
                        setTemaId(e.id);
                        setNombreTema(e.label);
                    }}
                    onClear={() => {
                        setTemaId("");
                        setNombreTema("");
                    }}
                    onChange={(e) => {
                        let { value } = e.target;
                        setNombreTema(value);
                    }}
                    menuSlots={{
                        Empty: <View>No se encontraron resultados</View>,
                    }}
                />
            </Flex>
            <Flex direction="column" gap="small">
                <Label htmlFor="zona">Zona</Label>
                <Autocomplete
                    required
                    label="Zona"
                    placeholder="Seleccione la zona donde se realizará la capacitación"
                    value={zona}
                    options={zonas.map((zona) => ({ id: zona, label: zona }))}
                    onSelect={(e) => {
                        setZona(e.id);                        
                    }}
                    onClear={() => {
                        setZona("");
                    }}
                    onChange={(e) => {
                        let { value } = e.target;
                        setZona(value);
                    }}
                    menuSlots={{
                        Empty: <View>No se encontraron resultados</View>,
                    }}
                />
            </Flex>
            <Flex direction="column" gap="small">
                <Label htmlFor="linea">Linea</Label>
                <Autocomplete
                    required
                    label="Linea"
                    placeholder="Seleccione la linea de la capacitación"
                    value={linea}
                    options={lineas.map((linea) => ({ id: linea, label: linea }))}
                    onSelect={(e) => {
                        setLinea(e.id);
                    }}
                    onClear={() => {
                        setLinea("");
                    }}
                    onChange={(e) => {
                        let { value } = e.target;
                        setLinea(value);
                    }}
                    menuSlots={{
                        Empty: <View>No se encontraron resultados</View>,
                    }}
                />
            </Flex>
            <Flex direction="column" gap="small">
                <Label htmlFor="poblacion">Población</Label>
                <Autocomplete
                    required
                    label="Población"
                    placeholder="Seleccione la población objetivo de la capacitación"
                    value={poblacion}
                    options={poblaciones.map((poblacion) => ({ id: poblacion, label: poblacion }))}
                    onSelect={(e) => {
                        setPoblacion(e.id);
                    }}
                    onClear={() => {
                        setPoblacion("");
                    }}
                    onChange={(e) => {
                        let { value } = e.target;
                        setPoblacion(value);
                    }}
                    menuSlots={{
                        Empty: <View>No se encontraron resultados</View>,
                    }}
                />
            </Flex>
            <Flex direction="column" gap="small">
                <Label htmlFor="tipoIntervencion">Tipo de intervención</Label>
                <Autocomplete
                    required
                    label="Tipo de intervención"
                    placeholder="Seleccione el tipo de intervención"
                    value={tipoIntervencion}
                    options={tiposIntervencion.map((tipoIntervencion) => ({ id: tipoIntervencion, label: tipoIntervencion }))}
                    onSelect={(e) => {
                        setTipoIntervencion(e.id);
                    }}
                    onClear={() => {
                        setTipoIntervencion("");
                    }}
                    onChange={(e) => {
                        let { value } = e.target;
                        setTipoIntervencion(value);
                    }}
                    menuSlots={{
                        Empty: <View>No se encontraron resultados</View>,
                    }}
                />
            </Flex>
            <Flex direction="column" gap="small">
                <Label htmlFor="rangoEdad">Rango de edad</Label>
                <Autocomplete
                    required
                    label="Rango de edad"
                    placeholder="Seleccione el rango de edad"
                    value={rangoEdad || ""}
                    options={rangosEdad.map((rangoEdad) => ({ id: rangoEdad, label: rangoEdad }))}
                    onSelect={(e) => {
                        setRangoEdad(e.id);
                    }}
                    onClear={() => {
                        setRangoEdad(null);
                    }}
                    onChange={(e) => {
                        let { value } = e.target;
                        setRangoEdad(value);
                    }}
                    menuSlots={{
                        Empty: <View>No se encontraron resultados</View>,
                    }}
                />
            </Flex>

            <Flex direction="column" gap="small">
                <Label htmlFor="totalMujeres">Total de mujeres</Label>
                <Input
                    type="number"
                    value={totalMujeres}
                    onChange={(e) => {
                        let { value } = e.target;
                        setTotalMujeres(parseInt(value));
                    }}
                />
            </Flex>

            <Flex direction="column" gap="small">
                <Label htmlFor="totalHombres">Total de hombres</Label>
                <Input
                    type="number"
                    value={totalHombres}
                    onChange={(e) => {
                        let { value } = e.target;
                        setTotalHombres(parseInt(value));
                    }}
                />
            </Flex>

            <Flex direction="column" gap="small">
                <Label htmlFor="totalOtro">Total de otro</Label>
                <Input
                    type="number"
                    value={totalOtro}
                    onChange={(e) => {
                        let { value } = e.target;
                        setTotalOtro(parseInt(value));
                    }}
                />
            </Flex>

            <Flex direction="column" gap="small">
                <Label htmlFor="grupoPoblacional">Grupo poblacional</Label>
                <Autocomplete
                    required
                    label="Grupo poblacional"
                    placeholder="Seleccione el grupo poblacional"
                    value={grupoPoblacional}
                    options={gruposPoblacionales.map((grupoPoblacional) => ({ id: grupoPoblacional, label: grupoPoblacional }))}
                    onSelect={(e) => {
                        setGrupoPoblacional(e.id);
                    }}
                    onClear={() => {
                        setGrupoPoblacional("");
                    }}
                    onChange={(e) => {
                        let { value } = e.target;
                        setGrupoPoblacional(value);
                    }}
                    menuSlots={{
                        Empty: <View>No se encontraron resultados</View>,
                    }}
                />
            </Flex>
            <Flex direction="column">
                <Label htmlFor="personasPorGrupo">Personas por grupo</Label>
                {Object.entries(personasPorGrupo).map(([key, value]: [string, number]) => {
                    return (
                        <Flex direction="row" gap="small">
                            <Label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</Label>
                            <Input
                            width={100}
                                type="number"
                                value={value}
                                onChange={(e) => {
                                    let { value } = e.target;
                                    setPersonasPorGrupo((prevState) => ({ ...prevState, [key]: parseInt(value) }));
                                }}
                            />
                        </Flex>
                    );
                }
                )}
            </Flex>
            <Flex direction="column" gap="small">            
                <TextAreaField
                    label="Observaciones"
                    descriptiveText="Complete este campo si tiene alguna observación adicional"             
                    value={observaciones}
                    onChange={(e) => {
                        let { value } = e.target;
                        setObservaciones(value);
                    }}
                    rows={3}
                />
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
