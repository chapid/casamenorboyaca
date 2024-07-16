/* eslint-disable */
import * as React from "react";
import { useInstitutionIdContext } from "@/components/IdContext";
import { Button, Flex, Grid, TextField, Autocomplete } from "@aws-amplify/ui-react";
import { generateClient } from "aws-amplify/api";
import { useState, useEffect } from 'react';
import type { Schema } from '@/amplify/data/resource';
import MessagesHandler from "./MessagesHandler";


const client = generateClient<Schema>();
export default function InstitucionesForm() {
  const [municipio, setMunicipio] = React.useState("");
  const [municipios, setMunicipios] = useState<Schema['Municipio'][]>([]);
  const [nombreMunicipio, setNombreMunicipio] = React.useState("");
  const [nombreInstitucion, setNombreInstitucion] = React.useState("");
  const [errors, setErrors] = React.useState({});
  const [saveResultType, setSaveResultType] = React.useState("");
  const [saveMessage, setSaveMessage] = React.useState("");
  const [municipioOptions, setMunicipioOptions] = React.useState(new Array());
  const {institucionId, setInstitucionId} = useInstitutionIdContext();

  async function listMunicipios() {
    const { data } = await client.models.Municipio.list();
    setMunicipios(data);
    let municipioOptions = data.map((municipio) => ({id: municipio.id, label: municipio.nombreMunicipio}));
    setMunicipioOptions(municipioOptions);
  }

  useEffect(() => {
    listMunicipios();
  }, []);

  useEffect(() => {
    if (institucionId !== "") loadInstitucion();
  }, [institucionId]);

  const resetStateValues = () => {
    setNombreInstitucion("");
    setInstitucionId("");
    setMunicipio("");
    setNombreMunicipio("");
    setErrors({});
  };

  async function loadInstitucion() {
    const { data } = await client.models.Institucion.get({ id: institucionId }, { selectionSet: ['nombreInstitucion', 'municipio.id', 'municipio.nombreMunicipio'] });
    setNombreInstitucion(data.nombreInstitucion);
    setMunicipio(data.municipio.id);
    setNombreMunicipio(data.municipio.nombreMunicipio);
  }
  
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
        if (nombreInstitucion === "" || municipio === "") {
          return;
        }
        try {   
          if (institucionId === "") {
            await client.models.Institucion.create({                        
              nombreInstitucion: nombreInstitucion.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase(),  
              municipio: municipios.find((m) => m.id === municipio),                                  
            });
            setSaveMessage("Institución creada correctamente");
          } else {
            await client.models.Institucion.update({                        
              id: institucionId,
              nombreInstitucion: nombreInstitucion.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase(),  
              municipio: municipios.find((m) => m.id === municipio),                                  
            });            
            setSaveMessage("Institución actualizada correctamente"); 
          }
          resetStateValues();
          setSaveResultType("success");
        } catch (err: any) {
          setSaveResultType("error");
          setSaveMessage("Error al crear la institución");
          console.error(err);          
        }
      }}
    >

      <Autocomplete
        label="Municipio"    
        placeholder="Seleccione un municipio"
        value={nombreMunicipio}      
        options={municipioOptions}
        onSelect={(e) => {        
          setMunicipio(e.id);
          setNombreMunicipio(e.label);
        }}   
        onChange={(e) => {
          let { value } = e.target;          
          setMunicipio("");
          setNombreMunicipio(value);
        }}   
      />
      <TextField
        label="Nombre institucion"
        isRequired={true}
        isReadOnly={false}
        value={nombreInstitucion}
        onChange={(e) => {
          let { value } = e.target;          
          setNombreInstitucion(value);
        }}              
      ></TextField>
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
