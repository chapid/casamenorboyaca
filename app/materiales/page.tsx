'use client'
import { useState, useEffect, use } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { GraphQLAuthMode } from '@aws-amplify/core/internals/utils';
import type { Schema } from '@/amplify/data/resource';
import { getCurrentUser } from 'aws-amplify/auth';
import { Card, CardBody, CardHeader, Divider, CardFooter, Image, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/react";
import { RegistroAsistenciaForm } from '@/components/RegistroAsistenciaForm';
import { FaDownload } from "react-icons/fa6";
import { Button } from "@heroui/react";
import { PDFViewer } from '@/components/PdfViewer';
import dynamic from 'next/dynamic';
import Loading from "@/components/Loading";

//const client = generateClient<Schema>();



function Materiales() {
  const [temas, setTemas] = useState<Schema['Tema']['type'][]>([]);
  const [client, setClient] = useState<any>('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [pdfUrl, setPdfUrl] = useState('');
  const [assistantName, setAssistantName] = useState('');
  const [loading, setLoading] = useState(false);

  const PDFViewer = dynamic(
    () => import('@/components/PdfViewer').then(mod => mod.PDFViewer),
    { ssr: false }
  )

  async function listMunicipios() {
    setLoading(true);
    const data = await client.models.Tema.list();
    console.log('cliente', client);
    console.log('errores', data.errors);
    setTemas(data.data || []);
    setLoading(false);
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

  async function getUrl(name: string) {
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + `/api/download?filename=temas/${name}.pdf`,
        { method: 'GET' }
      )

      if (response.ok) {
        const url = response.headers.get('url')
        if (!url) {          
          console.error('S3 Upload Error:', response.body)
          throw new Error('Falló la pre-carga de la presentación.')
          return
        }
        setPdfUrl(url);        
      } else {        
        console.error('S3 Download Error:', response.body)
        throw new Error('Falló la pre-carga de la presentación.')
      }
    } catch (error) {
      setLoading(false);
      alert('Falló la pre-carga de la presentación.')
      console.log('Error download: ', error);
    }
  }

  useEffect(() => {
    setLoading(false);
    if (pdfUrl) {
      onOpen();
    }
  }, [pdfUrl]);

  return (
    <div>
      <h2 className="text-black text-5xl font-bold text-center py-5">Materiales y recursos</h2>
      <Loading show={loading} />
      <Modal
        size='full'
        scrollBehavior='inside'
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Presentaci&oacute;n</ModalHeader>
              <ModalBody>
                <PDFViewer url={pdfUrl} />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cerrar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Card >
        <CardBody>

          <div className='grid grid-cols-4 gap-4 w-full'>

            <div className='sm:col-span-3 col-span-4 bg-gradient-to-tr from-amber-500 via-violet-600 to-indigo-600 rounded-md text-white'>
              <div className="flex items-center justify-center h-2/3">
                <div className="text-center">
                  <h2 className={`text-2xl ${assistantName ? 'visible' : 'hidden'} content-center py-2 text-center`}>Gracias por tu registro {assistantName}!</h2>

                  <div className='grid sm:grid-cols-4 grid-cols-1 gap-4 justify-center items-center h-fit place-items-center'>
                    {temas.map((tema, index) => (
                      <div key={index} className='flex justify-center items-center'>
                        <div className='border-2 border-white-500 p-2 rounded-lg h-20'>
                          <h5>{tema.nombreTema}</h5>
                          <Button color="default" variant="ghost" endContent={<FaDownload />} onClick={() => {
                            if (assistantName === '') {
                              alert('Por favor completa el formulario para poder descargar los materiales');
                              return;
                            }
                            setLoading(true);
                            getUrl(tema.id);                          
                          }}>
                            Abrir presentaci&oacute;n
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <h2 className='content-center py-2 text-center px-20 sm:text-3xl'>Ten en cuenta que debes realizar tu <strong>REGISTRO</strong> para acceder al material disponible</h2>
            </div>
            <div className='sm:col-span-1 col-span-4'>
              <h2 className='text-2xl font-bold text-center pb-5'>REGISTRO</h2>
              <p>Para poder brindarte una mejor experiencia, por favor completa el siguiente formulario.</p>
              <RegistroAsistenciaForm setAssistantName={setAssistantName} />
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default Materiales;