import {MunicipioCreateForm, TemaCreateForm} from "@/ui-components";
import InstitucionesForm from "../../components/InstitucionesForm";
import { withAuthenticator, Button } from '@aws-amplify/ui-react';
import React from "react";

import {Tabs, Tab, Card, CardBody, CardHeader} from "@nextui-org/react";

function Page({user, signOut}) {
    const [selected, setSelected] = React.useState("municipios");
    return (
        <div className="flex w-full flex-col">
        <Card>
          <CardHeader>
            <h1>Gestión {user.username}</h1> <Button onClick={signOut}>Salir</Button>
          </CardHeader>
        </Card>
        <Tabs 
          aria-label="Options"         
          selectedKey={selected}
          onSelectionChange={setSelected}
        >
          <Tab key="municipios" title="Municipios">
            <Card>
              <CardBody>
              <MunicipioCreateForm onError={(model, error)=>console.log(error)} />
              </CardBody>
            </Card>  
          </Tab>
          <Tab key="instituciones" title="Instituciones">
            <Card>
              <CardBody>
                <InstitucionesForm />
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