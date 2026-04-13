'use client';

import { Compass } from 'lucide-react';

import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarFooter,
  SidebarTrigger,
} from '@/components/ui/sidebar';

export default function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <Compass className="text-primary h-8 w-8 shrink-0" />
        </div>
      </SidebarHeader>

      <SidebarMenu className="flex-1" />
      
      <SidebarFooter className="p-4 hidden md:flex">
        <SidebarTrigger />
      </SidebarFooter>
    </Sidebar>
  );
}
