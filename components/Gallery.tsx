import React, { useEffect, useState } from 'react';
import { StorageImage } from '@aws-amplify/ui-react-storage';
import { list } from 'aws-amplify/storage';

interface GalleryProps {
    capacitacionId: string;
}

interface Image {
    id: string;
    url: string;
    title: string;
}

const Gallery: React.FC<GalleryProps> = ({ capacitacionId }) => {
    const [imageUrls, setImageUrls] = useState<string[]>([]);

    useEffect(() => {
        const fetchUrls = async () => {
            const { items } = await list({ path: `protected/${capacitacionId}/evidencias/` });
            console.log('items', items);
            setImageUrls((prevUrls) => [...prevUrls, ...items.map((item) => item.path)]);
        };
        fetchUrls();
    }, [capacitacionId]);

    return (

        <div className="flex w-full justify-end">

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 xl:gap-8 w-10/12 ">

                {imageUrls.map((url, index) => (
                    <a href="#" key={index}
                        className="group relative flex h-48 items-end overflow-hidden rounded-lg bg-gray-100 shadow-lg md:h-80">
                        <StorageImage alt="evidencia" path={url} className="absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110" />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gray-800 via-transparent to-transparent opacity-50"></div>
                        <span className="relative ml-4 mb-3 inline-block text-sm text-white md:ml-5 md:text-lg">Evidencia 1</span>
                    </a>
                ))}

            </div>
        </div>
    );
};

export default Gallery;