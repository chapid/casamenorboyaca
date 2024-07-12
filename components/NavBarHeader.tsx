/* eslint-disable */
import React, { useEffect } from "react";
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button} from "@nextui-org/react";

export default function NavBarHeader ({user, signOut}: {user: any, signOut: any}) {
  
  
  return <Navbar shouldHideOnScroll>
  <NavbarBrand>
    <p className="font-bold text-inherit">Capacitaciones casa del menor Boyac&aacute;</p>
  </NavbarBrand>
  <NavbarContent className="hidden sm:flex gap-4" justify="center">
    <NavbarItem>
      <Link color="foreground" href="/capacitaciones">
        Capacitaciones
      </Link>
    </NavbarItem>
    <NavbarItem isActive>
      <Link href="/materiales" aria-current="page">
        Materiales y herramientas
      </Link>
    </NavbarItem>
    <NavbarItem className={user ? 'visible':'hidden'}>
      <Link color="foreground" href="/gestion">
        Gestión de datos
      </Link>
    </NavbarItem>
  </NavbarContent>
  <NavbarContent justify="end">
   
  {user ? <Button onClick={signOut}>Salir</Button> : <Link color="foreground" href="/gestion">Entrar</Link>}    
  </NavbarContent>
</Navbar>;
};


