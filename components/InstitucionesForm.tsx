/* eslint-disable */
import * as React from "react";
import { Button, Flex, Grid, TextField, Autocomplete } from "@aws-amplify/ui-react";
import { generateClient } from "aws-amplify/api";
import { useState, useEffect } from 'react';
import type { Schema } from '@/amplify/data/resource';


const client = generateClient<Schema>();
export default function InstitucionesForm() {
  const [municipio, setMunicipio] = React.useState("");
  const [municipios, setMunicipios] = useState<Schema['Municipio'][]>([]);
  const [nombreInstitucion, setNombreInstitucion] = React.useState("");
  const [errors, setErrors] = React.useState({});
  const [municipioOptions, setMunicipioOptions] = React.useState(new Array());
  

  async function listMunicipios() {
    const { data } = await client.models.Municipio.list();
    setMunicipios(data);    
    let municipioOptions = data.map((municipio) => ({id: municipio.id, label: municipio.nombreMunicipio}));  
    setMunicipioOptions(municipioOptions);
  }

  useEffect(() => {
    listMunicipios();
  }, []);

  const resetStateValues = () => {
    setNombreInstitucion("");
    setErrors({});
  };  
  
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();              
        if (nombreInstitucion === "" || municipio === "") {
          return;
        }
        try {          
          await client.models.Institucion.create({                        
            nombreInstitucion: nombreInstitucion,  
            municipio: municipios.find((m) => m.id === municipio),                                  
          });                       
          
          resetStateValues();          
        } catch (err: any) {
          console.error(err);
          const messages = err.errors.map((e: any) => e.message).join("\n");
          console.error(messages);               
        }
      }}
      
    >
      <Autocomplete
        label="Municipio"    
        placeholder="Seleccione un municipio"  
        options={municipioOptions}
        onSelect={(e) => {        
          setMunicipio(e.id);
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
    </Grid>
  );
}
