"use client"


import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@radix-ui/react-label"
import axios from "axios"
import { Loader, TicketCheck } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"
import { DisplayFormMessage } from "./form-message/display-message"

export function CodeAuthenticationForm({ data }: { data: { name: string, email: string, token: string } }) {

    const [code, setCode] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const [message, setMessage] = useState({
        success: false,
        message: ""
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let str = e.target.value
        setCode(str.replace(/\D/g, ''))
    }

    const handleSubmit = () => {
        setLoading(true);

        axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/code-validation`, {
            code: code,
            email: data.email
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${data.token}`,
            }
        }).then((res) => {
            setLoading(false)

            Cookies.set(
                "user",
                JSON.stringify({
                    name: data.name,
                    email: data.email,
                    token: data.token,
                    verified: true
                }),
                {
                    expires: 7,
                    path: "/"
                })

            setCode("")
            setMessage({
                success: res.data.success,
                message: res.data.message
            })
        }).catch((e) => {
            setLoading(false)
            setCode("")
            setMessage({
                success: false,
                message: e.response?.data?.message || "Something went wrong"
            })
        })
    }

    useEffect(() => {
        if (message.message?.length > 0) {
            setTimeout(() => {
                if (message.success) {
                    router.push("/")
                }
                setMessage({
                    success: false,
                    message: ""
                })
            }, 3000)
        }
    }, [message])

    return (
        <div className="w-full h-[100vh] flex justify-center items-center">
            <Image
                src="/authenticate.jpg"
                alt="Background"
                layout="fill"
                objectFit="cover"
                className="absolute top-0 left-0 w-full h-full z-[-1] brightness-50 blur-lg"
            />
            <div className="relative w-1/4 h-80">

                <DisplayFormMessage
                    success={message.success}
                    message={message.message}
                />
                <Card className="bg-transparent right-3 top-3">
                    <CardHeader className="text-white">
                        <CardTitle className="text-xl text-center">
                            Auntentication Code
                        </CardTitle>
                        <CardDescription className=" text-gray-300 text-center">
                            Enter 4 digit number to proceed further
                        </CardDescription>

                        <CardContent>

                            <div>
                                <div className="my-10 flex flex-col items-center">
                                    {/* Email Field */}
                                    <Label htmlFor="code" className="text-white font-bold block w-full text-center text-xl mb-3">Enter Code</Label>
                                    <input
                                        id="code"
                                        type="text"
                                        className="text-white font-bold py-3 text-3xl text-center bg-transparent rounded-lg border outline-none"
                                        maxLength={4}
                                        value={code}
                                        onChange={handleChange}
                                    />

                                </div>
                            </div>

                            <div className="flex w-full justify-end gap-3">
                                <Button variant={"secondary"} size={"lg"} disabled={code.length < 4} onClick={handleSubmit}>
                                    {loading ? <Loader /> :
                                        <><TicketCheck size={40} /> Validate</>
                                    }
                                </Button>
                                <Button variant={"destructive"} size={"lg"} onClick={() => setCode("")}>
                                    clear
                                </Button>
                            </div>

                        </CardContent>
                    </CardHeader>
                </Card>
            </div>

        </div>
    )
}