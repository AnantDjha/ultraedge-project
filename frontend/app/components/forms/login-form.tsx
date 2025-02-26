"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SignUpType } from "@/lib/types";
import { Label } from "@radix-ui/react-label";
import { Eraser, Loader, UserCheck } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { DisplayFormMessage } from "./form-message/display-message";
import axios from "axios";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Image from "next/image";

export function LoginForm() {

    const {
        register,
        formState: { errors },
        reset,
        handleSubmit
    } = useForm<SignUpType>()

    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const [message, setMessage] = useState({
        success: false,
        message: ""
    })

    const onSubmit = (data: SignUpType) => {
        setLoading(true)

        axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/login`, data)
            .then((res) => {
                setLoading(false)
                Cookies.set("user", JSON.stringify({ name: res.data.user.name, email: res.data.user.email, token: res.data.token, verified: false }), { expires: 7, path: "/" })
                setMessage({
                    success: res.data.success,
                    message: res.data.message
                })
            })
            .catch((e) => {
                setLoading(false)
                setMessage({
                    success: e.response?.data?.success,
                    message: e.response?.data?.message || "Something went wrong"
                })
            })
    }

    useEffect(() => {
        if (message.message?.length > 0) {
            setTimeout(() => {
                if (message.success) {
                    router.push("/label-code")
                }
                setMessage({
                    success: false,
                    message: ""
                })
            }, 2000)
        }
    }, [message])


    return (
        <div className="w-full h-[100vh] flex flex-col justify-center items-center">
            <Image
                src="/bgImage.webp"
                alt="Background"
                layout="fill"
                objectFit="cover"
                className="absolute top-0 left-0 w-full h-full z-[-1] brightness-50 blur-sm"
            />
            <form onSubmit={handleSubmit(onSubmit)}>
                <DisplayFormMessage
                    success={message.success}
                    message={message.message}
                />

                <Card className="bg-transparent shadow-md shadow-gray-400">
                    <CardHeader>
                        <CardTitle className="text-white">
                            Login your account
                        </CardTitle>
                        <CardDescription>
                            Enter your credential and login to your account
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <div className="mb-3">
                            {/* Email Field */}
                            <Label htmlFor="email" className="text-white">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
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

                        <div className="mb-3">
                            {/* Password Field */}
                            <Label htmlFor="password" className="text-white">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 6,
                                        message: "Password must be at least 6 characters",
                                    },
                                })}
                                className="text-white"
                                placeholder="Enter your password"
                            />
                            {errors.password && (
                                <span className="text-red-500 text-sm">{errors.password.message}</span>
                            )}
                        </div>

                        <div className="flex justify-end mt-6">
                            <Button
                                variant={"secondary"}
                                type="submit"
                                className="cursor-pointer"
                                disabled={loading}
                            >
                                {
                                    loading ? <Loader /> :
                                        <>
                                            <span>
                                                <UserCheck />
                                            </span>
                                            <span>
                                                Login
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

                    </CardContent>
                </Card>
            </form>
            <div className="mt-6">
                <span className="m-3 text-white">
                    Don't Have Account?
                </span>
                <Button variant={"outline"} asChild>
                    <Link href="/sign-up">Register</Link>
                </Button>
            </div>
        </div >
    )
}