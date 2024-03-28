import { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';
import { withAuthenticator } from '@aws-amplify/ui-react';

const client = generateClient<Schema>({
  authMode: 'iam',
});

//const client = generateClient<Schema>();

function Page() {
  const [municipios, setMunicipios] = useState<Schema['Municipio'][]>([]);

  async function listMunicipios() {
    const { data } = await client.models.Municipio.list();
    console.log(data);
    setMunicipios(data);
  }

  useEffect(() => {
    listMunicipios();
  }, []);

  

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
