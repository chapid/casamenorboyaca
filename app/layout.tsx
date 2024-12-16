"use client"

import { Providers } from "./providers";
import { Amplify } from 'aws-amplify';
import config from '@/amplify_outputs.json';
import '@aws-amplify/ui-react/styles.css';
import '../styles/styles.css';
import {NextUIProvider} from "@nextui-org/react";
import type { AppProps } from 'next/app';
import React, { useEffect } from "react";

import NavBarHeader from '@/components/NavBarHeader';

import Whatsapp from '@/components/Whatsapp';
import Footer from '@/components/Footer';

import { Authenticator } from '@aws-amplify/ui-react';

// configure the Amplify client library with the configuration generated by `amplify sandbox`
Amplify.configure(config);



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en">
      <body className="h-full min-h-screen bg-white dark:bg-[#0F172A]">
      <Authenticator.Provider>
        <Providers>
        <NextUIProvider className='min-h-screen flex flex-col justify-start'>    
  
  <div className="h-screen w-screen bg-gray-50 flex items-center">
    <div className="container flex flex-col md:flex-row items-center justify-between px-5 text-gray-700">
            <div className="w-full lg:w-1/2 mx-8">
                <div className="text-7xl text-green-500 font-dark font-extrabold mb-8"> Sentimos las molestias causadas</div>
            <p className="text-2xl md:text-3xl font-light leading-normal mb-8">
              Esta página se encuentra temporalmente suspendida por incumplimientos contractuales con la casa del menor. Para mayor información, puede comunicarse a nuestro correo electrónico dando <a href="mailto:saturnal.software@gmail.com" className="text-green-500"> click aquí</a>.
            </p>
            
            
    </div>
        <div className="w-full lg:flex lg:justify-end lg:w-1/2 mx-5 my-12">
        <img src="https://user-images.githubusercontent.com/43953425/166269493-acd08ccb-4df3-4474-95c7-ad1034d3c070.svg" className="" alt="Page not found"/>
        </div>
    
    </div>
</div>
  <div className="footer fixed bottom-3 right-14">
    <Whatsapp />
  </div>
  <Footer />
  </NextUIProvider>
          
        </Providers></Authenticator.Provider>
      </body>
    </html>
  );
}
