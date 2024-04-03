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
      <Link color="foreground" href="#">
        Capacitaciones
      </Link>
    </NavbarItem>
    <NavbarItem isActive>
      <Link href="#" aria-current="page">
        Registro de asistencia
      </Link>
    </NavbarItem>
    <NavbarItem>
      <Link color="foreground" href="#">
        Contactenos
      </Link>
    </NavbarItem>
  </NavbarContent>
  <NavbarContent justify="end">
  <p className={user ? '':'hidden'}>Bienvenido {user?.username}</p>  
  {user ? <Button onClick={signOut}>Salir</Button> : <p>Invitado</p>}    
  </NavbarContent>
</Navbar>;
};


