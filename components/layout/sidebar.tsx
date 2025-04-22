"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  CheckSquare,
  FileText,
  Calendar,
  Users,
  BarChart,
  Building2,
  MessageSquare,
  HelpCircle,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export function Sidebar({ open, setOpen }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div
      className={cn(
        "relative border-r border-border flex flex-col transition-all duration-300 ease-in-out bg-card h-screen",
        open ? "w-64" : "w-16", // Fixed width for both states
      )}
    >
      <div className="p-4 border-b border-border relative z-10 flex items-center justify-between">
        <div className="flex items-center overflow-hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6 text-primary flex-shrink-0"
          >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
          {open && <span className="font-semibold text-lg text-foreground ml-2 transition-opacity duration-300">Sodo Hospital</span>}
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
          aria-label={open ? "Close sidebar" : "Open sidebar"}
        >
          {open ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 relative z-10">
        <ul className="space-y-1 px-2">
          <NavItem
            href="/"
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
            active={pathname === "/"}
            collapsed={!open}
          />
          <NavItem
            href="/tasks"
            icon={<CheckSquare size={20} />}
            label="Tasks"
            active={pathname.startsWith("/tasks")}
            collapsed={!open}
          />
          <NavItem
            href="/documents"
            icon={<FileText size={20} />}
            label="Documents"
            active={pathname.startsWith("/documents")}
            collapsed={!open}
          />
          <NavItem
            href="/calendar"
            icon={<Calendar size={20} />}
            label="Calendar"
            active={pathname.startsWith("/calendar")}
            collapsed={!open}
          />
          <NavItem
            href="/teams"
            icon={<Users size={20} />}
            label="Teams"
            active={pathname.startsWith("/teams")}
            collapsed={!open}
          />
          <NavItem
            href="/reports"
            icon={<BarChart size={20} />}
            label="Reports"
            active={pathname.startsWith("/reports")}
            collapsed={!open}
          />
          <NavItem
            href="/departments"
            icon={<Building2 size={20} />}
            label="Departments"
            active={pathname.startsWith("/departments")}
            collapsed={!open}
          />
          <NavItem
            href="/chat"
            icon={<MessageSquare size={20} />}
            label="Chat"
            active={pathname.startsWith("/chat")}
            collapsed={!open}
          />
          <NavItem
            href="/help"
            icon={<HelpCircle size={20} />}
            label="Help"
            active={pathname.startsWith("/help")}
            collapsed={!open}
          />
          <NavItem
            href="/settings"
            icon={<Settings size={20} />}
            label="Settings"
            active={pathname.startsWith("/settings")}
            collapsed={!open}
          />
        </ul>
      </nav>
    </div>
  )
}

interface NavItemProps {
  href: string
  label: string
  icon: React.ReactNode
  active?: boolean
  collapsed: boolean
}

function NavItem({ href, label, icon, active, collapsed }: NavItemProps) {
  return (
    <li>
      <Link
        href={href}
        className={cn(
          "flex items-center px-4 py-2 text-sm rounded-md relative group",
          active
            ? "bg-primary/10 text-primary font-medium"
            : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
          collapsed && "justify-center px-2"
        )}
        title={collapsed ? label : undefined}
      >
        <span className={cn("flex-shrink-0", active ? "text-primary" : "text-muted-foreground", collapsed ? "mr-0" : "mr-3")}>
          {icon}
        </span>
        {!collapsed && <span className={active ? "text-primary" : ""}>{label}</span>}

        {collapsed && (
          <span className="absolute left-full ml-2 rounded bg-foreground/90 px-2 py-1 text-xs text-background opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
            {label}
          </span>
        )}
      </Link>
    </li>
  )
}
