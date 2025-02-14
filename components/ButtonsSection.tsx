'use client'
import Image from 'next/image';

export default function ButtonSection() {
    return (
        <div className="flex justify-between w-full sm:p-6 sm:px-20 bg-gradient-to-r from-purple-500 to-indigo-600">
            {/* Button 1: Nuestras actividades */}
            <button className="flex items-center sm:space-x-2 sm:px-6 py-8 rounded-3xl bg-white text-gray-800 hover:bg-gray-100 transition" onClick={() => window.location.href = "/capacitaciones"}>
                <Image src="/peoplechat.png" alt="People chatting" width={50} height={50} />
                <span className="font-bold text-3xl">Nuestras actividades</span>
            </button>

            {/* Button 2: Descarga Nuestro material */}
            <button className="flex items-center space-x-2 px-6 py-8 rounded-3xl bg-white text-gray-800 hover:bg-gray-100 transition" onClick={() => window.location.href = "/materiales"}>
                <Image src="/download.png" alt="Download" width={50} height={50} />
                <span className="font-bold text-3xl">Descarga Nuestro material</span>
            </button>

            {/* Button 3: Descarga Nuestro material */}
            <button className="flex items-center space-x-2 px-6 py-8 rounded-3xl bg-white text-gray-800 hover:bg-gray-100 transition" onClick={() => window.location.href = "/materiales"}>
                <Image src="/download.png" alt="Download" width={50} height={50} />
                <span className="font-bold text-3xl">Descarga Nuestro material</span>
            </button>
        </div>
    );
}