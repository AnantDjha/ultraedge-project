import { cookies } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function Home() {

  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user");

  if (!userCookie) {
    redirect("/login")
  }

  let value = JSON.parse(userCookie.value);
  if (!value.verified) {
    redirect("/label-code")
  }

  return (
    <div className="w-full h-[100vh] flex justify-center items-center ">
      <Image
        src="/nothing.jpg"
        alt="Background"
        objectFit="cover"
        width={400}
        height={400}
      />
    </div>
  );
}
