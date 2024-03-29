/* eslint-disable */
import * as React from "react";
import { Button, Flex, Grid, TextField, Autocomplete } from "@aws-amplify/ui-react";
import { generateClient } from "aws-amplify/api";
import { createInstitucion } from "../ui-components/graphql/mutations";
import { useState, useEffect } from 'react';
import type { Schema } from '@/amplify/data/resource';


const client = generateClient<Schema>();
export default function InstitucionesForm() {
  const [municipio, setMunicipio] = React.useState("");
  const [nombreInstitucion, setNombreInstitucion] = React.useState("");
  const [errors, setErrors] = React.useState({});
  const [municipioOptions, setMunicipioOptions] = React.useState(new Array());
  const [municipios, setMunicipios] = useState<Schema['Municipio'][]>([]);

  async function listMunicipios() {
    const { data } = await client.models.Municipio.list();  
    setMunicipios(data);
    let municipioOptions = data.map((municipio) => ({id: municipio.id, label: municipio.nombreMunicipio}));
    console.log(municipioOptions);
    setMunicipioOptions(municipioOptions);
  }

  useEffect(() => {
    listMunicipios();
  }, []);

  const resetStateValues = () => {
    setNombreInstitucion("");
    setErrors({});
  };
  const validations = {
    nombreInstitucion: [],
  };
  
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          nombreInstitucion,
        };
        
        if (nombreInstitucion === "" && validations.nombreInstitucion.length > 0) {
          return;
        }
        try {          
          await client.graphql({
            query: createInstitucion.replaceAll("__typename", ""),
            variables: {
              input: {
                ...modelFields,
              },
            },
          });                
          resetStateValues();          
        } catch (err: any) {
          const messages = err.errors.map((e: any) => e.message).join("\n");
          console.error(messages);               
        }
      }}
      
    >
      <Autocomplete
        label="Municipio"    
        placeholder="Seleccione un municipio"  
        options={municipioOptions}
        onChange={(e) => {        
          setMunicipio(e.target.value);
        }}        
        />
      <TextField
        label="Nombre institucion"
        isRequired={false}
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
          children="Clear"
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
            children="Submit"
            type="submit"
            variation="primary"                 
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
