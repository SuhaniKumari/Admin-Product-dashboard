'use client';
import Header from "@/src/components/Header";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/ui/app-sidebar"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ErpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const router = useRouter();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (isLoggedIn !== "true") {
      router.replace("/login");
      return;
    }

    setLoading(false);
  }, [router]);

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <SidebarProvider defaultOpen={true}>
      <AppSidebar />

      <div className="flex min-h-screen flex-1 flex-col">
        <Header />

        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </SidebarProvider>
    </>
  );
}