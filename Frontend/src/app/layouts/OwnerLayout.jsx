import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { AppNavbar } from "../../shared/components/navigation/AppNavbar";
import { MobileSidebarDrawer } from "../../shared/components/navigation/MobileSidebarDrawer";
import { OwnerSidebar } from "../../features/owner/components/sidebar/OwnerSidebar";

export default function OwnerLayout() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <AppNavbar />
      <div dir="rtl" className="min-h-screen bg-[#eef3ff] pt-[68px]">
        <aside className="fixed inset-y-0 right-0 z-30 hidden w-[260px] overflow-y-auto border-l border-slate-200 bg-white lg:flex lg:flex-col">
          <OwnerSidebar user={user} logout={logout} />
        </aside>

        <div className="lg:mr-[260px]">
          <MobileSidebarDrawer
            open={mobileMenuOpen}
            onOpen={() => setMobileMenuOpen(true)}
            onClose={() => setMobileMenuOpen(false)}
            label="قائمة المالك"
          >
            <OwnerSidebar user={user} logout={logout} />
          </MobileSidebarDrawer>

          <main className="min-w-0 bg-white px-3 py-4 sm:px-5 sm:py-5 lg:px-6 lg:py-6">
            <Outlet context={{ user, logout }} />
          </main>
        </div>
      </div>
    </>
  );
}
