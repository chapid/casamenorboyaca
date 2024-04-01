import {MunicipioCreateForm, TemaCreateForm} from "@/ui-components";
import InstitucionesForm from "../../components/InstitucionesForm";
import ListaInstituciones from "@/components/ListaInstituciones";
import ListaMunicipios from "@/components/ListaMunicipios";
import { withAuthenticator, Button } from '@aws-amplify/ui-react';
import React from "react";

import {Tabs, Tab, Card, CardBody, CardHeader, Divider} from "@nextui-org/react";

function Page({user, signOut}: {user: any, signOut: any}) {
    const [selected, setSelected] = React.useState("municipios");
    return (
        <div className="flex w-full flex-col">
        <Card>
          <CardHeader>
            <h2>Gestión {user.username}</h2> <Button onClick={signOut}>Salir</Button>
          </CardHeader>
        </Card>
        <Tabs 
          aria-label="Options"         
          selectedKey={selected}
          onSelectionChange={(e) => setSelected(e.toString())}
        >
          <Tab key="municipios" title="Municipios">
            <Card>
              <CardBody>
              <MunicipioCreateForm onError={(model, error)=>console.log(error)} />
                <Divider className="my-4" />
                <ListaMunicipios />
              </CardBody>
            </Card>  
          </Tab>
          <Tab key="instituciones" title="Instituciones">
            <Card>
              <CardBody>
                <InstitucionesForm />
                <Divider className="my-4" />
                
                <ListaInstituciones />
              </CardBody>
            </Card>  
          </Tab>
          <Tab key="temas" title="Temas">
            <Card>
              <CardBody>
                <TemaCreateForm />
              </CardBody>
            </Card>  
          </Tab>
        </Tabs>
      </div>       
    );
}

export default withAuthenticator(Page);