import React from "react";
import Excel from 'exceljs';
import { saveAs } from 'file-saver';
import { generateClient } from 'aws-amplify/data';
import { type Schema } from '@/amplify/data/resource';
import { useState, useEffect } from 'react';
import MessagesHandler from "./MessagesHandler";
import { Button, Flex, Grid, TextField, Autocomplete } from "@aws-amplify/ui-react";

interface ReportFormInfo {
    startDate: Date | null;
    endDate: Date | null;
    userId: string | null;
}

const client = generateClient<Schema>();

export default function ReportForm() {
    const [reportInfo, setReportInfo] = useState<ReportFormInfo>({
        startDate: null,
        endDate: null,
        userId: null
    });
    const [usersOptions, setUsersOptions] = React.useState(new Array());    
    const [loading, setLoading] = useState(false);
    const [saveResultType, setSaveResultType] = React.useState("");
    const [saveMessage, setSaveMessage] = React.useState("");
    const [selectedUser, setSelectedUser] = React.useState("");

    useEffect(() => {
        async function fetchUsers() {
            await client.queries.listUsers().then(({ data, errors }) => {
                console.log(data);
                console.log(errors);
                if (data) {
                    if (data.users) {
                        let usersOptions = data.users?.map((user) => ({id: user?.Username, label: user?.Attributes? user.Attributes.find((attr) => attr!.Name === 'email')?.Value : ''}));
                        setUsersOptions(usersOptions);
                    }                
                }
                
            });
        }
        fetchUsers();
    }, []);

    const handleGenerateReport = async () => {
        setLoading(true);
        setSaveResultType("");
        setSaveMessage("");
        let filter: any = {
            fechaInicio: {
                between: [reportInfo.startDate!.toISOString(), reportInfo.endDate!.toISOString()]
            }
        };
        if (reportInfo.userId) {
            
            filter.owner = {
                beginsWith: reportInfo.userId
            };
            console.log(filter);
        }
        try {
            const { data } = await client.models.Capacitacion.list({
                filter: filter,
                selectionSet: ['descripcion', 'fechaInicio', 'fechaFin', 'tema.nombreTema',
                        'institucion.nombreInstitucion', 'institucion.municipio.nombreMunicipio', 'institucion.municipio.id', 
                        'zona', 'linea', 'poblacion', 'tipoIntervencion', 'rangoEdad', 'totalMujeres', 'totalHombres', 'totalOtro','observaciones',
                        'grupoPoblacional', 'observaciones', 'personasGrupoPoblacional.discapacidad', 
                        'personasGrupoPoblacional.migrante', 'personasGrupoPoblacional.indigena', 'personasGrupoPoblacional.afro', 'personasGrupoPoblacional.victima']
            });                    
            handleDownloadReport(data);
            setSaveResultType("success");
            setSaveMessage("Reporte generado correctamente");
        } catch (error) {
            setSaveResultType("error");
            setSaveMessage("Error generando el reporte");
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadReport = async (reportData: any[]) => {
        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet(`Reporte ${reportInfo.startDate?.toISOString().split('T')[0]} - ${reportInfo.endDate?.toISOString().split('T')[0]}`);
        worksheet.columns = [
            { header: 'Fecha de inicio', key: 'fechaInicio', width: 20 },
            { header: 'Fecha de fin', key: 'fechaFin', width: 20 },
            { header: 'Descripción', key: 'descripcion', width: 20 },
            { header: 'Tema', key: 'tema.nombreTema', width: 20 },
            { header: 'Institución', key: 'institucion.nombreInstitucion', width: 20 },
            { header: 'Municipio', key: 'institucion.municipio.nombreMunicipio', width: 20 },
            { header: 'Zona', key: 'zona', width: 20 },
            { header: 'Línea', key: 'linea', width: 20 },
            { header: 'Población', key: 'poblacion', width: 20 },
            { header: 'Tipo de intervención', key: 'tipoIntervencion', width: 20 },
            { header: 'Rango de edad', key: 'rangoEdad', width: 20 },
            { header: 'Total de mujeres', key: 'totalMujeres', width: 20 },
            { header: 'Total de hombres', key: 'totalHombres', width: 20 },
            { header: 'Total de otros', key: 'totalOtro', width: 20 },
            { header: 'Grupo poblacional', key: 'grupoPoblacional', width: 20 },
            { header: 'Discapacidad', key: 'personasGrupoPoblacional.discapacidad', width: 20 },
            { header: 'Migrante', key: 'personasGrupoPoblacional.migrante', width: 20 },
            { header: 'Indígena', key: 'personasGrupoPoblacional.indigena', width: 20 },
            { header: 'Afro', key: 'personasGrupoPoblacional.afro', width: 20 },
            { header: 'Víctima', key: 'personasGrupoPoblacional.victima', width: 20 },
            { header: 'Observaciones', key: 'observaciones', width: 20 },
        ];
        reportData.forEach((r) => {
            console.log(r);
            const row: { [key: string]: any } = {};
            row.fechaInicio = new Date(r.fechaInicio).toLocaleString();
            row.fechaFin = r.fechaFin ? new Date(r.fechaFin).toLocaleString() : 'No especificada';
            row.descripcion = r.descripcion;
            row['tema.nombreTema'] = r.tema?.nombreTema;
            row['institucion.nombreInstitucion'] = r.institucion?.nombreInstitucion;
            row['institucion.municipio.nombreMunicipio'] = r.institucion?.municipio?.nombreMunicipio;
            row.zona = r.zona;
            row.linea = r.linea;
            row.poblacion = r.poblacion;
            row.tipoIntervencion = r.tipoIntervencion;
            row.rangoEdad = r.rangoEdad;
            row.totalMujeres = r.totalMujeres;
            row.totalHombres = r.totalHombres;
            row.totalOtro = r.totalOtro;
            row.grupoPoblacional = r.grupoPoblacional;
            row['personasGrupoPoblacional.discapacidad'] = r.personasGrupoPoblacional.discapacidad;
            row['personasGrupoPoblacional.migrante'] = r.personasGrupoPoblacional.migrante;
            row['personasGrupoPoblacional.indigena'] = r.personasGrupoPoblacional.indigena;
            row['personasGrupoPoblacional.afro'] = r.personasGrupoPoblacional.afro;
            row['personasGrupoPoblacional.victima'] = r.personasGrupoPoblacional.victima;
            row.observaciones = r.observaciones;        
            worksheet.addRow(row);
        });        
        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), `Reporte ${reportInfo.startDate?.toISOString().split('T')[0]} - ${reportInfo.endDate?.toISOString().split('T')[0]}.xlsx`);
    };

    return (
        <Grid
        as="form"
        rowGap="15px"
        columnGap="15px"
        padding="20px"
        onSubmit={
            async (event) => {
                event.preventDefault();
                if (reportInfo.startDate === null || reportInfo.endDate === null) {
                    return;
                }
                handleGenerateReport();
            }
        }
        >
            <TextField
                label="Fecha de inicio"
                type="date"
                onChange={(event) => {
                    setReportInfo({
                        ...reportInfo,
                        startDate: new Date(event.target.value)
                    });
                }}
            />
            <TextField
                label="Fecha de fin"
                type="date"
                onChange={(event) => {
                    setReportInfo({
                        ...reportInfo,
                        endDate: new Date(event.target.value)
                    });
                }}
            />
            <Autocomplete
                label="Usuario"
                placeholder="Seleccione un usuario"
                value={selectedUser || ''}
                options={usersOptions}
                onChange={(event) => {
                    setSelectedUser(event.target.value);
                    setReportInfo({
                        ...reportInfo,
                        userId: null
                    });
                }}
                onClear={() => {
                    setSelectedUser('');
                    setReportInfo({
                        ...reportInfo,
                        userId: null
                    });
                }}
                onSelect={(event) => {
                    setReportInfo({
                        ...reportInfo,
                        userId: event.id
                    });
                    setSelectedUser(event.label);
                }}
            />
            <Button type="submit" isLoading={loading}>Generar reporte</Button>
            <MessagesHandler messageType={saveResultType} messageContent={saveMessage} />
        </Grid>
    );
}



