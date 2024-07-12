import React from 'react';
import {Button} from "@nextui-org/react";
import { FaWhatsapp } from "react-icons/fa6";

const Whatsapp: React.FC = () => {
    const handleButtonClick = () => {
        // Replace the phone number and message with your desired values
        const phoneNumber = '1234567890';
        const message = 'Hello, how can I help you?';

        // Check if the user is on a mobile device
        const isMobile = /Android|iPhone/i.test(navigator.userAgent);

        if (isMobile) {
            // Redirect to WhatsApp app
            window.location.href = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
        } else {
            // Redirect to WhatsApp web
            window.open(`https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`);
        }
    };

    return (
        <div>
            <Button onClick={handleButtonClick} color="success" variant="bordered"  className='rounded-full bg-green-500 drop-shadow-lg w-20 h-20 hover:bg-green-900 hover:drop-shadow-2xl hover:animate-bounce duration-300' >
            <FaWhatsapp className='w-10 h-10 text-white'/>
            </Button>            
        </div>
    );
};

export default Whatsapp;