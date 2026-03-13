import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset,SidebarProvider } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
 
      <div className="flex h-screen overflow-hidden w-screen">
        <AppSidebar />
        <SidebarInset className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <header className="bg-background/80 backdrop-blur-md sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b px-6">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
          </header>

          <main className="flex-1 overflow-y-auto w-full custom-scrollbar">
            <div className="w-full mx-auto p-6 md:p-8 space-y-8 min-h-full">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>
    
    </SidebarProvider>
  );
}
