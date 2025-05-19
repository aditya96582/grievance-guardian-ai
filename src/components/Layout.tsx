
import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton 
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Mail, MessageSquare, Settings, User } from "lucide-react";

const Layout: React.FC = () => {
  const location = useLocation();
  const { pathname } = location;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar className="w-64 border-r">
          <div className="p-4 border-b flex items-center justify-between">
            <Link to="/" className="flex items-center">
              <div className="bg-government-600 text-white p-2 rounded-md mr-2">
                <Mail className="h-5 w-5" />
              </div>
              <h1 className="font-bold text-lg">Grievance Guardian</h1>
            </Link>
            <SidebarTrigger />
          </div>
          
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/" className={`flex items-center p-2 rounded-md w-full hover:bg-slate-100 ${pathname === '/' ? 'bg-slate-100 text-government-700 font-medium' : ''}`}>
                    <MessageSquare className="h-5 w-5 mr-2" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/submit" className={`flex items-center p-2 rounded-md w-full hover:bg-slate-100 ${pathname === '/submit' ? 'bg-slate-100 text-government-700 font-medium' : ''}`}>
                    <Mail className="h-5 w-5 mr-2" />
                    <span>Submit Grievance</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/admin" className={`flex items-center p-2 rounded-md w-full hover:bg-slate-100 ${pathname === '/admin' ? 'bg-slate-100 text-government-700 font-medium' : ''}`}>
                    <Settings className="h-5 w-5 mr-2" />
                    <span>Admin Panel</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/profile" className={`flex items-center p-2 rounded-md w-full hover:bg-slate-100 ${pathname === '/profile' ? 'bg-slate-100 text-government-700 font-medium' : ''}`}>
                    <User className="h-5 w-5 mr-2" />
                    <span>My Profile</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          
          <div className="mt-auto p-4 border-t">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 rounded-full bg-government-200 flex items-center justify-center text-government-700 mr-2">
                <span className="font-medium text-sm">UK</span>
              </div>
              <div>
                <p className="text-sm font-medium">Uttar Pradesh</p>
                <p className="text-xs text-gray-500">CM Helpline 1076</p>
              </div>
            </div>
            <div className="mt-2">
              <Button variant="outline" className="w-full text-xs">
                <Mail className="h-3 w-3 mr-1" />
                Contact Support
              </Button>
            </div>
          </div>
        </Sidebar>

        <main className="flex-1 overflow-auto">
          <div className="container py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
