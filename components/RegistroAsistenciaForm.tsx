import React, { useState } from 'react';

const RegistroAsistenciaForm: React.FC = () => {
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // TODO: Add your logic to handle form submission here

        // Reset form fields
        setNombre('');
        setApellido('');
        setEmail('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="nombre">Nombre:</label>
                <input
                    type="text"
                    id="nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="apellido">Apellido:</label>
                <input
                    type="text"
                    id="apellido"
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <button type="submit">Registrar</button>
        </form>
    );
};

export default RegistroAsistenciaForm;