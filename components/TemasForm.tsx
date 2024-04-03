/* eslint-disable */
import * as React from "react";
import { Button, Flex, Grid, TextField, DropZone, Text, TextAreaField, VisuallyHidden } from "@aws-amplify/ui-react";
import { generateClient } from "aws-amplify/api";
import { uploadData } from 'aws-amplify/storage';
import type { Schema } from '@/amplify/data/resource';
import { MdCheckCircle, MdFileUpload, MdRemoveCircle } from 'react-icons/md';


const client = generateClient<Schema>();
export default function TemasForm() {
  const [nombreTema, setNombreTema] = React.useState("");
  const [descripcion, setDescripcion] = React.useState("");
  const [errors, setErrors] = React.useState({});       
  const hiddenInput = React.useRef(null);
  const acceptedFileTypes = ["application/pdf"];
  const [files, setFiles] = React.useState<File[]>(new Array<File>());

  const onFilePickerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (!files || files.length !== 1) {
      return;
    }
    setFiles(Array.from(files));
  };

  const resetStateValues = () => {
    setNombreTema("");
    setDescripcion("");
    setFiles([]);
    setErrors({});
  };  

  const uploadFiles = async (idTema: string) => {
    try {      
      const result = await uploadData({
        key: `temas/${idTema}/${files[0].name}`,
        data: files[0],
        options: {        
          onProgress: ({ transferredBytes, totalBytes }) => {
            if (totalBytes) {
              console.log(
                `Upload progress ${
                  Math.round((transferredBytes / totalBytes) * 100)
                } %`
              );
            }
          }
        }
      }).result;
      console.log('Key from Response: ', result.key);
    } catch (error) {
      console.log('Error : ', error);
    }
  }
  
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();              
        if (nombreTema === "" || descripcion === "") {
          return;
        }
        try {          
          const {data: tema} = await client.models.Tema.create({                        
            nombreTema: nombreTema,  
            descripcion: descripcion,                                  
          });      
          uploadFiles(tema.id);

          
          resetStateValues();          
        } catch (err: any) {
          console.error(err);
          const messages = err.errors.map((e: any) => e.message).join("\n");
          console.error(messages);               
        }
      }}
      
    >    
      <TextField
        label="Nombre tema"
        isRequired={true}
        isReadOnly={false}
        value={nombreTema}
        onChange={(e) => {
          let { value } = e.target;          
          setNombreTema(value);
        }}              
      />
      <TextAreaField
        descriptiveText="Describa el tema"
        label="Descripción"
        onChange={(e) => {
            let { value } = e.target;
            setDescripcion(value);          
          }
        }
        value={descripcion}        
        rows={3}/>
      <DropZone
      borderWidth="4px"
      borderColor="gray"    
      acceptedFileTypes={acceptedFileTypes}
        onDropComplete={({ acceptedFiles, rejectedFiles }) => {
          if (rejectedFiles.length < 1) {
            setFiles(acceptedFiles);
          }
        }}
      >
        <Flex direction="row" justifyContent="center" alignItems="center">
        <DropZone.Accepted>
          <MdCheckCircle fontSize="2rem" />
        </DropZone.Accepted>
        <DropZone.Rejected>
          <MdRemoveCircle fontSize="2rem" />
        </DropZone.Rejected>
        <DropZone.Default>
          <MdFileUpload fontSize="2rem" />
        </DropZone.Default>
        <Flex direction="column" alignItems="center">
          <Text>Arrastra el PDF del tema aquí o</Text>
          <Button size="small" onClick={() => {if (hiddenInput && hiddenInput.current) (hiddenInput.current as HTMLInputElement).click()}}>
            Buscar archivo
          </Button>
        </Flex>
        <VisuallyHidden>
          <input
            type="file"
            tabIndex={-1}
            ref={hiddenInput}
            onChange={onFilePickerChange}
            multiple={true}
            accept={acceptedFileTypes.join(',')}
          />
        </VisuallyHidden>
      </Flex>
        
      </DropZone>
      {files.map((file) => (        
        <Text key={file.name}>{file.name}</Text>
      ))}
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
        />
        <Flex
          gap="15px"
          
        >
          <Button
            children="Guardar"
            type="submit"
            variation="primary"                 
          />
        </Flex>
      </Flex>
    </Grid>
  );
}
