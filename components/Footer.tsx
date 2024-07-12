import React from 'react';

const Footer: React.FC = () => {
    return (
        <div className="max-w  mt-auto">

	<footer className="p-4 bg-white rounded-lg shadow md:px-6 md:py-8 dark:bg-gray-800">
		<div className="sm:flex sm:items-center sm:justify-between">
			<a href="#" target="http://www.casadelmenorboyaca.gov.co/" className="flex items-center mb-4 sm:mb-0">
				<img src="http://www.casadelmenorboyaca.gov.co/sites/casa-del-menor-marco-fidel-suarez/content/files/000090/4479_casa-pagina33_200x200.png" className="mr-4 h-8" alt="Casa del menor Logo" />
				<span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Casa del menor</span>
			</a>
			<ul className="flex flex-wrap items-center mb-6 sm:mb-0">
				<li>
					<a href="#" className="mr-4 text-sm text-gray-500 hover:underline md:mr-6 dark:text-gray-400">Acerca de</a>
				</li>
				<li>
					<a href="#" className="mr-4 text-sm text-gray-500 hover:underline md:mr-6 dark:text-gray-400">Política de privacidad y tratamiento de datos</a>
				</li>			
				<li>
					<a href="#" className="text-sm text-gray-500 hover:underline dark:text-gray-400">Contacto</a>
				</li>
			</ul>
		</div>
		<hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
		<span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2024 <a href="http://www.casadelmenorboyaca.gov.co/" target="_blank" className="hover:underline">Casa del Menor Marco Fidel Suarez™</a>. Todos los derechos reservados.
    </span>
	</footer>
    </div>
    );
};

export default Footer;