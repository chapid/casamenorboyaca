/* eslint-disable */
import React, { useEffect } from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, 
  User, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, menu, 
  Input,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu} from "@nextui-org/react";
import { useSelectedLayoutSegment } from 'next/navigation'
import { useAuthenticator } from '@aws-amplify/ui-react';
import { AuthUser, getCurrentUser, signOut } from 'aws-amplify/auth';
import { fetchAuthSession } from '@aws-amplify/auth';
import { generateClient } from 'aws-amplify/data';
import { type Schema } from '@/amplify/data/resource';
import { FaSearch } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";
import Image from 'next/image';

async function fetchUserAttributes() {
  const client = generateClient<Schema>();
  const session = await fetchAuthSession();   // Fetch the authentication session
  if (session.tokens?.accessToken) {
    console.log('Access Token:', session.tokens?.accessToken?.toString());
    const userAttributes = await client.queries.getUserInfo({ accessToken: session.tokens?.accessToken?.toString() });
    console.log('userAttributes', userAttributes);
    return userAttributes;
  } else
    return null;
}

const adminMenuItems = {
  'Gestión de datos': '/gestion',  
}

const allMenuItems = {
  'Nosotros': '/',
  'Programas y estrategias': '/capacitaciones',
  'Participa': '/materiales',
}

export default function NavBarHeader() {
  const segment = useSelectedLayoutSegment()
  const { authStatus } = useAuthenticator(context => [context.authStatus]);
  const [userAttributes, setUserAttributes] = React.useState<any>(null);
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
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

  async function fullLogout() {
    await signOut();
    setUser(null);
    window.location.href = "/";
  }
  return (
    <Navbar
      classNames={{
        item: [
          "flex",
          "relative",
          "h-full",
          "w-full",
          "items-center",
          "data-[active=true]:after:content-['']",
          "data-[active=true]:after:absolute",
          "data-[active=true]:after:bottom-0",
          "data-[active=true]:after:left-0",
          "data-[active=true]:after:right-0",
          "data-[active=true]:after:h-[2px]",
          "data-[active=true]:after:rounded-[2px]",
          "data-[active=true]:after:bg-primary",
        ],
      }}
      height={16}
      maxWidth="full"
      onMenuOpenChange={setIsMenuOpen}
      className="px-0"
    >
      <NavbarBrand >
      <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
      <Image src="/logo.png" alt="Logo" width={150} height={50} />
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="start">
      
      {user ? Object.entries(adminMenuItems).map(([key, value], index) => (
        <NavbarItem key={`${key}-${index}`} isActive={value === '/' ? segment === null : segment === value.replace('/', '')}>
          <Link color="foreground" href={value} >
            {key}
          </Link>
        </NavbarItem>
      )) : Object.entries(allMenuItems).map(([key, value], index) => (
        <NavbarItem key={`${key}-${index}`} isActive={value === '/' ? segment === null : segment === value.replace('/', '')}>
          <Link color="foreground" href={value}>
            {key}
          </Link>
        </NavbarItem>
      ))}        
        
        
      </NavbarContent>
      
      <NavbarContent as="div" className="items-center" justify="center" >
        <Input
          classNames={{
            base: "max-w-full sm:max-w-[20rem] h-10",
            mainWrapper: "h-full",
            input: "text-small",
            inputWrapper:
              "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
          }}
          placeholder="Buscar..."
          size="md"
          startContent={<FaSearch size={18} />}
          type="search"
        />
      </NavbarContent>
      <NavbarContent className="hidden sm:flex gap-4" >
          

      <NavbarItem className={user ? 'visible' : 'hidden'}>
        {userAttributes ? userAttributes.email : null}  
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

      {user ? <Button onClick={fullLogout} radius="full" color="success" className="bg-green-500 text-white pl-20 py-2 rounded-r-lg -mx-8 text-2xl" >Salir</Button> : <Button size="lg" className="bg-green-500 text-white pl-20 py-2 rounded-r-lg -mx-8 text-2xl" radius="full" color="success" onPress={() => window.location.href = "/signin"}  startContent={<FaUserCircle />}>Entrar</Button>}
    </NavbarContent>
    
    <NavbarMenu>
        {Object.entries(user? adminMenuItems:allMenuItems).map((item, index) => (
          <NavbarMenuItem key={`${item[0]}-${index}`}>
            <Link
              color={
                "primary"
              }
              className="w-full"
              href={item[1]}
              size="lg"
            >
              {item[0]}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
      
    </Navbar>
  )
};


