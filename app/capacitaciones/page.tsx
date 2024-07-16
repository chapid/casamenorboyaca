'use client'
import { useState, useEffect, use } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';
import { getCurrentUser } from 'aws-amplify/auth';
import Image from 'next/image';


//const client = generateClient<Schema>();

function Page() {
  const [municipios, setMunicipios] = useState<Schema['Municipio'][]>([]);
  const [authMode, setAuthMode] = useState<any>('');
  
  async function listMunicipios(client: any) {
    const data = await client.models.Municipio.list();
    console.log('cliente',client);  
    console.log('errores',data.errors);
    setMunicipios(data.data || []);
  }

  useEffect(() => {      
    getUser();
  }, []);

  async function getUser() {
    setAuthMode('iam');      
    const client = generateClient<Schema>({
      authMode: 'iam'
    });
    listMunicipios(client);
  }
  

  return (
    <div className="container py-32 mx-auto text-center sm:px-4 tails-selected-element">

            <h1 className="text-4xl font-extrabold leading-10 tracking-tight text-black sm:text-5xl sm:leading-none md:text-6xl xl:text-7xl"><span className="block">Bajo</span> <span className="relative inline-block mt-3 text-black">construcci&oacute;n</span></h1>
            
            <div data-rounded="rounded-full" className="relative flex items-center max-w-md mx-auto mt-12 overflow-hidden text-center rounded-full">
            <Image src="/under_construction.svg" className="mr-4" alt="En construccion" width={500} height={500}/>
            </div>
            <div className="mt-8 text-sm text-indigo-300" data-primary="indigo-600">Pronto tendr&aacute;s disponible esta secci&oacute;n.</div>
        </div>
  );
}


export default Page;
