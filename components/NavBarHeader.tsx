/* eslint-disable */
import React, { useEffect } from "react";
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, User} from "@nextui-org/react";
import { useSelectedLayoutSegment } from 'next/navigation'
import { useAuthenticator } from '@aws-amplify/ui-react';
import { AuthUser, getCurrentUser, signOut } from 'aws-amplify/auth';
import { fetchAuthSession } from '@aws-amplify/auth';
import { generateClient } from 'aws-amplify/data';
import { type Schema } from '@/amplify/data/resource';

async function fetchUserAttributes() {
  const client = generateClient<Schema>();
  const session = await fetchAuthSession();   // Fetch the authentication session
  if (session.tokens?.accessToken) {
    console.log('Access Token:', session.tokens?.accessToken?.toString());    
    const userAttributes = await client.queries.getUserInfo({ accessToken: session.tokens?.accessToken?.toString() });
    console.log('userAttributes', userAttributes);
    return userAttributes;
  }  else 
    return null;  
}

export default function NavBarHeader () {
  const segment = useSelectedLayoutSegment()
  const { authStatus } = useAuthenticator(context => [context.authStatus]);
  const [userAttributes, setUserAttributes] = React.useState<any>(null);
  const [user, setUser] = React.useState<AuthUser | null>(null);
  async function getUser() {
    try {
      const { username, userId, signInDetails } = await getCurrentUser();
      setUser({ username, userId, signInDetails });
      console.log(`The username: ${signInDetails?.loginId}`);    
    } catch (err) {
      console.log(err);
      setUser(null);
    }
  }
  
  useEffect(() => {
    console.log('authStatus', authStatus);
    if (authStatus !== 'authenticated') {
      return;
    }
    getUser();
    setUserAttributes(fetchUserAttributes());
    
    const listener = (data: any) => {
      if (data.payload.event === 'signOut') {
        setUser(null);
        setUserAttributes(null);
      }
      if (data.payload.event === 'signIn') {
        getUser();
        setUserAttributes(fetchUserAttributes());
      }
    };
  }, [authStatus]);
  
  function fullLogout() {
    signOut();
    window.location.href = "/";
  }
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
    <NavbarItem className={user ? 'visible':'hidden'}>
      {userAttributes? userAttributes.email: null}
    </NavbarItem>
    {user?.signInDetails?.loginId ? 
    <NavbarItem>
      <User
        name={user?.signInDetails?.loginId}
        avatarProps={{ src: 'https://w7.pngwing.com/pngs/128/223/png-transparent-user-person-profile-instagram-ui-colored-icon.png' }}
      />
      </NavbarItem> : null}
  </NavbarContent>
  <NavbarContent justify="end">
   
  {user ? <Button onClick={fullLogout}>Salir</Button> : <Link color="foreground" href="/signin">Entrar</Link>}    
  </NavbarContent>
</Navbar>;
};


