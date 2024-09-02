'use client'
import { useState, useEffect, use } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';
import { getCurrentUser } from 'aws-amplify/auth';
import Image from 'next/image';
import { FaChalkboardTeacher, FaTheaterMasks } from "react-icons/fa";
import { BiCameraMovie } from "react-icons/bi";
import { IoFootballOutline } from "react-icons/io5";
import { Button } from "@nextui-org/react";


//const client = generateClient<Schema>();

function Page() {
  const [municipios, setMunicipios] = useState<Schema['Municipio'][]>([]);
  const [authMode, setAuthMode] = useState<any>('');

  async function listMunicipios(client: any) {
    const data = await client.models.Municipio.list();
    console.log('cliente', client);
    console.log('errores', data.errors);
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
    <div
      className="relative bg-gray-50 dark:bg-slate-900 w-screen h-2/3 pattern"
    >
      <nav
        className="z-20 flex shrink-0 grow-0 justify-around gap-4 border-t border-gray-200 bg-white/50 p-2.5 shadow-lg backdrop-blur-lg dark:border-slate-600/60 dark:bg-slate-800/50 fixed top-2/4 -translate-y-2/4 left-6 min-h-[auto] min-w-[300px] flex-col rounded-lg border"
      >
        <Button color="secondary" variant="light" size="lg" startContent={<FaChalkboardTeacher />}>
          Capacitaciones
        </Button>

        <Button color="secondary" variant="light" size="lg" startContent={<BiCameraMovie />}>
          Cine al parque
        </Button>

        <Button color="secondary" variant="light" size="lg" startContent={<FaTheaterMasks />}>
          Teatro
        </Button>


        <Button color="secondary" variant="light" size="lg" startContent={<IoFootballOutline />}>
          Fútbol
        </Button>

      </nav>
      <div className="flex w-full justify-end">

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 xl:gap-8 w-10/12 ">

          <a href="#"
            className="group relative flex h-48 items-end overflow-hidden rounded-lg bg-gray-100 shadow-lg md:h-80">
            <img src="https://scontent-bog2-1.xx.fbcdn.net/v/t39.30808-6/457696127_896071815900084_3858795097134311965_n.jpg?stp=cp6_dst-jpg&_nc_cat=103&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeGQFuzQwOo_FmEEtTQddzGRO7thtUVD_rM7u2G1RUP-s56OvgUyAwXChgQIKGQedojwTIQKTFcrxYUuByGuXg8y&_nc_ohc=jsL-wm4L62YQ7kNvgEMxFwH&_nc_ht=scontent-bog2-1.xx&oh=00_AYD-GtCMVNuLNDnRplOl5FlhNnPXq3VlGqOQNRqV2mI1Ig&oe=66DC12DE" loading="lazy" alt="Photo by Minh Pham" className="absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110" />

            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gray-800 via-transparent to-transparent opacity-50">
            </div>

            <span className="relative ml-4 mb-3 inline-block text-sm text-white md:ml-5 md:text-lg">Capacitaci&oacute;n 1</span>
          </a>



          <a href="#"
            className="group relative flex h-48 items-end overflow-hidden rounded-lg bg-gray-100 shadow-lg md:col-span-2 md:h-80">
            <img src="https://scontent-bog2-2.xx.fbcdn.net/v/t39.30808-6/458338886_896143525892913_1856472783551164497_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeEqinhCXoDlt3XXG9dHVL2NX2FhAdQ9EFZfYWEB1D0QVrkwvUE2pwozxjfrgnr-NgDhY1cJUQvQugTqtbtZQUfp&_nc_ohc=zVEC7ygTt08Q7kNvgEiPb0M&_nc_ht=scontent-bog2-2.xx&oh=00_AYDTkOvMraX9fMdtBYBHrRcBSNAAwcPs9wOhoZUZN1fiaA&oe=66DC0CF5" loading="lazy" alt="Photo by Magicle" className="absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110" />

            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gray-800 via-transparent to-transparent opacity-50">
            </div>

            <span className="relative ml-4 mb-3 inline-block text-sm text-white md:ml-5 md:text-lg">Capacitaci&oacute;n 2</span>
          </a>



          <a href="#"
            className="group relative flex h-48 items-end overflow-hidden rounded-lg bg-gray-100 shadow-lg md:col-span-2 md:h-80">
            <img src="https://scontent-bog2-1.xx.fbcdn.net/v/t39.30808-6/457472948_893491429491456_6506801566871563460_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFiFd1eelnymcy10T7HXeALoh6e1pRhVteiHp7WlGFW10lmVao1UzMvSwcIkOsOZKMx3AdjCRbA1zTkESQDzXsJ&_nc_ohc=MnjPent_DWgQ7kNvgF3UgmD&_nc_ht=scontent-bog2-1.xx&oh=00_AYA29bO0NYVI5ISjqlEy9xf9bDp9SfULMX5I_rshvF2Q4A&oe=66DBF56E" loading="lazy" alt="Photo by Martin Sanchez" className="absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110" />

            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gray-800 via-transparent to-transparent opacity-50">
            </div>

            <span className="relative ml-4 mb-3 inline-block text-sm text-white md:ml-5 md:text-lg">Capacitaci&oacute;n 3</span>
          </a>

          <a href="#"
            className="group relative flex h-48 items-end overflow-hidden rounded-lg bg-gray-100 shadow-lg md:h-80">
            <img src="https://scontent-bog2-1.xx.fbcdn.net/v/t39.30808-6/457523950_892997342874198_2171211489111294395_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeGtHwfd9RDcXHGAfk2ZaRepyCQetPXZQdbIJB609dlB1vKMjxCoFy8rva6964al4KwKCaPrLCnOYP45GN8oxLLF&_nc_ohc=NoS4qRNZ9kwQ7kNvgGCSYfg&_nc_ht=scontent-bog2-1.xx&oh=00_AYAT6J3tt4_sSGRO37lOyTi0PpWc31jmfcDLyVHQMiqyHQ&oe=66DC1400" loading="lazy" alt="Photo by Lorenzo Herrera" className="absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110" />

            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gray-800 via-transparent to-transparent opacity-50">
            </div>

            <span className="relative ml-4 mb-3 inline-block text-sm text-white md:ml-5 md:text-lg">Capacitaci&oacute;n 4</span>
          </a>

        </div>
      </div>
    </div>

  );
}


export default Page;
