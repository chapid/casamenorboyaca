import React from 'react';
import Image from "next/legacy/image";
import { TfiYoutube } from "react-icons/tfi";


const Footer: React.FC = () => {
	return (
		<div className="max-w  mt-auto">
			<footer className="p-4 bg-white rounded-lg shadow md:px-6 md:py-8 dark:bg-gray-800">
				<div className="sm:flex sm:items-center sm:justify-between">
					<a href="#" target="http://www.casadelmenorboyaca.gov.co/" className="flex items-center mb-4 sm:mb-0">
						<Image src="/logo.png" className="mr-4" alt="Casa del menor Logo" width={80} height={80} />
						<span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Casa del menor</span>
					</a>
					<ul className="flex flex-wrap items-center mb-6 sm:mb-0">
						<li>
							<a href="#" className="mr-4 text-sm text-gray-500 hover:underline md:mr-6 dark:text-gray-400">Política de privacidad y tratamiento de datos</a>
						</li>
					</ul>
				</div>
				<hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
				<div className="flex items-center justify-center pb-8">
					<Image src="/footer.png" alt="Casa del menor Logo" width={450} height={80} />
				</div>
				
			</footer>
		</div>
	);
};

export default Footer;