/* eslint-disable */
import { useState, useEffect, useRef } from "react";
import { Button, Flex, Grid, TextField, DropZone, Text, TextAreaField, VisuallyHidden } from "@aws-amplify/ui-react";
import { useTemaIdContext } from "./IdContext";
import { generateClient } from "aws-amplify/api";
import type { Schema } from '@/amplify/data/resource';
import {Progress} from "@nextui-org/react";
import { MdCheckCircle, MdFileUpload, MdRemoveCircle } from 'react-icons/md';
import MessagesHandler from "./MessagesHandler";


const client = generateClient<Schema>();
export default function TemasForm() {
  const [nombreTema, setNombreTema] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [errors, setErrors] = useState({});
  const [saveResultType, setSaveResultType] = useState("");
  const [saveMessage, setSaveMessage] = useState("");   
  const hiddenInput = useRef(null);
  const acceptedFileTypes = ["application/pdf"];
  const [files, setFiles] = useState<File[]>(new Array<File>());
  const [isUploading, setIsUploading] = useState(false);
  const {temaId, setTemaId} = useTemaIdContext();

  const onFilePickerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (!files || files.length !== 1) {
      return;
    }
    setFiles(Array.from(files));
  };

  useEffect(() => {
    if (temaId !== "") loadTema();
  }, [temaId]);

  const resetStateValues = () => {
    setTemaId("");
    setNombreTema("");  
    setDescripcion("");
    setFiles([]);
    setErrors({});  
  };  

  async function loadTema() {
    const { data } = await client.models.Tema.get({ id: temaId }, { selectionSet: ['nombreTema', 'descripcion'] });
    setNombreTema(data.nombreTema);
    setDescripcion(data.descripcion);
  }

  const uploadFiles = async (idTema: string) => {
    try {    
      setIsUploading(true);  
      const response = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + '/api/upload',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ filename: `temas/${idTema}.pdf`, contentType: "application/pdf" }),
        }
      )
      if (response.ok) {
        const url = await response.headers.get('url')      
        if (!url) {
          alert('Falló la pre-carga de la presentación.')
          return
        }

        const uploadResponse = await fetch(url, {
          body: files[0],
          method: "PUT",
          headers: { "Content-Type": "application/pdf" }
        })
  
        if (uploadResponse.ok) {
          alert('Subida de presentación exitosa')
        } else {
          console.error('S3 Upload Error:', uploadResponse)
          alert('Falló la carga de la presentación.')
        }
      } else {
        alert('Falló la pre-carga de la presentación.')
      }
    } catch (error) {
      console.log('Error : ', error);
    }
    setIsUploading(false);
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
        if (temaId === "" && files.length === 0) {
          alert("Debe subir un archivo PDF");
          return;
        }
        if (nombreTema === "" || descripcion === "") {
          return;
        }
        try {   
          if (temaId !== "") {
            await client.models.Tema.update({                        
              id: temaId,
              nombreTema: nombreTema.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase(),  
              descripcion: descripcion,                                  
            });
            if (files.length > 0)          
              uploadFiles(temaId);
            setSaveMessage("Tema actualizado correctamente"); 
          }else{
            const {data: tema} = await client.models.Tema.create({                        
              nombreTema: nombreTema.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase(),  
              descripcion: descripcion,                                  
            });      
            uploadFiles(tema.id);
            setSaveMessage("Tema creado correctamente");
          }       
          setSaveResultType("success");          
          resetStateValues();          
        } catch (err: any) {
          console.error(err);
          setSaveResultType("error");
          setSaveMessage("Error al crear el tema");          
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
        isRequired={true}
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
          <Progress 
          isIndeterminate={true}
          aria-label="Subiendo..."
          size="md"        
          color="success"
          showValueLabel={true}
          className={`max-w-md ${isUploading ? '' : 'hidden'}`}
        />
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
      <MessagesHandler messageType={saveResultType} messageContent={saveMessage} />
    </Grid>
  );
}
