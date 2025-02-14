import React from 'react';

const NotAuthorized: React.FC = () => {
    return (        
        <div className="bg-gray-100 ">
        <div className="h-screen flex flex-col justify-center items-center px-16">
            <h1 className="text-8xl font-bold text-gray-800">Acceso restringido</h1>
            <p className="text-4xl font-medium text-gray-800">Necesita permisos para acceder a esta página, si está accediendo espere unos segundos para ser redirigido</p>
            <a href="/" className="mt-4 text-xl text-blue-600 hover:underline">Ir al inicio</a>
        </div>
    </div>
    );
};

export default NotAuthorized;