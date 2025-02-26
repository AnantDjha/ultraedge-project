import { redirect } from "next/navigation";
import { SignUpForm } from "../components/forms/user-signup";
import { cookies } from "next/headers";

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
        <SignUpForm />
    )
}