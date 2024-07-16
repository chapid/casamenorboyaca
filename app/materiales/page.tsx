'use client'
import { useState, useEffect, use } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { GraphQLAuthMode } from '@aws-amplify/core/internals/utils';
import type { Schema } from '@/amplify/data/resource';
import { getCurrentUser } from 'aws-amplify/auth';
import { Card, CardBody, CardHeader, Divider, CardFooter, Image } from "@nextui-org/react";
import RegistroAsistenciaForm from '@/components/RegistroAsistenciaForm';

//const client = generateClient<Schema>();

function Page() {
  const [municipios, setMunicipios] = useState<Schema['Municipio'][]>([]);  
  const [client, setClient] = useState<any>('');
  
  async function listMunicipios() {
    const data = await client.models.Municipio.list();
    console.log('cliente',client);  
    console.log('errores',data.errors);
    setMunicipios(data.data || []);
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
          <div className='grid grid-cols-3 gap-4 w-full'>
            <div className='flex justify-center'><Image src="/1.svg" alt="question1"/></div>
            <div>
            <h2 className='text-2xl'>¡Queremos conocerte!</h2>
            <p>Para poder brindarte una mejor experiencia, por favor completa el siguiente formulario.</p>
            <RegistroAsistenciaForm />
            </div>
            <div className='flex justify-center'><Image src="/2.svg" alt="question1" /></div>
          </div>
        </CardBody>
        </Card>
    </div>
  );
}

export default Page;