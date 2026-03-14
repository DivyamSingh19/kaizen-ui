"use client"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { LogOutIcon } from "lucide-react"
import { logout } from "@/functions/api/auth"

export function NavLogout() {
  const handleLogout = async () => {
    try {
      await logout()
      window.location.href = "/login"
    } catch (error) {
      console.error("Logout failed:", error)
      window.location.href = "/login"
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          onClick={handleLogout}
          className="text-red-400 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200 justify-center group-data-[collapsible=icon]:justify-center"
        >
          <LogOutIcon className="size-4 shrink-0" />
          <span className="font-semibold tracking-tight group-data-[collapsible=icon]:hidden">
            Logout
          </span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
