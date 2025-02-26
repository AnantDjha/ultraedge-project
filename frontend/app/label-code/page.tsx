import { CodeAuthenticationForm } from "../components/forms/code-aunthentication-form";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function page() {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("user");

    if (!userCookie) {
        redirect("/login")
    }

    let value = JSON.parse(userCookie.value);
    if (value.verified) {
        redirect("/")
    }

    return (
        <CodeAuthenticationForm
            data={value}
        />
    )
}