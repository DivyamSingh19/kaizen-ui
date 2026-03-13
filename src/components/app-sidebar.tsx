"use client"

import * as React from "react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { LayoutDashboardIcon, FolderIcon, Settings2Icon, CircleHelpIcon, SearchIcon, DatabaseIcon, FileChartColumnIcon, FileIcon, CommandIcon, ActivityIcon, WebhookIcon } from "lucide-react"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: (
        <LayoutDashboardIcon
        />
      ),
    },
    {
      title: "Projects",
      url: "/dashboard/projects",
      icon: (
        <FolderIcon
        />
      ),
    },
    {
      title: "Monitoring",
      url: "/dashboard/monitoring",
      icon: (
        <ActivityIcon
        />
      ),
    },
    {
      title: "Webhooks",
      url: "/dashboard/webhooks",
      icon: (
        <WebhookIcon
        />
      ),
    },
  ],
  navClouds: [],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: (
        <Settings2Icon
        />
      ),
    },
    {
      title: "Get Help",
      url: "#",
      icon: (
        <CircleHelpIcon
        />
      ),
    },
    {
      title: "Search",
      url: "#",
      icon: (
        <SearchIcon
        />
      ),
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: (
        <DatabaseIcon
        />
      ),
    },
    {
      name: "Reports",
      url: "#",
      icon: (
        <FileChartColumnIcon
        />
      ),
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: (
        <FileIcon
        />
      ),
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar 
      collapsible="none" 
      className="w-[260px] border-r bg-sidebar/50 backdrop-blur-xl"
      {...props}
    >
      <SidebarHeader className="h-14 border-b flex items-center px-6">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="hover:bg-transparent active:bg-transparent"
            >
              <a href="/dashboard" className="flex items-center gap-3">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                  <CommandIcon className="size-5" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-bold tracking-tight text-white uppercase">Kaizen UI</span>
                  <span className="truncate text-[10px] text-muted-foreground uppercase tracking-widest">Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      
      <SidebarContent className="py-4 px-2 space-y-6">
        <NavMain items={data.navMain} />
        
        <div className="px-4">
          <div className="h-px bg-white/5" />
        </div>

        <NavDocuments items={data.documents} />
        
        <NavSecondary items={data.navSecondary} className="mt-auto pt-4 border-t border-white/5" />
      </SidebarContent>

      <SidebarFooter className="border-t bg-sidebar/30 p-2">
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
