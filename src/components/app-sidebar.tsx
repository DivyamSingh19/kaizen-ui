"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import { NavLogout } from "@/components/nav-logout";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  LayoutDashboardIcon,
  FolderIcon,
  Settings2Icon,
  CircleHelpIcon,
  SearchIcon,
  DatabaseIcon,
  FileChartColumnIcon,
  FileIcon,
  CommandIcon,
  ActivityIcon,
  WebhookIcon,
  Crosshair,
  ShieldCheckIcon,
} from "lucide-react";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "Projects",
      url: "/dashboard/projects",
      icon: <FolderIcon />,
    },
    {
      title: "Monitoring",
      url: "/dashboard/monitoring",
      icon: <ActivityIcon />,
    },
    {
      title: "Webhooks",
      url: "/dashboard/webhooks",
      icon: <WebhookIcon />,
    },
    {
      title: "Stats",
      url: "/dashboard/stats",
      icon: <Settings2Icon />,
    },
    {
      title: "Timelock",
      url: "/dashboard/timelock",
      icon: <ShieldCheckIcon />,
    },
    {
      title: "Kill switch",
      url: "/dashboard/killswitch",
      icon: <ShieldCheckIcon />,
    },
  ],
  navClouds: [],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      collapsible="icon"
      className="border-r bg-sidebar/50 backdrop-blur-xl"
      {...props}
    >
      <SidebarHeader className="h-14 border-b flex items-center group-data-[collapsible=icon]:px-0 px-6">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="hover:bg-transparent active:bg-transparent group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center"
            >
              <Link href="/dashboard" className="flex items-center gap-3">
                <div className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg  text-primary-foreground ">
                  <Image
                    src="/kaizen-white.png"
                    alt="Kaizen Logo"
                    width={20}
                    height={20}
                    className="object-contain"
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                    Kaizen
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="py-4 space-y-6 group-data-[collapsible=icon]:px-0 px-2 overflow-x-hidden">
        <NavMain items={data.navMain} />

        <div className="px-4 group-data-[collapsible=icon]:hidden">
          <div className="h-px bg-white/5" />
        </div>

        {/* <NavDocuments items={data.documents} /> */}

        {/* <NavSecondary items={data.navSecondary} className="mt-auto pt-4 border-t border-white/5 group-data-[collapsible=icon]:border-t-0" /> */}
      </SidebarContent>

      <SidebarFooter className="border-t bg-sidebar/30 p-2 gap-1 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center">
        <NavUser />
        <NavLogout />
      </SidebarFooter>
    </Sidebar>
  );
}
