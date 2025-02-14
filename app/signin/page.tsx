'use client'
import { signIn } from "aws-amplify/auth"
import type { FormEvent } from "react"
import { Button, Flex, Grid, TextField, Label, Input } from "@aws-amplify/ui-react";
import MessagesHandler from "@/components/MessagesHandler";
import { useState } from 'react';
import { confirmResetPassword } from 'aws-amplify/auth';
interface SignInFormElements extends HTMLFormControlsCollection {
    email: HTMLInputElement
    password: HTMLInputElement
}

interface SignInForm extends HTMLFormElement {
    readonly elements: SignInFormElements
}

export default function App() {
    const [saveResultType, setSaveResultType] = useState("");
    const [saveMessage, setSaveMessage] = useState("");
    const [loading, setLoading] = useState(false);
    async function handleSubmit(event: FormEvent<SignInForm>) {
        event.preventDefault()
        setLoading(true)
        const form = event.currentTarget
        // ... validate inputs
        await signIn({
            username: form.elements.email.value,
            password: form.elements.password.value,
        }).then(() => {
            setSaveResultType("success");
            setSaveMessage("Acceso exitoso redirigiendo...");
            setLoading(false);
            //Redirect to the /gestion page
            window.location.href = "/gestion";
        }).catch((error) => {
            setLoading(false);
            setSaveResultType("error");
            console.error(error);
            setSaveMessage("Error al iniciar sesión");
        })
    }

    /*async function handleResetPassword() {
        await confirmResetPassword({
            username: "euporia.software@gmail.com",
            confirmationCode: "293658",
            newPassword: "ovanea*on3w2Eoo",
        });
    }*/

    return (

        <div className="w-screen flex items-center justify-center bg-gray-50 dark:bg-gray-800 px-4 sm:px-6 lg:px-8">
            <div className="relative py-3 sm:max-w-xs sm:mx-auto">
                <div className="min-h-96 px-8 py-6 mt-4 text-left bg-white dark:bg-gray-900  rounded-xl shadow-lg">
                    <div className="flex flex-col justify-center items-center h-full select-none">
                        <div className="flex flex-col items-center justify-center gap-2 mb-8">
                            <a href="/" target="_blank">
                                <img src="logo.png" className="w-8" />
                            </a>
                            <p className="m-0 text-[16px] font-semibold dark:text-white">Inicio de sesi&oacute;n</p>
                            <span className="m-0 text-xs max-w-[90%] text-center text-[#8B8E98]">Este inicio de sesi&oacute;n es solo para administradores y contratistas/funcionarios activos</span>
                        </div>
                        <Grid
                            as="form"
                            className="w-full"
                            rowGap="15px"
                            onSubmit={handleSubmit}
                        >
                            <MessagesHandler messageType={saveResultType} messageContent={saveMessage} />
                            <Label htmlFor="email">Correo</Label>
                            <Input type="email" id="email" name="email" required />
                            <Label htmlFor="password">Contrase&ntilde;a</Label>
                            <Input type="password" id="password" name="password" required />
                            <div className="mt-5">
                                <Button type="submit" disabled={loading}>Entrar</Button>                                
                            </div>
                        </Grid>
                        <div className="flex flex-col items-center justify-center gap-2 mt-8">
                            <a href="/signup" className="text-[#8B8E98] text-xs">¿No tienes cuenta? Reg&iacute;strate</a>
                            <a href="/forgotpassword" className="text-[#8B8E98] text-xs">¿Olvidaste tu contrase&ntilde;a?</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>


    )
}