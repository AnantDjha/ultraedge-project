import { LoginForm } from "../components/forms/login-form";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function page() {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("user");

    if (userCookie) {
        let value = JSON.parse(userCookie.value);
        if (value.verified) {
            redirect("/")
        }
        else {
            redirect("/label-code")
        }
    }

    return (
        <LoginForm />
    )
}