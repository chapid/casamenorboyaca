import { Authenticator } from '@aws-amplify/ui-react';
import React from "react";
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button} from "@nextui-org/react";

export const NavBarHeader = () => {
  return <Navbar variant="floating">
  <NavbarBrand>
    <p className="font-bold text-inherit">Capacitaciones casa del menor Boyac&aacute;</p>
  </NavbarBrand>
  <NavbarContent className="hidden sm:flex gap-4" justify="center">
    <NavbarItem>
      <Link color="foreground" href="#">
        Features
      </Link>
    </NavbarItem>
    <NavbarItem isActive>
      <Link href="#" aria-current="page">
        Customers
      </Link>
    </NavbarItem>
    <NavbarItem>
      <Link color="foreground" href="#">
        Integrations
      </Link>
    </NavbarItem>
  </NavbarContent>
  <NavbarContent justify="end">
  <p>Navbar</p> 
  <Authenticator>
    {({ user, signOut }) => (

      <div> 
        <p>Navbar</p> 
        {user ? <Button onClick={signOut}>Salir</Button> : <Button onClick={() => {}}>Entrar</Button>}
        {user ? <p>Hola, {user.username}</p> : null}
      </div>
    )}
  </Authenticator>
    <NavbarItem className="hidden lg:flex">
      <Link href="#">Registrate</Link>
    </NavbarItem>
    <NavbarItem>
      <Button as={Link} color="primary" href="#" variant="flat">
        Sign Up
      </Button>
    </NavbarItem>
  </NavbarContent>
</Navbar>;
};


