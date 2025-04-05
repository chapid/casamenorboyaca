'use client'
import { signIn, confirmSignIn } from "aws-amplify/auth"
import type { FormEvent } from "react"
import { Grid, Label } from "@aws-amplify/ui-react";
import MessagesHandler from "@/components/MessagesHandler";
import { useState } from 'react';
import { resetPassword, confirmResetPassword } from 'aws-amplify/auth';
import {
    Form,
    InputOtp,
    Input,
    Button,
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    DrawerFooter,
    useDisclosure,
} from "@heroui/react";
import { IoEye, IoEyeOff } from "react-icons/io5";
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
    //Password recovery
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [submitted, setSubmitted] = useState(false);
    const [code, setCode] = useState("");
    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);
    const [signInSession, setSignInSession] = useState<any>(null);
    const [challenge, setChallenge] = useState("");
    const [showNewPasswordForm, setShowNewPasswordForm] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    
    async function handleSubmit(event: FormEvent<SignInForm>) {
      event.preventDefault();
      setLoading(true);
    
      try {
        const form = event.currentTarget;
        const username = form.elements.email.value;
        const password = form.elements.password.value;
    
        const response = await signIn({ username, password });
    
        if (response.nextStep.signInStep === "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED") {
          console.log("⚠ Requiere nueva contraseña");
    
          setSignInSession(response.session); // Guarda la sesión
          setShowNewPasswordForm(true);       // Muestra el formulario
          setSaveResultType("info");
          setSaveMessage("Debes cambiar tu contraseña para continuar.");
        } else {
          // Login exitoso
          console.log("✅ Login exitoso");
          window.location.href = "/gestion";
        }
      } catch (error) {
        console.error("❌ Error al iniciar sesión:", error);
        setSaveResultType("error");
        setSaveMessage("Error al iniciar sesión");
      } finally {
        setLoading(false);
      }
    }

    async function handleNewPasswordSubmit(e: FormEvent<HTMLFormElement>) {
      e.preventDefault();
      setLoading(true);
    
      try {
        await confirmSignIn({
          challengeResponse: newPassword,
          signInSession,
        });
        console.log("✅ Contraseña cambiada, login exitoso");
        window.location.href = "/gestion";
      } catch (error) {
        console.error("❌ Error al cambiar contraseña:", error);
        setSaveResultType("error");
        setSaveMessage("Error al cambiar la contraseña.");
      } finally {
        setLoading(false);
      }
    }



    async function onSubmitRecovery(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const data = Object.fromEntries(new FormData(e.currentTarget));
        if (!code) {
            const output = await resetPassword({
                username: data.email as string,
            });

            const { nextStep } = output;
            switch (nextStep.resetPasswordStep) {
                case 'CONFIRM_RESET_PASSWORD_WITH_CODE':
                    const codeDeliveryDetails = nextStep.codeDeliveryDetails;
                    setSaveResultType("success");
                    setSaveMessage(`Se envió el código de recuperación a ${codeDeliveryDetails.deliveryMedium}`);
                    // Collect the confirmation code from the user and pass to confirmResetPassword.
                    break;
                case 'DONE':
                    console.log('Successfully reset password.');
                    break;
            }

            setSubmitted(true);
            return;
        }
        await confirmResetPassword({
            username: data.email as string,
            confirmationCode: code,
            newPassword: data.password as string,
        }).then(() => {
            setSaveResultType("success");
            setSaveMessage("Contraseña cambiada exitosamente");
            setSubmitted(false);
        }).catch((error) => {
            setSaveResultType("error");
            setSaveMessage(error.message);
        });

    };

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
                        <Drawer
                            isDismissable={false}
                            isKeyboardDismissDisabled={true}
                            isOpen={isOpen}
                            onOpenChange={onOpenChange}
                        >
                            <DrawerContent>
                                {(onClose) => (
                                    <>
                                        <DrawerHeader className="flex flex-col gap-1">Cambio de contraseña</DrawerHeader>
                                        <DrawerBody>
                                            <MessagesHandler messageType={saveResultType} messageContent={saveMessage} />
                                            <p>
                                                Escriba su correo electronico y le enviaremos un código para cambiar su contraseña si la cuenta existe. Si no recibe el correo, revise la carpeta de spam.
                                            </p>
                                            <Form className="w-full max-w-xs" validationBehavior="native" onSubmit={onSubmitRecovery}>
                                                <Input
                                                    isRequired
                                                    errorMessage="Por favor escriba una direccion de correo valida"
                                                    label="Email"
                                                    labelPlacement="outside"
                                                    name="email"
                                                    placeholder="Escriba su correo"
                                                    type="email"
                                                />

                                                {submitted && (
                                                    <div className="flex flex-col gap-2">
                                                        <InputOtp isRequired length={6} value={code} onValueChange={setCode} label="Codigo de confirmacion" />
                                                        <Input
                                                            isRequired
                                                            errorMessage="La contraseña debe contener al menos 8 caracteres, una mayuscula, una minuscula, un numero y un caracter especial"
                                                            label="Nueva contraseña"
                                                            labelPlacement="outside"
                                                            name="password"
                                                            placeholder="Escriba su nueva contraseña"

                                                            endContent={
                                                                <button
                                                                    aria-label="toggle password visibility"
                                                                    className="focus:outline-none"
                                                                    type="button"
                                                                    onClick={toggleVisibility}
                                                                >
                                                                    {isVisible ? (
                                                                        <IoEye className="pointer-events-none" />
                                                                    ) : (
                                                                        <IoEyeOff className="pointer-events-none" />
                                                                    )}
                                                                </button>
                                                            }
                                                            type={isVisible ? "text" : "password"}
                                                        />
                                                    </div>
                                                )}
                                                <Button type="submit" variant="bordered">
                                                    {submitted ? "Recibir codigo" : "Cambiar contraseña"}
                                                </Button>
                                            </Form>
                                        </DrawerBody>
                                        <DrawerFooter>
                                            <Button color="danger" variant="light" onPress={onClose}>
                                                Cancelar
                                            </Button>
                                        </DrawerFooter>
                                    </>
                                )}
                            </DrawerContent>
                        </Drawer>
                        {showNewPasswordForm && (
                          <Form
                            className="w-full mt-6"
                            onSubmit={handleNewPasswordSubmit}
                            validationBehavior="native"
                          >
                            <MessagesHandler messageType={saveResultType} messageContent={saveMessage} />
                            <p className="text-sm text-gray-500 dark:text-gray-300 mb-4">
                              Debes establecer una nueva contraseña para continuar.
                            </p>
                            <Input
                              isRequired
                              label="Nueva contraseña"
                              labelPlacement="outside"
                              name="new-password"
                              placeholder="Escribe tu nueva contraseña"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              type={isVisible ? "text" : "password"}
                              endContent={
                                <button
                                  aria-label="toggle password visibility"
                                  className="focus:outline-none"
                                  type="button"
                                  onClick={toggleVisibility}
                                >
                                  {isVisible ? <IoEye /> : <IoEyeOff />}
                                </button>
                              }
                            />
                            <div className="mt-4">
                              <Button type="submit" disabled={loading}>
                                Cambiar contraseña
                              </Button>
                            </div>
                          </Form>
                        )}
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
                            <a href="#" onClick={onOpen} className="text-[#8B8E98] text-xs">¿Olvidaste tu contraseña?</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
