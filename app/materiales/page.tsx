'use client'
import { useState, useEffect, use } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { GraphQLAuthMode } from '@aws-amplify/core/internals/utils';
import type { Schema } from '@/amplify/data/resource';
import { getCurrentUser } from 'aws-amplify/auth';
import { Card, CardBody, CardHeader, Divider, CardFooter, Image } from "@nextui-org/react";
import RegistroAsistenciaForm from '@/components/RegistroAsistenciaForm';
import { FaDownload } from "react-icons/fa6";
import { Button } from "@nextui-org/react";

//const client = generateClient<Schema>();

function Page() {
  const [temas, setTemas] = useState<Schema['Tema'][]>([]);
  const [client, setClient] = useState<any>('');

  async function listMunicipios() {
    const data = await client.models.Tema.list();
    console.log('cliente', client);
    console.log('errores', data.errors);
    setTemas(data.data || []);
  }

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (client) {
      listMunicipios();
    }
  }, [client]);

  async function getUser() {
    var authMode = 'userPool';
    try {
      const { username } = await getCurrentUser();
      authMode = ('userPool');
    } catch (err) {
      authMode = ('iam');
    }
    const client = generateClient<Schema>({
      authMode: authMode as GraphQLAuthMode
    });
    setClient(client);
  }

  async function downloadFile(name: string) {
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + `/api/download?filename=temas/${name}.pdf`,
        { method: 'GET' }
      )

      if (response.ok) {
        const url = response.headers.get('url')
        console.log('Got presigned URL:', url)
        if (!url) {
          console.error('S3 Upload Error:', response.body)
          alert('Falló la pre-carga de la presentación.')
          return
        }
        const uploadResponse = await fetch(url)

        if (uploadResponse.ok) {
          const blob = await uploadResponse.blob();
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = name;
          link.click();
        } else {
          console.error('S3 Download Error:', uploadResponse)
          alert('Falló la carga de la presentación.')
        }
      } else {
        console.error('S3 Download Error:', response.body)
        alert('Falló la pre-carga de la presentación.')
      }
    } catch (error) {
      console.log('Error download: ', error);
    }
  }

  return (
    <div>
      <Card isFooterBlurred radius='none'>
        <Image
          removeWrapper
          alt="Card example background"
          className="z-0 w-full max-h-40 scale-100 translate-y-5 object-cover"
          src="/materiales.svg"
        />
        <CardFooter className="absolute bg-white/30 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-between">
          <div>
            <h4 className="text-black font-medium text-2xl">Materiales y recursos</h4>
          </div>
        </CardFooter>
      </Card>

      <Card className='p-'>
        <CardBody>
          <div className='flex w-full'>
            <div className='grid sm:grid-cols-4 grid-cols-2 gap-4 w-2/3'>
              {temas.map((tema, index) => (
                <div key={index} className='flex justify-center items-center'>
                  <div className='text-black border-2 border-blue-500 p-2 rounded-lg h-20'>
                    <h5>{tema.nombreTema}</h5>
                    <Button color="primary" variant="ghost" endContent={<FaDownload />} onClick={() => downloadFile(tema.id)}>
                    Descargar presentaci&oacute;n
                    </Button>
                    
                  </div>
                </div>
              ))}
            </div>
            <div className='w-1/3'>
              <h2 className='text-2xl'>¡Queremos conocerte!</h2>
              <p>Para poder brindarte una mejor experiencia, por favor completa el siguiente formulario.</p>
              <RegistroAsistenciaForm />
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default Page;