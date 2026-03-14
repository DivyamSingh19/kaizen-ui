import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { WalletButton } from "@/components/WalletButton";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    
    <SidebarProvider>
 
      <div className="flex h-screen overflow-hidden w-full">
        <AppSidebar />
        <SidebarInset className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <header className="bg-background/80 backdrop-blur-md sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between gap-2 border-b px-6">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
            </div>
            
            <div className="flex items-center gap-4">
               <WalletButton />
            </div>
          </header>

          <main className="flex-1 overflow-y-auto w-full custom-scrollbar">
            <div className="flex-1 p-6 md:p-10 min-h-full">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>
    
    </SidebarProvider>
  );
}
