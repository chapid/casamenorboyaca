'use client'
import { useState, useEffect, use } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';
import { getCurrentUser } from 'aws-amplify/auth';

import { FaChalkboardTeacher, FaTheaterMasks } from "react-icons/fa";
import { Button } from "@nextui-org/react";
import Gallery from '@/components/Gallery';


//const client = generateClient<Schema>();

interface Capacitacion {
  id: string;
  institucion: {
    nombreInstitucion: string;
  };
  fechaInicio: string;
}

function Page() {
  const [capacitaciones, setCapacitaciones] = useState<Capacitacion[]>([]);
  const [capacitacionId, setCapacitacionId] = useState<string>('');
  const [authMode, setAuthMode] = useState<any>('');

  async function listCapacitaciones(client: any) {
    console.log('cliente', client);
    const data = await client.models.Capacitacion.list({
      selectionSet: ['id', 'institucion.nombreInstitucion', 'fechaInicio'],
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
    <div
      className="relative bg-gray-50 dark:bg-slate-900 w-screen h-2/3 pattern"
    >
      <nav
        className="z-20 flex shrink-0 grow-0 justify-around gap-4 border-t border-gray-200 bg-white/50 p-2.5 shadow-lg backdrop-blur-lg dark:border-slate-600/60 dark:bg-slate-800/50 fixed top-2/4 -translate-y-2/4 left-6 min-h-[auto] min-w-[300px] flex-col rounded-lg border"
      >
        Elija una de las capacitaciones para ver las evidencias
      
        
        {capacitaciones.map((capacitacion) => (

          <Button key={capacitacion.id} color="secondary" variant="light" size="lg"  onClick={() => setCapacitacionId(capacitacion.id)}>
            {capacitacion.institucion.nombreInstitucion} - {capacitacion.fechaInicio.substring(0, 10)}
          </Button>
        ))
        }

      </nav>
      <Gallery capacitacionId={capacitacionId} />
    </div>

  );
}


export default Page;
