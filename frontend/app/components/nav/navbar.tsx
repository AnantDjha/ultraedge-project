"use client"
import { Button } from "@/components/ui/button";
import { Cog, Loader, LogOut } from "lucide-react";
import Cookies from "js-cookie";
import { useState } from "react";
import { usePathname } from "next/navigation";

export function NavBar() {
    const [loading, setLoading] = useState(false)
    const path = usePathname();

    return (
        <div className="w-full fixed top-0 left-0">
            <nav className="w-full flex justify-between items-center p-3">
                <p className="text-bold text-lg text-white flex items-center">
                    <Cog className="text-orange-300" />
                    <span className="font-extrabold">UltraEdge</span>
                </p>

                {
                    !path.endsWith("sign-up") && !path.endsWith("login")
                    &&
                    <Button variant={"outline"} onClick={async () => {
                        setLoading(true);
                        Cookies.remove("user")
                        location.href = "/login"
                    }}>
                        {
                            loading ? <Loader /> :
                                <>
                                    <LogOut />
                                    <span>
                                        LogOut
                                    </span>
                                </>
                        }
                    </Button>
                }

            </nav>
        </div>
    )
}