import { SidebarTrigger } from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import AppButton from "./AppButton";
export default function Header() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");

    router.replace("/login");
  };  
  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      <SidebarTrigger/>
      <h1 className="text-xl font-bold">
        ERP
      </h1>
<AppButton onClick={handleLogout} className="ml-auto">Logout</AppButton>
      
    </header>
  );
}