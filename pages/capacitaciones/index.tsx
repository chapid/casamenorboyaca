import { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';
import { getCurrentUser } from 'aws-amplify/auth';


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
    try {
      const { username } = await getCurrentUser();
      setAuthMode('userPool');
    } catch (err) {
      setAuthMode('iam');      
    }
    const client = generateClient<Schema>({
      authMode: authMode
    });
    listMunicipios(client);
  }
  

  return (
    <div>
      <h1>Capacitaciones</h1>
      
      <ul>
        {municipios.map((municipio) => (
          <li key={municipio.id}>{municipio.nombreMunicipio}</li>
        ))}
      </ul>
    </div>
  );
}

export default Page;
