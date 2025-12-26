"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Sidebar Context
const SidebarContext = React.createContext<{
  state: "expanded" | "collapsed";
  setState: (state: "expanded" | "collapsed") => void;
}>({
  state: "expanded",
  setState: () => {},
});

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within SidebarProvider");
  }
  return context;
}

// Sidebar Provider
export function SidebarProvider({
  children,
  defaultState = "expanded",
}: {
  children: React.ReactNode;
  defaultState?: "expanded" | "collapsed";
}) {
  const [state, setState] = React.useState<"expanded" | "collapsed">(defaultState);

  return (
    <SidebarContext.Provider value={{ state, setState }}>
      {children}
    </SidebarContext.Provider>
  );
}

// Sidebar Component
const sidebarVariants = cva(
  "group peer fixed inset-y-0 left-0 z-50 hidden w-64 shrink-0 border-r border-border bg-sidebar transition-all duration-300 ease-in-out data-[state=collapsed]:w-16 lg:flex flex-col",
  {
    variants: {
      variant: {
        sidebar: "",
        floating: "m-2 rounded-lg border",
        inset: "border-0",
      },
    },
    defaultVariants: {
      variant: "sidebar",
    },
  }
);

export interface SidebarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sidebarVariants> {
  collapsible?: "offcanvas" | "icon" | "none";
}

export function Sidebar({
  className,
  variant,
  ...props
}: SidebarProps) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <div
      className={cn(sidebarVariants({ variant }), className)}
      data-state={isCollapsed ? "collapsed" : "expanded"}
      {...props}
    />
  );
}

// Sidebar Header
export function SidebarHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex h-16 shrink-0 items-center border-b border-border px-4", className)}
      {...props}
    />
  );
}

// Sidebar Content
export function SidebarContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex-1 overflow-y-auto overflow-x-hidden px-3 py-4", className)}
      {...props}
    />
  );
}

// Sidebar Footer
export function SidebarFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex shrink-0 border-t border-border p-4", className)}
      {...props}
    />
  );
}

// Sidebar Group
export function SidebarGroup({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("space-y-1", className)} {...props} />;
}

// Sidebar Group Label
export function SidebarGroupLabel({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  if (isCollapsed) return null;

  return (
    <div
      className={cn("px-2 py-1.5 text-xs font-semibold text-muted-foreground", className)}
      {...props}
    />
  );
}

// Sidebar Group Content
export function SidebarGroupContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("space-y-0.5", className)} {...props} />;
}

// Sidebar Menu
export function SidebarMenu({
  className,
  ...props
}: React.HTMLAttributes<HTMLUListElement>) {
  return <ul className={cn("space-y-0.5", className)} {...props} />;
}

// Sidebar Menu Item
export function SidebarMenuItem({
  className,
  ...props
}: React.HTMLAttributes<HTMLLIElement>) {
  return <li className={cn("", className)} {...props} />;
}

// Sidebar Menu Button
const sidebarMenuButtonVariants = cva(
  "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring disabled:pointer-events-none disabled:opacity-50 aria-[current=page]:bg-sidebar-accent aria-[current=page]:text-sidebar-accent-foreground [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "",
        outline:
          "border border-sidebar-border bg-sidebar-background shadow-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface SidebarMenuButtonProps
  extends React.ComponentPropsWithoutRef<"button">,
    VariantProps<typeof sidebarMenuButtonVariants> {
  asChild?: boolean;
  isActive?: boolean;
  tooltip?: string;
}

export const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  SidebarMenuButtonProps
>(({ className, variant, asChild = false, isActive, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      ref={ref}
      className={cn(sidebarMenuButtonVariants({ variant }), className)}
      aria-current={isActive ? "page" : undefined}
      {...props}
    />
  );
});
SidebarMenuButton.displayName = "SidebarMenuButton";

// Sidebar Inset
export function SidebarInset({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <div
      className={cn(
        "flex w-full flex-col transition-all duration-300 ease-in-out",
        isCollapsed ? "lg:pl-16" : "lg:pl-64",
        className
      )}
      {...props}
    />
  );
}

// Sidebar Trigger
export function SidebarTrigger({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { state, setState } = useSidebar();

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md p-2 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      onClick={() => setState(state === "expanded" ? "collapsed" : "expanded")}
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="M9 3v18" />
        <path d="M9 3h6" />
      </svg>
      <span className="sr-only">Toggle sidebar</span>
    </button>
  );
}

