import { useEffect } from "react";

function MenuIcon({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function CloseIcon({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function MobileSidebarDrawer({ open, onOpen, onClose, label = "القائمة", children }) {
  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  return (
    <>
      <div className="sticky top-[68px] z-20 flex items-center justify-end border-b border-slate-200 bg-white/95 px-3 py-2 backdrop-blur lg:hidden">
        <button
          type="button"
          onClick={onOpen}
          className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 shadow-sm"
          aria-expanded={open}
          aria-label={`فتح ${label}`}
        >
          <MenuIcon />
          {label}
        </button>
      </div>

      <div className={`fixed inset-0 z-[70] lg:hidden ${open ? "pointer-events-auto" : "pointer-events-none"}`} aria-hidden={!open}>
        <button
          type="button"
          aria-label="إغلاق القائمة"
          onClick={onClose}
          className={`absolute inset-0 bg-slate-950/45 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
        />

        <aside
          dir="rtl"
          onClick={(event) => {
            if (event.target.closest("a")) onClose();
          }}
          className={`absolute inset-y-0 right-0 flex w-[min(86vw,320px)] flex-col overflow-y-auto bg-white shadow-2xl transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <span className="text-sm font-black text-slate-800">{label}</span>
            <button
              type="button"
              onClick={onClose}
              className="grid h-10 w-10 place-items-center rounded-xl text-slate-600 hover:bg-slate-100"
              aria-label="إغلاق القائمة"
            >
              <CloseIcon />
            </button>
          </div>
          <div className="min-h-0 flex-1">{children}</div>
        </aside>
      </div>
    </>
  );
}
