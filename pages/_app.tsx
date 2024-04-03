import { Amplify } from 'aws-amplify';
import config from '@/amplifyconfiguration.json';
import '@aws-amplify/ui-react/styles.css';
import '../styles/styles.css';
import {NextUIProvider} from "@nextui-org/react";
import type { AppProps } from 'next/app';
import React, { useEffect } from "react";
import { AuthUser, getCurrentUser, signOut } from 'aws-amplify/auth';
import NavBarHeader from '@/components/NavBarHeader';
import { Hub } from "aws-amplify/utils";

// configure the Amplify client library with the configuration generated by `amplify sandbox`
Amplify.configure(config);

function App({ Component, pageProps }: AppProps) {
  const [user, setUser] = React.useState<AuthUser | null>(null);
  async function getUser() {
    try {
      const { username, userId, signInDetails } = await getCurrentUser();
      setUser({ username, userId, signInDetails });
      console.log(`The username: ${username}`);    
    } catch (err) {
      console.log(err);
      setUser(null);
    }
  }
  useEffect(() => {
    const unsubscribe = Hub.listen("auth", ({ payload }) => {
      switch (payload.event) {
        case 'signedIn':
        case 'signedOut':
          console.log('user signed in', user)
          getUser();
          break;
        
      }
    });
    getUser();
    return () => {
      unsubscribe();
    };
  }, []);
  return <NextUIProvider>    
  <NavBarHeader user={user} signOut={signOut} />
  <Component {...pageProps} />
  </NextUIProvider>;
}

export default App;
