"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, LogOut } from "lucide-react";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { AppSidebar } from "./AppSidebar";
import { createClient } from "@/supabase/client";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await createClient().auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <header className="flex h-14 items-center gap-4 border-b border-border px-4 lg:px-6">
            <SidebarTrigger className="-ml-1" />
            <div className="flex-1" />
            <div className="flex items-center gap-2">
              <Link href="/profile">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  title="Profile"
                >
                  <User className="h-5 w-5" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-destructive"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                <span>Log Out</span>
              </Button>
            </div>
          </header>
          <main className="flex-1 p-4 lg:p-6">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
