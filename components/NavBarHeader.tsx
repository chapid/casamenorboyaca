/* eslint-disable */
import React, { useEffect } from "react";
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button} from "@nextui-org/react";
import { useSelectedLayoutSegment } from 'next/navigation'

export default function NavBarHeader ({user, signOut}: {user: any, signOut: any}) {
  const segment = useSelectedLayoutSegment()
  

  return <Navbar shouldHideOnScroll>
  <NavbarBrand>
      <Link color="foreground" className={(segment == null || segment == "")  ? "text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 mb-3":"text-black" } href="/">
      <p className="font-bold text-inherit">NOSOTROS</p>
      </Link>
    
  </NavbarBrand>
  <NavbarContent className="hidden sm:flex gap-4" justify="center">
    <NavbarItem>
      <Link className={segment == 'capacitaciones'  ? "text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-extrabold rounded-lg text-sm px-5 py-2.5 text-center mr-3 mb-3" : "text-black"} href="/capacitaciones">
        Nuestras actividades
      </Link>
    </NavbarItem>
    <NavbarItem className={user ? 'hidden':'visible'}>
      <Link href="/materiales" className={segment == 'materiales'  ? "text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-extrabold rounded-lg text-sm px-5 py-2.5 text-center mr-3 mb-3" : "text-black" }>
        Materiales y herramientas
      </Link>
    </NavbarItem>
    <NavbarItem className={user ? 'visible':'hidden'}>
      <Link color="foreground" href="/gestion" className={segment == 'gestion'  ?  "text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-extrabold rounded-lg text-sm px-5 py-2.5 text-center mr-3 mb-3":"text-black"}>
        Gestión de datos
      </Link>
    </NavbarItem>
  </NavbarContent>
  <NavbarContent justify="end">
   
  {user ? <Button onClick={signOut}>Salir</Button> : <Link color="foreground" href="/gestion">Entrar</Link>}    
  </NavbarContent>
</Navbar>;
};


