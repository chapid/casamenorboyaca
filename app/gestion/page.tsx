'use client'

import InstitucionesForm from "../../components/InstitucionesForm";
import MunicipiosForm from "@/components/MunicipiosForm";
import CapacitacionesForm from "@/components/CapacitacionesForm";
import ListaInstituciones from "@/components/ListaInstituciones";
import ListaMunicipios from "@/components/ListaMunicipios";
import ListaTemas from "@/components/ListaTemas";
import ListaCapacitaciones from "@/components/ListaCapacitaciones";
import TemasForm from "@/components/TemasForm";
import ListaUsuarios from "@/components/ListaUsuarios";
import ReportForm from "@/components/Estadisticas";
import NotAuthorized from "@/components/NotAuthorized";
import { fetchAuthSession } from "aws-amplify/auth";

import { useAuthenticator } from '@aws-amplify/ui-react';
import { useEffect, useState } from "react";
import { InstitutionIdContext, TemaIdContext, CapacitacionIdContext, MunicipioIdContext } from "@/components/IdContext";

import { Tabs, Tab, Card, CardBody, Divider, CardFooter, Image } from "@heroui/react";
import Loading from "@/components/Loading";

function Page() {
  const [selected, setSelected] = useState("capacitaciones");
  const [institucionId, setInstitucionId] = useState<string>("");
  const [temaId, setTemaId] = useState<string>("");
  const [capacitacionId, setCapacitacionId] = useState<string>("");
  const [municipioId, setMunicipioId] = useState<string>("");
  const { authStatus } = useAuthenticator(context => [context.authStatus]);
  const [userGroup, setUserGroup] = useState<string>();

  useEffect(() => {
    const getSession = async () => {
      try {
        const session = await fetchAuthSession();
        const tokens = session.tokens;
  
        if (tokens) {
          const groups = tokens.accessToken.payload["cognito:groups"] as string[];
          console.log("Grupos del usuario:", groups);
  
          if (groups?.includes("ADMINS")) {
            setUserGroup("ADMINS");
          } else if (groups?.includes("EDITORS")) {
            setUserGroup("EDITORS");
          } else {
            setUserGroup("NONE");
          }
        } else {
          console.log("No tokens found in session");
        }
      } catch (error) {
        console.error("Error al obtener la sesión:", error);
      }
    };
  
    getSession();
  }, []);
  
  return (
    <>
    {authStatus === 'configuring' && <Loading show={authStatus === 'configuring'} />}
    {authStatus !== 'authenticated' ? <NotAuthorized /> : 
    <div className="flex px-5 w-full flex-col">
      <Card isFooterBlurred>
        <Image
          removeWrapper
          alt="Card example background"
          className="z-0 w-full max-h-40 scale-125 -translate-y-5 object-cover"
          src="/banner1.svg"
        />
        <CardFooter className="absolute bg-white/30 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-between">
          <div>
            <h4 className="text-black font-medium text-2xl">Gestión de datos</h4>
          </div>
        </CardFooter>
      </Card>
      
      <Tabs
        aria-label="Options"
        selectedKey={selected}
        onSelectionChange={(e) => setSelected(e.toString())}
      >
        <Tab key="capacitaciones" title="Capacitaciones">
          <Card>
            <CardBody>
              <CapacitacionIdContext.Provider value={{capacitacionId: capacitacionId, setCapacitacionId}}>
              <CapacitacionesForm />
              <Divider className="my-4" />
              <ListaCapacitaciones />
              </CapacitacionIdContext.Provider>
            </CardBody>
          </Card>
        </Tab>
        <Tab key="municipios" title="Municipios">
          <Card>
            <CardBody>
              <MunicipioIdContext.Provider value={{municipioId: municipioId, setMunicipioId}}>
                {userGroup == 'ADMINS' ? <MunicipiosForm /> : null}              
              <Divider className="my-4" />
              <ListaMunicipios />
              </MunicipioIdContext.Provider>
            </CardBody>
          </Card>
        </Tab>
        <Tab key="instituciones" title="Instituciones">
          <Card>
            <CardBody>
            <InstitutionIdContext.Provider value={{institucionId: institucionId, setInstitucionId}}>              
            {userGroup == 'ADMINS' ? <InstitucionesForm /> : null}
              <Divider className="my-4" />
              <ListaInstituciones />
            </InstitutionIdContext.Provider>
            </CardBody>
          </Card>
        </Tab>
        <Tab key="temas" title="Temas">
          <Card>
            <CardBody>
              <TemaIdContext.Provider value={{temaId: temaId, setTemaId}}>                
              {userGroup == 'ADMINS' ? <TemasForm /> : null}
              <Divider className="my-4" />
              <ListaTemas />
              </TemaIdContext.Provider>
            </CardBody>
          </Card>
        </Tab>
        <Tab key="usuarios" title="Usuarios" isDisabled={userGroup != 'ADMINS'}>
          <Card>
            <CardBody>
              <ListaUsuarios />
            </CardBody>
          </Card>
        </Tab>
        <Tab key="estadisticas" title="Estadisticas" isDisabled={userGroup != 'ADMINS'}>
          <Card>
            <CardBody>
              <ReportForm />
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
      </div>
      }
      </>
  );
}

export default Page;
