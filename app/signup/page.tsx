'use client';
import { signUp, confirmSignUp } from "aws-amplify/auth"
import { generateClient } from 'aws-amplify/data';
import { useState } from 'react';
import { Button, Flex, Grid, TextField, Label, Input } from "@aws-amplify/ui-react";
import MessagesHandler from '@/components/MessagesHandler';
import { type Schema } from '@/amplify/data/resource';

const client = generateClient<Schema>({
    authMode: 'iam'
});

export default function SignUpForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showCode, setShowCode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [code, setCode] = useState('');
    const [saveResultType, setSaveResultType] = useState("");
    const [saveMessage, setSaveMessage] = useState("");

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        setLoading(true);
        setSaveResultType("");
        setSaveMessage("");
        //First check if the email is on the list of AllowedEmails
        //If it is not, show an error message
        const { data } = await client.models.AllowedEmails.list();
        if (!data || !data.find((allowedEmail) => allowedEmail.email === email)) {
            setSaveResultType("error");
            setSaveMessage("Email no permitido");
            setLoading(false);
            return;
        }
        try {
            const { nextStep: signUpNextStep } = await signUp({
                username: email,
                password: password,
            })
            setLoading(false)
            if (signUpNextStep.signUpStep === 'CONFIRM_SIGN_UP') {
                setShowCode(true)
            }
        } catch (error) {
            setLoading(false)
            alert("Error al crear la cuenta, confirme que los datos son correctos"+error);
        }
    }

    async function handleConfirmSignUp() {
        console.log("Confirming sign up")
        // ... validate inputs
        // Confirm sign up with the OTP received
        setLoading(true)
        const { nextStep: confirmSignUpNextStep } = await confirmSignUp({
            username: email,
            confirmationCode: code,
        });
        setLoading(false)

        if (confirmSignUpNextStep.signUpStep === 'DONE') {
            setSaveResultType("success");
            setSaveMessage("Registro exitoso redirigiendo...");
            setLoading(false);
            //Redirect to the /login page
            window.location.href = "/signin";
        }
    }

    return (
        <div className="w-screen flex items-center justify-center bg-gray-50 dark:bg-gray-800 px-4 sm:px-6 lg:px-8">
            <div className="relative py-3 sm:max-w-xs sm:mx-auto">
                <div className="min-h-96 px-8 py-6 mt-4 text-left bg-white dark:bg-gray-900  rounded-xl shadow-lg">
                    <div className="flex flex-col justify-center items-center h-full select-none">
                        <div className="flex flex-col items-center justify-center gap-2 mb-8">
                            <a href="https://amethgalarcio.web.app/" target="_blank">
                                <img src="logo.png" className="w-8" />
                            </a>
                            <p className="m-0 text-[16px] font-semibold dark:text-white">Registro</p>
                            <span className="m-0 text-xs max-w-[90%] text-center text-[#8B8E98]">Solo puede registrarse si su correo est&aacute; en la lista de correos permitidos</span>
                        </div>
                        <Grid
                            as="form"
                            className="w-full"
                            rowGap="15px"
                            onSubmit={handleSubmit}
                        >
                            <MessagesHandler messageType={saveResultType} messageContent={saveMessage} />
                            <Label htmlFor="email">Correo</Label>
                            <Input type="email" id="email" name="email" onChange={e => setEmail(e.target.value)} required />

                            <Label htmlFor="password">Contrase&ntilde;a</Label>
                            <Input type="password" id="password" name="password" required onChange={e => setPassword(e.target.value)} />
                            {showCode && (
                                <>
                                    <Label htmlFor="code">C&oacute;digo</Label>
                                    <Input type="text" id="code" name="code" required value={code} onChange={(e)=> setCode(e.target.value)} />
                                    <div className="mt-5">
                                        <Button onClick={() => handleConfirmSignUp()} disabled={loading}>{loading ? 'Cargando...' : 'Confirmar'}</Button>
                                    </div>
                                </>)
                            }
                            <div className="mt-5">
                                <Button type="submit" disabled={loading}>{loading ? 'Cargando...' : 'Registrarse'}</Button>
                            </div>
                        </Grid>

                    </div>
                </div>
            </div>
        </div>


    );
}