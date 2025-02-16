import React from 'react';
import { FaFacebook, FaTiktok, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { TfiEmail } from "react-icons/tfi";

const SocialMediaHorizontal = () => {
    return (
        <div className="flex flex-wrap justify-center items-center gap-4 text-2xl font-bold sm:px-20">
            <svg width="0" height="0">
                <linearGradient id="blue-gradient" x1="100%" y1="100%" x2="0%" y2="0%">
                    <stop stopColor="#4f46e5" offset="0%" />
                    <stop stopColor="#a855f7" offset="100%" />
                </linearGradient>
            </svg>
            <a href="https://whatsapp.com" className="flex items-center text-gray-800 hover:text-green-600">
                <FaWhatsapp size={40} style={{ fill: "url(#blue-gradient)" }} />
                <span className="ml-2 text-2xl font-bold">+57311 2639056</span>
            </a>
            <a href="mailto:example@example.com" className="flex items-center text-gray-800 hover:text-gray-600">
                <TfiEmail size={40} style={{ fill: "url(#blue-gradient)" }} />
                <span className="ml-2 text-2xl font-bold">casa.menor@boyaca.gov.co</span>
            </a>        
            <a href="https://instagram.com" className="flex items-center text-gray-800 hover:text-pink-600">
                <FaInstagram size={40} style={{ fill: "url(#blue-gradient)" }} />
                <span className="ml-2 text-2xl font-bold">casadelmenordeboyaca</span>
            </a>            
            <a href="https://tiktok.com" className="flex items-center text-gray-800 hover:text-black">
                <FaTiktok size={40} style={{ fill: "url(#blue-gradient)" }} />
                <span className="ml-2 text-2xl font-bold">casadelmenorboyaca</span>
            </a>
            <a href="https://facebook.com" className="flex items-center text-gray-800 hover:text-blue-600">
                <FaFacebook size={40} style={{ fill: "url(#blue-gradient)" }} />
                <span className="ml-2 text-2xl font-bold">casadelmenorboyaca</span>
            </a>
        </div>
    );
};

export default SocialMediaHorizontal;