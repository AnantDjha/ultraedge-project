"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CircleCheckBig, Eraser, Loader, UserCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form"
import { DisplayFormMessage } from "./form-message/display-message";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { SignUpType } from "@/lib/types";
import Image from "next/image";


export function SignUpForm() {


    const router = useRouter();

    // creating use form hook instance
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<SignUpType>()

    const [mainPassword, setPassword] = useState("")
    //confirm password states
    const [cnfpass, SetCnfPass] = useState("")
    const [cnfPassError, setCnfPassError] = useState("");

    //password validity check states
    const [passwordChecks, setPasswordChecks] = useState({
        hasUppercase: false,
        hasLowercase: false,
        hasMinLength: false,
        hasSpecialChar: false,
    });

    //loading state
    const [loading, setLoading] = useState(false)

    //response message state
    const [message, setMessage] = useState({
        success: false,
        message: ""
    })

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value;

        setPassword(text);
        setPasswordChecks({
            hasUppercase: /[A-Z]/.test(text),
            hasLowercase: /[a-z]/.test(text),
            hasMinLength: text.length >= 8,
            hasSpecialChar: /[^a-zA-Z0-9]/.test(text),
        });
        setCnfPassError("")
    };

    // on submit function
    const onSubmit = (data: SignUpType) => {
        console.log(process.env.NEXT_PUBLIC_BACKEND_URL);

        if (cnfpass.length === 0) {
            setCnfPassError("Please enter confirm password")
            return
        }
        if (cnfpass != mainPassword) {
            setCnfPassError("The confirm password does not match the entered password.")
            return;
        }

        setLoading(true)
        axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user`, data)
            .then((res) => {
                setMessage({
                    success: res.data.success,
                    message: res.data.message
                })

                setLoading(false)
                reset()
            })
            .catch((e) => {
                console.log(e);
                setLoading(false)
                setMessage({
                    success: false,
                    message: "Error while submitting form"
                })
            })
    }

    useEffect(() => {
        if (message.message?.length > 0) {
            setTimeout(() => {
                if (message.success) {
                    router.push("/login")
                }
                setMessage({
                    success: false,
                    message: ""
                })
            }, 2000)
        }
    }, [message])

    return (
        <div className="w-full h-[100vh] flex flex-col justify-center items-center relative">

            <Image
                src="/bgImage.webp"
                alt="Background"
                layout="fill"
                objectFit="cover"
                className="absolute top-0 left-0 w-full h-full z-[-1] brightness-50 blur-sm"
            />

            <Card className="w-1/4 min-w-[25rem] bg-transparent shadow-md shadow-gray-400 ">
                <CardHeader>
                    <CardTitle className="text-xl text-center text-white">Registeration Form</CardTitle>
                    <CardDescription>
                        <DisplayFormMessage
                            message={message.message}
                            success={message.success}
                        />
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Name Field */}
                        <div>
                            <Label htmlFor="name" className="text-white">Name</Label>
                            <Input
                                id="name"
                                {...register("name", { required: "Name is required" })}
                                placeholder="Enter your full name"
                                className="text-white"
                            />
                            {errors.name && (
                                <span className="text-red-500 text-sm">{errors.name.message}</span>
                            )}
                        </div>

                        {/* Phone Field */}
                        <div>
                            <Label htmlFor="phone" className="text-white">Phone</Label>
                            <Input
                                id="phone"
                                maxLength={10}
                                {...register("phone", {
                                    required: "Phone number is required",
                                    pattern: {
                                        value: /^[0-9]{10}$/,
                                        message: "Enter a valid 10-digit phone number",
                                    },
                                })}
                                className="text-white"
                                placeholder="Enter your phone number excluding country code"
                            />
                            {errors.phone && (
                                <span className="text-red-500 text-sm">{errors.phone.message}</span>
                            )}
                        </div>

                        {/* Email Field */}
                        <div>
                            <Label htmlFor="email" className="text-white">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: "Enter a valid email address",
                                    },
                                })}
                                className="text-white"
                                placeholder="Enter your email"
                            />
                            {errors.email && (
                                <span className="text-red-500 text-sm">{errors.email.message}</span>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <Label htmlFor="password" className="text-white">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 8,
                                        message: "Password must be at least 6 characters",
                                    },
                                })}
                                className="text-white"
                                onChange={handlePasswordChange}
                                placeholder="Enter your password"
                            />
                            {errors.password && (
                                <span className="text-red-500 text-sm">{errors.password.message}</span>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="cnf-password" className="text-white">Confirm Password</Label>
                            <Input
                                id="cnf-password"
                                type="password"
                                placeholder="Enter confirm password"
                                value={cnfpass}
                                onChange={(e) => {
                                    SetCnfPass(e.target.value)
                                    setCnfPassError("")
                                }}
                                className="text-white"
                            />
                            {cnfPassError.length > 0 && (
                                <span className="text-red-500 text-sm">{cnfPassError}</span>
                            )}
                        </div>

                        {
                            mainPassword.length > 0
                            &&
                            <div className="text-sm text-red-500">
                                <p className={`${passwordChecks.hasMinLength && "text-green-600"} flex items-center`}>
                                    <span className="mr-3">Minimum 8 characters</span>
                                    {
                                        passwordChecks.hasMinLength && <CircleCheckBig color="green" size={15} />
                                    }
                                </p>
                                <p className={`${passwordChecks.hasUppercase && "text-green-600"} flex items-center`}>
                                    <span className="mr-3"> Must contains 1 uppercase Alphabet</span>
                                    {
                                        passwordChecks.hasUppercase && <CircleCheckBig color="green" size={15} />
                                    }
                                </p>
                                <p className={`${passwordChecks.hasLowercase && "text-green-600"} flex items-center`}>
                                    <span className="mr-3">
                                        Must contains 1 lowercase Alphabet
                                    </span>
                                    {
                                        passwordChecks.hasLowercase && <CircleCheckBig color="green" size={15} />
                                    }
                                </p>
                                <p className={`${passwordChecks.hasSpecialChar && "text-green-600"} flex items-center`}>
                                    <span className="mr-3">
                                        Must contains one special characters
                                    </span>
                                    {
                                        passwordChecks.hasSpecialChar && <CircleCheckBig color="green" size={15} />
                                    }
                                </p>
                            </div>
                        }

                        {/* Submit Button */}
                        <div className="flex justify-end">
                            <Button
                                variant={"secondary"}
                                type="submit"
                                className="cursor-pointer"
                                disabled={
                                    (!passwordChecks.hasLowercase || !passwordChecks.hasUppercase || !passwordChecks.hasMinLength || !passwordChecks.hasSpecialChar) ||
                                    loading
                                }
                            >
                                {
                                    loading ? <Loader /> :
                                        <>
                                            <span>
                                                <UserCheck />
                                            </span>
                                            <span>
                                                Register
                                            </span>
                                        </>
                                }
                            </Button>

                            <Button
                                asChild
                                variant={"secondary"}
                                className="ml-3 cursor-pointer"
                                onClick={() => reset()}
                            >
                                <p>
                                    <span>
                                        <Eraser />
                                    </span>
                                    <span>
                                        Clear
                                    </span>
                                </p>
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
            <div className="mt-6">
                <span className="m-3 text-white">
                    Already Signedup?
                </span>
                <Button variant={"outline"} asChild>
                    <Link href="/login">Login</Link>
                </Button>
            </div>

        </div>
    );
}