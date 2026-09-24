import Image from "next/image";
import Link from "next/link";
import AppButton from "../components/AppButton";
export default function Home() {
  return (
    <div className="flex flex-row flex-1 gap-4 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
     <AppButton><Link href = '/login' >Login</Link></AppButton>
      <AppButton>Register</AppButton>
    </div>
  );
}
