import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { AppNavbar } from "../../shared/components/navigation/AppNavbar";
import { MobileSidebarDrawer } from "../../shared/components/navigation/MobileSidebarDrawer";
import { AdminSidebar } from "../../features/admin/components/AdminSidebar";

export function AdminLayout() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <AppNavbar />
      <div dir="rtl" className="min-h-screen bg-slate-50 pt-[68px]">
        <aside className="fixed inset-y-0 right-0 z-30 hidden w-[240px] overflow-y-auto border-l border-slate-200 bg-white lg:flex lg:flex-col">
          <AdminSidebar user={user} logout={logout} />
        </aside>

        <div className="lg:mr-[240px]">
          <MobileSidebarDrawer
            open={mobileMenuOpen}
            onOpen={() => setMobileMenuOpen(true)}
            onClose={() => setMobileMenuOpen(false)}
            label="لوحة الإدارة"
          >
            <AdminSidebar user={user} logout={logout} />
          </MobileSidebarDrawer>

          <main className="min-w-0 bg-slate-50 px-3 py-4 sm:px-5 sm:py-5 lg:px-6 lg:py-6">
            <Outlet context={{ user, logout }} />
          </main>
        </div>
      </div>
    </>
  );
}
