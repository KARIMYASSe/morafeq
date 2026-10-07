import { useState } from "react";
import { Outlet } from "react-router-dom";
import { AppNavbar } from "../../shared/components/navigation/AppNavbar";
import { MobileSidebarDrawer } from "../../shared/components/navigation/MobileSidebarDrawer";
import { ExpatriateSidebar } from "../../features/expatriate/components/sidebar/ExpatriateSidebar";

export default function ExpatriateLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <AppNavbar />
      <div dir="rtl" className="min-h-screen bg-[#F4F7FE] pt-[68px]">
        <aside className="fixed inset-y-0 right-0 z-30 hidden w-[220px] overflow-y-auto border-l border-slate-200 bg-white lg:flex lg:flex-col">
          <ExpatriateSidebar />
        </aside>

        <div className="lg:mr-[220px]">
          <MobileSidebarDrawer
            open={mobileMenuOpen}
            onOpen={() => setMobileMenuOpen(true)}
            onClose={() => setMobileMenuOpen(false)}
            label="قائمة الطالب"
          >
            <ExpatriateSidebar />
          </MobileSidebarDrawer>

          <main className="min-w-0 px-3 py-4 sm:px-5 sm:py-5 lg:px-6 lg:py-6">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}
