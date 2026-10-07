import { Link } from 'react-router-dom'
import logo from "../../../../images/logo.png";

export function AuthCard({ title, subtitle, activeTab, children, footer }) {
  return (
    <section className="w-full max-w-[466px] overflow-hidden rounded-2xl bg-white shadow-2xl shadow-black/30 sm:rounded-[26px]">
      <div className="bg-[#075ed8] px-5 pb-5 pt-6 text-center text-white sm:px-8 sm:pb-6 sm:pt-8">
        <img src={logo} alt="مرافق" className="mx-auto h-16 w-auto object-contain" />
        <h1 className="mt-4 text-xl font-black leading-tight sm:text-2xl">{title}</h1>
        <p className="mt-2 text-sm font-medium text-blue-100">{subtitle}</p>

        {activeTab ? (
          <div className="mt-6 grid grid-cols-2 rounded-xl bg-white/14 p-1">
          <Link
            to="/login"
            className={`rounded-lg px-4 py-3 text-sm font-black transition ${
              activeTab === "login"
                ? "bg-white text-[#075ed8] shadow-sm"
                : "text-blue-100 hover:text-white"
            }`}
          >
            تسجيل الدخول
          </Link>
          <Link
            to="/register"
            className={`rounded-lg px-4 py-3 text-sm font-black transition ${
              activeTab === "register"
                ? "bg-white text-[#075ed8] shadow-sm"
                : "text-blue-100 hover:text-white"
            }`}
          >
            إنشاء حساب
          </Link>
          </div>
        ) : null}
      </div>

      <div className="px-4 py-6 sm:px-10 sm:py-7">{children}</div>
      {footer ? (
        <div className="border-t border-slate-100 px-6 py-5 text-center text-sm text-slate-500 sm:px-10">
          {footer}
        </div>
      ) : null}
    </section>
  );
}
