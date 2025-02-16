import React, { useEffect, useState } from 'react';
import { StorageImage } from '@aws-amplify/ui-react-storage';
import { list } from 'aws-amplify/storage';
import type { Schema } from '@/amplify/data/resource';

export interface Capacitacion {
    id: string;
    institucion: {
        nombreInstitucion: string;
        municipio: {
            nombreMunicipio: string;
        };
    };
    fechaInicio: string;
    descripcion: string;
}

interface Image {
    id: string;
    url: string;
    title: string;
}

interface GalleryProps {
    capacitacion: Capacitacion | undefined;
}

const Gallery: React.FC<GalleryProps> = ({ capacitacion }) => {
    const [imageUrls, setImageUrls] = useState<string[]>([]);

    useEffect(() => {
        const fetchUrls = async () => {
            if (!capacitacion) return;
            const { items } = await list({ path: `protected/${capacitacion.id}/evidencias/` });
            console.log('items', items);
            setImageUrls(items.map((item) => item.path));
        };
        fetchUrls();
    }, [capacitacion]);

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (

        <div className="flex w-full justify-center">

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6 xl:gap-8 w-10/12 ">
                {imageUrls.length === 0 && <p>No hay evidencias para mostrar</p>}
                {imageUrls.map((url, index) => (
                    <div className="w-80 bg-white p-3">
                        <StorageImage alt="evidencia" path={url} className="h-52 w-full object-cover" />
                        <div className="mt-3 flex flex-wrap">
                            <div className="w-full">
                                <p className="text-sm font-semibold">{capacitacion?.institucion?.municipio.nombreMunicipio}</p>
                                <p className="text-sm font-semibold">{capacitacion?.fechaInicio && formatDate(capacitacion.fechaInicio)}</p>
                            </div>
                            <div className="w-full">                                
                                <p >{capacitacion?.descripcion}</p>
                            </div>
                        </div>
                    </div>
                ))}

            </div>
        </div>
    );
};

export default Gallery;