'use client'
import { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';

import Gallery from '@/components/Gallery';
import { Capacitacion } from '@/components/Gallery';


//const client = generateClient<Schema>();



function Page() {
  const [capacitaciones, setCapacitaciones] = useState<Capacitacion[]>([]);
  const [capacitacionS, setCapacitacionS] = useState<Capacitacion>();
  const [authMode, setAuthMode] = useState<any>('');

  async function listCapacitaciones(client: any) {
    console.log('cliente', client);
    const data = await client.models.Capacitacion.list({
      selectionSet: ['id', 'institucion.nombreInstitucion', 'fechaInicio', 'descripcion', 'institucion.municipio.nombreMunicipio'],
    });
    
    console.log('errores', data.errors);
    console.log('data', data);
    setCapacitaciones(data.data || []);
  }

  useEffect(() => {
    getUser();
  }, []);

  async function getUser() {
    setAuthMode('iam');
    const client = generateClient<Schema>({
      authMode: 'iam'
    });
    listCapacitaciones(client);
  }


  return (
    <div className='grid grid-cols-4 gap-4 w-full'>
      <div className='sm:col-span-1 col-span-4 h-400 overflow-auto pl-3'>
      <p className='text-sm'>Elija una de las capacitaciones para ver las evidencias</p>
        {capacitaciones.map((capacitacion) => (
          <div key={capacitacion.id} onClick={() => setCapacitacionS(capacitacion)} className='flex flex-col gap-2 p-2 cursor-pointer'>
            <p className='font-bold'>{capacitacion.institucion.nombreInstitucion}</p>
            <p className='text-sm'>{capacitacion.institucion.municipio.nombreMunicipio} - {capacitacion.fechaInicio.substring(0, 10)}</p>          
          </div>
        ))
        }
      </div>
      <div className='sm:col-span-3 col-span-4'>
      <Gallery capacitacion={capacitacionS} />
      </div>
    </div>

  );
}


export default Page;
