import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";
import { useListings } from "../hooks/useListings";
import { ListingCard } from "../components/home/ListingCard";
import { ListingsGrid } from "../components/home/ListingsGrid";
import { useFavoriteToggle } from "../../favorites/hooks/useFavoriteToggle";
import { useFavorites } from "../../favorites/hooks/useFavorites";
import { useBooking } from "../../bookings/hooks/useBooking";
import { useProfile } from "../../profile/hooks/useProfile";
import { useGuestReviews } from "../../reviews/hooks/useGuestReviews";
import { useChatContext } from "../../chat/context/ChatContext";

export function ExpatriateHomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { listings, meta, loading, error, fetchListings } = useListings();
  const { total: favoritesTotal } = useFavorites({ limit: 3 });
  const { bookings, loading: bookingsLoading, fetchBookings } = useBooking();
  const { profile, completeness } = useProfile();
  const { meta: reviewMeta } = useGuestReviews(user?.id);
  const { conversations, isLoading: messagesLoading } = useChatContext();
  const [displayListings, setDisplayListings] = useState([]);

  useEffect(() => {
    setDisplayListings(listings);
  }, [listings]);

  const handleFavoriteChanged = useCallback((listingId, isFavorited) => {
    setDisplayListings((prev) =>
      prev.map((listing) =>
        listing.id === listingId ? { ...listing, isFavorited } : listing,
      ),
    );
  }, []);

  const { pendingIds, toggleFavorite } = useFavoriteToggle({
    onChanged: handleFavoriteChanged,
  });

  useEffect(() => {
    fetchListings({ limit: 6 });
    fetchBookings();
  }, [fetchBookings, fetchListings]);

  const metrics = useMemo(
    () => buildDashboardMetrics(bookings, profile, completeness),
    [bookings, completeness, profile],
  );

  return (
    <>
      <div dir="rtl" className="lg:hidden">
        <MobileHome
          firstName={user?.firstName}
          totalListings={meta?.total ?? 0}
          favoritesTotal={favoritesTotal}
          metrics={metrics}
          currentBooking={metrics.currentBooking}
          listings={displayListings}
          loading={loading}
          error={error}
          pendingIds={pendingIds}
          toggleFavorite={toggleFavorite}
          onNavigate={navigate}
        />
      </div>

      <div dir="rtl" className="mx-auto hidden max-w-6xl space-y-6 lg:block">
        <section className="grid gap-5 xl:grid-cols-[2.1fr_1fr_1fr]">
          <DashboardWelcome
            firstName={user?.firstName}
            totalListings={meta?.total ?? 0}
            activeBookings={metrics.activeBookings}
          />
          <StatCard
            title="الشقق المحفوظة"
            value={favoritesTotal.toLocaleString("ar-EG")}
            subtitle="وصول سريع للمفضلة"
            tone="emerald"
            to="/expatriate/favorites"
          />
          <StatCard
            title={bookingsLoading ? "جاري تحميل الحجوزات" : "طلبات الحجز"}
            value={metrics.pendingBookings.toLocaleString("ar-EG")}
            subtitle="طلبات معلقة"
            tone="amber"
            to="/expatriate/bookings"
          />
        </section>

        <section className="grid gap-5 lg:grid-cols-1">
          <CurrentBookingCard booking={metrics.currentBooking} />
        </section>

        <section className="grid gap-5 lg:grid-cols-[1fr_1fr]">
          <BookingsOverview metrics={metrics} />
          <ReviewsCard meta={reviewMeta} />
        </section>

        <QuickActions onNavigate={navigate} />
        <MessagesAndAiCard
          conversations={conversations}
          loading={messagesLoading}
        />

        <section className="rounded-[24px] border border-[#E5EBF6] bg-white p-5 shadow-[0_14px_32px_rgba(31,57,104,0.08)]">
          <ListingsGrid
            listings={displayListings}
            loading={loading}
            error={error}
            title="ترشيحات السكن"
            subtitle="أحدث الوحدات المتاحة من بيانات المنصة"
            onFavoriteToggle={toggleFavorite}
            pendingFavoriteIds={pendingIds}
          />
        </section>
      </div>
    </>
  );
}

function MobileHome({
  firstName,
  favoritesTotal,
  metrics,
  currentBooking,
  listings,
  loading,
  error,
  pendingIds,
  toggleFavorite,
  onNavigate,
}) {
  const categoryCards = [
    {
      title: "السكن الطلابي",
      subtitle: "اعثر على شقة أو غرفة مناسبة لك",
      icon: "🏠",
      path: "/expatriate/search",
      className: "from-blue-50 to-indigo-50 text-[#163b77]",
      buttonClass: "bg-[#1769e8] text-white",
    },
    {
      title: "زملاء السكن",
      subtitle: "جهّز بيانات التوافق واكتشف الأنسب",
      icon: "👥",
      path: "/expatriate/profile/roommate-profile",
      className: "from-sky-50 to-blue-50 text-[#163b77]",
      buttonClass: "bg-blue-100 text-[#1769e8]",
    },
    {
      title: "المناطق المميزة",
      subtitle: "استكشف السكن الأقرب لجامعتك",
      icon: "📍",
      path: "/expatriate/search",
      className: "from-emerald-50 to-green-50 text-[#174f3a]",
      buttonClass: "bg-emerald-100 text-emerald-700",
    },
  ];

  const filterChips = [
    ["📍", "المدينة"],
    ["💳", "الميزانية"],
    ["👥", "النوع"],
    ["🛏️", "نوع الغرفة"],
  ];

  return (
    <div className="-mx-3 -mt-4 min-h-screen overflow-hidden bg-white pb-24 sm:-mx-5 sm:-mt-5">
      <section className="relative overflow-hidden px-5 pb-6 pt-5">
        <div className="pointer-events-none absolute -left-20 top-12 h-64 w-64 rounded-full bg-blue-100/60 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 top-44 h-44 w-44 rounded-full bg-emerald-100/50 blur-3xl" />

        <div className="relative rounded-[30px] border border-blue-50 bg-gradient-to-br from-white via-[#f8fbff] to-[#edf5ff] p-5 shadow-[0_20px_50px_rgba(25,75,150,0.10)]">
          <div className="flex items-start justify-between gap-3">
            <div className="max-w-[68%]">
              <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-[11px] font-black text-[#1769e8]">
                أهلاً {firstName || "بك"} 👋
              </span>
              <h1 className="mt-3 text-[28px] font-black leading-[1.25] text-[#10244d]">
                مستقبلك يبدأ
                <span className="block text-[#1769e8]">من مكان مريح</span>
              </h1>
              <p className="mt-3 text-xs font-semibold leading-6 text-slate-500">
                اكتشف أفضل سكن طلابي بالقرب من جامعتك بسهولة وأمان مع مرافق.
              </p>
            </div>

            <div className="relative mt-3 grid h-28 w-28 shrink-0 place-items-center rounded-[32px] bg-gradient-to-br from-blue-100 to-white shadow-inner">
              <div className="absolute -left-2 top-1 grid h-10 w-10 place-items-center rounded-full bg-white text-xl shadow-lg">
                🏡
              </div>
              <div className="text-[58px] drop-shadow-sm">🏢</div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate("/expatriate/search")}
            className="mt-5 flex w-full items-center gap-3 rounded-2xl border border-white bg-white px-4 py-4 text-right shadow-[0_10px_28px_rgba(27,70,140,0.12)]"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-xl">
              ⌕
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-xs font-black text-[#10244d]">
                ابحث عن سكن طلابي
              </span>
              <span className="mt-1 block truncate text-[11px] font-semibold text-slate-400">
                المدينة، الجامعة أو المنطقة...
              </span>
            </span>
            <span className="rounded-xl bg-[#1769e8] px-3 py-2 text-xs font-black text-white">
              بحث
            </span>
          </button>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {filterChips.map(([icon, label]) => (
            <button
              key={label}
              type="button"
              onClick={() => onNavigate("/expatriate/search")}
              className="flex shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-[11px] font-black text-slate-600 shadow-sm"
            >
              <span>{icon}</span>
              <span>{label}</span>
              <span className="text-slate-300">⌄</span>
            </button>
          ))}
        </div>
      </section>

      <section className="px-5 pb-6">
        <div className="grid grid-cols-3 gap-2.5">
          {categoryCards.map((card) => (
            <button
              key={card.title}
              type="button"
              onClick={() => onNavigate(card.path)}
              className={`min-h-[152px] rounded-[24px] bg-gradient-to-br p-3 text-right shadow-[0_12px_28px_rgba(27,70,140,0.07)] ${card.className}`}
            >
              <span className="text-3xl">{card.icon}</span>
              <h2 className="mt-3 text-[13px] font-black leading-5">
                {card.title}
              </h2>
              <p className="mt-1 min-h-[42px] text-[9px] font-bold leading-[18px] opacity-65">
                {card.subtitle}
              </p>
              <span
                className={`mt-2 grid h-8 w-8 place-items-center rounded-full text-base font-black ${card.buttonClass}`}
              >
                ‹
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="px-5 pb-6">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-black text-[#10244d]">
              🔥 عقارات مميزة
            </h2>
            <p className="mt-1 text-[11px] font-semibold text-slate-400">
              أحدث الوحدات المتاحة على المنصة
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate("/expatriate/search")}
            className="text-xs font-black text-[#1769e8]"
          >
            عرض الكل ‹
          </button>
        </div>

        {loading ? (
          <div className="grid h-48 place-items-center rounded-3xl bg-slate-50 text-sm font-black text-slate-400">
            جاري تحميل العقارات...
          </div>
        ) : error ? (
          <div className="rounded-3xl bg-red-50 p-5 text-center text-xs font-black text-red-500">
            تعذر تحميل العقارات حالياً.
          </div>
        ) : listings.length === 0 ? (
          <div className="rounded-3xl bg-slate-50 p-6 text-center text-xs font-black text-slate-400">
            لا توجد عقارات متاحة حالياً.
          </div>
        ) : (
          <div className="flex snap-x gap-3 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {listings.slice(0, 5).map((listing) => (
              <div
                key={listing.id}
                className="w-[78vw] max-w-[300px] shrink-0 snap-start"
              >
                <ListingCard
                  listing={listing}
                  onFavoriteToggle={toggleFavorite}
                  favoritePending={pendingIds.includes(listing.id)}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="px-5 pb-6">
        <div className="grid grid-cols-2 gap-3">
          <Link
            to="/expatriate/favorites"
            className="rounded-[22px] border border-[#e5ebf6] bg-white p-4 shadow-[0_10px_26px_rgba(31,57,104,0.07)]"
          >
            <div className="flex items-center justify-between">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-rose-50">
                ♡
              </span>
              <span className="text-2xl font-black text-[#10244d]">
                {Number(favoritesTotal || 0).toLocaleString("ar-EG")}
              </span>
            </div>
            <p className="mt-3 text-xs font-black text-[#10244d]">المفضلة</p>
            <p className="mt-1 text-[10px] font-semibold text-slate-400">
              وصول سريع للوحدات المحفوظة
            </p>
          </Link>

          <Link
            to="/expatriate/bookings"
            className="rounded-[22px] border border-[#e5ebf6] bg-white p-4 shadow-[0_10px_26px_rgba(31,57,104,0.07)]"
          >
            <div className="flex items-center justify-between">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-amber-50">
                ▣
              </span>
              <span className="text-2xl font-black text-[#10244d]">
                {metrics.pendingBookings.toLocaleString("ar-EG")}
              </span>
            </div>
            <p className="mt-3 text-xs font-black text-[#10244d]">
              طلبات الحجز
            </p>
            <p className="mt-1 text-[10px] font-semibold text-slate-400">
              تابع حالة طلباتك الحالية
            </p>
          </Link>
        </div>

        {currentBooking && (
          <Link
            to={`/expatriate/bookings/${currentBooking.id}`}
            className="mt-3 flex items-center justify-between rounded-[22px] bg-gradient-to-l from-[#1769e8] to-[#1958c7] p-4 text-white shadow-[0_14px_32px_rgba(23,105,232,0.20)]"
          >
            <div>
              <p className="text-xs font-black">حجزك الحالي</p>
              <p className="mt-1 text-[10px] font-semibold text-white/70">
                {getBookingStatusLabel(currentBooking.status)}
              </p>
            </div>
            <span className="rounded-xl bg-white/15 px-3 py-2 text-xs font-black">
              التفاصيل ‹
            </span>
          </Link>
        )}
      </section>

      <section className="px-5 pb-6">
        <div className="rounded-[28px] bg-gradient-to-br from-[#f6f9ff] to-white p-5 shadow-[0_12px_30px_rgba(31,57,104,0.06)] ring-1 ring-blue-50">
          <div className="text-center">
            <h2 className="text-xl font-black text-[#10244d]">ابدأ بسهولة</h2>
            <p className="mt-1 text-[11px] font-semibold text-slate-400">
              3 خطوات فقط لتجد سكنك المناسب
            </p>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-2 text-center">
            {[
              ["1", "⌕", "ابحث عن السكن"],
              ["2", "▤", "استعرض الخيارات"],
              ["3", "✓", "تواصل واحجز"],
            ].map(([number, icon, label]) => (
              <div key={number}>
                <div className="relative mx-auto grid h-12 w-12 place-items-center rounded-full bg-blue-50 text-lg font-black text-[#1769e8]">
                  {icon}
                  <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-[#1769e8] text-[9px] text-white">
                    {number}
                  </span>
                </div>
                <p className="mt-2 text-[10px] font-black text-[#10244d]">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pb-4">
        <div className="flex items-center gap-3 rounded-[22px] bg-emerald-50 px-4 py-4 text-emerald-800 ring-1 ring-emerald-100">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-emerald-100 text-xl">
            ✓
          </span>
          <div>
            <p className="text-sm font-black">منصة موثوقة وآمنة</p>
            <p className="mt-1 text-[10px] font-semibold leading-5 text-emerald-700/70">
              نساعدك في الوصول إلى تجربة سكن أكثر أماناً ووضوحاً.
            </p>
          </div>
        </div>
      </section>

      <MobileBottomNav />
    </div>
  );
}

function MobileBottomNav() {
  const items = [
    ["⌂", "الرئيسية", "/expatriate"],
    ["▤", "العقارات", "/expatriate/search"],
    ["◯", "الرسائل", "/expatriate/messages"],
    ["♡", "المفضلة", "/expatriate/favorites"],
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-100 bg-white/95 px-4 pb-[max(10px,env(safe-area-inset-bottom))] pt-2 shadow-[0_-10px_30px_rgba(22,52,100,0.08)] backdrop-blur lg:hidden">
      <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
        {items.map(([icon, label, path], index) => (
          <Link
            key={path}
            to={path}
            className={`flex flex-col items-center gap-1 rounded-xl py-1.5 text-[10px] font-black ${
              index === 0 ? "bg-blue-50 text-[#1769e8]" : "text-slate-500"
            }`}
          >
            <span className="text-xl leading-none">{icon}</span>
            <span>{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

function buildDashboardMetrics(bookings, profile, completeness) {
  const activeStatuses = ["PENDING_PAYMENT", "CHECK_IN_PENDING", "COMPLETED"];
  const rejectedStatuses = [
    "REJECTED",
    "CANCELLED_BY_GUEST",
    "CANCELLED_BY_HOST",
    "CANCELED",
    "EXPIRED",
    "REFUNDED",
    "CANCELLED_AFTER_DISPUTE",
  ];

  return {
    activeBookings: bookings.filter((booking) =>
      activeStatuses.includes(booking.status),
    ).length,
    pendingBookings: bookings.filter((booking) =>
      ["PENDING_HOST_APPROVAL", "PENDING_PAYMENT"].includes(booking.status),
    ).length,
    acceptedBookings: bookings.filter((booking) =>
      activeStatuses.includes(booking.status),
    ).length,
    rejectedBookings: bookings.filter((booking) =>
      rejectedStatuses.includes(booking.status),
    ).length,
    currentBooking:
      bookings.find((booking) => activeStatuses.includes(booking.status)) ??
      bookings[0] ??
      null,
    roommateProfileCompleted: profile?.roommateProfileCompleted || false,
    completeness,
  };
}

function DashboardWelcome({ firstName, totalListings, activeBookings }) {
  const today = new Date().toLocaleDateString("ar-EG", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <section className="relative min-h-[150px] overflow-hidden rounded-[24px] bg-[#1f5bd7] px-6 py-6 text-white shadow-[0_18px_36px_rgba(31,91,215,0.22)]">
      <div className="pointer-events-none absolute -bottom-16 -right-10 h-44 w-44 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute bottom-0 left-8 h-24 w-24 rounded-full bg-[#0b4779]/30" />
      <div className="relative">
        <h1 className="text-2xl font-black">
          مساء الخير، {firstName ?? "مرحباً"}!
        </h1>
        <p className="mt-2 text-sm font-semibold text-white/75">
          ابحث عن سكنك المثالي بسهولة وأمان - {today}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <span className="rounded-full bg-white/15 px-4 py-2 text-xs font-black text-white ring-1 ring-white/10 backdrop-blur">
            {Number(totalListings || 0).toLocaleString("ar-EG")} شقة متاحة
          </span>
          <span className="rounded-full bg-white/15 px-4 py-2 text-xs font-black text-white ring-1 ring-white/10 backdrop-blur">
            {activeBookings.toLocaleString("ar-EG")} حجوزات حالية
          </span>
        </div>
      </div>
    </section>
  );
}

function StatCard({ title, value, subtitle, tone, to }) {
  const toneClass = {
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    blue: "bg-blue-50 text-[#1f5bd7]",
  }[tone];

  return (
    <Link
      to={to}
      className="rounded-[22px] border border-[#E5EBF6] bg-white p-5 shadow-[0_14px_32px_rgba(31,57,104,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(31,57,104,0.12)]"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-slate-400">{title}</p>
          <p className="mt-4 text-3xl font-black text-[#111D35]">{value}</p>
        </div>
        <span
          className={`grid h-10 w-10 place-items-center rounded-2xl ${toneClass}`}
        >
          <span className="h-2.5 w-2.5 rounded-full bg-current" />
        </span>
      </div>
      <p className="mt-1 text-xs font-semibold text-slate-500">{subtitle}</p>
    </Link>
  );
}

function CurrentBookingCard({ booking }) {
  const listing = booking?.listing;

  return (
    <section className="rounded-[24px] border border-[#E5EBF6] bg-white p-5 shadow-[0_14px_32px_rgba(31,57,104,0.08)]">
      <SectionTitle title="حجزي الحالي" subtitle="آخر حالة حجز متاحة" />
      {booking ? (
        <div className="mt-5 rounded-2xl bg-[#F6F8FE] p-4">
          <p className="text-sm font-black text-[#111D35]">
            {listing?.title || "حجز سكن"}
          </p>
          <p className="mt-1 text-xs font-semibold text-slate-500">
            {getBookingStatusLabel(booking.status)}
          </p>
          <Link
            to={`/expatriate/bookings/${booking.id}`}
            className="mt-4 block h-10 rounded-xl border border-[#C9D8FF] px-4 py-2 text-center text-sm font-black text-[#1f5bd7]"
          >
            عرض التفاصيل
          </Link>
        </div>
      ) : (
        <EmptyHint text="لا توجد حجوزات حالية حتى الآن." />
      )}
    </section>
  );
}

function BookingsOverview({ metrics }) {
  return (
    <section className="rounded-[24px] border border-[#E5EBF6] bg-white p-5 shadow-[0_14px_32px_rgba(31,57,104,0.08)]">
      <SectionTitle title="الحجوزات" subtitle="ملخص الطلبات" />
      <div className="mt-5 grid grid-cols-2 gap-3">
        <MiniStat label="الحالية" value={metrics.activeBookings} />
        <MiniStat label="المعلقة" value={metrics.pendingBookings} />
        <MiniStat label="المقبولة" value={metrics.acceptedBookings} />
        <MiniStat label="المرفوضة" value={metrics.rejectedBookings} />
      </div>
    </section>
  );
}

function ReviewsCard({ meta }) {
  return (
    <section className="rounded-[24px] border border-[#E5EBF6] bg-white p-5 shadow-[0_14px_32px_rgba(31,57,104,0.08)]">
      <SectionTitle title="التقييمات" subtitle="تقييمات حسابك" />
      <div className="mt-6 flex items-center justify-between rounded-2xl bg-[#F6F8FE] px-5 py-5">
        <div>
          <p className="text-4xl font-black text-[#111D35]">
            {Number(meta?.averageRating || 0).toFixed(1)}
          </p>
          <p className="mt-1 text-xs font-bold text-slate-500">متوسط التقييم</p>
        </div>
        <div className="text-left">
          <p className="text-2xl font-black text-[#1f5bd7]">
            {Number(meta?.total || 0).toLocaleString("ar-EG")}
          </p>
          <p className="mt-1 text-xs font-bold text-slate-500">تقييم</p>
        </div>
      </div>
    </section>
  );
}

function MessagesAndAiCard({ conversations, loading }) {
  const conversationCount = Array.isArray(conversations)
    ? conversations.length
    : 0;

  return (
    <section className="rounded-[24px] border border-[#E5EBF6] bg-white p-5 shadow-[0_14px_32px_rgba(31,57,104,0.08)]">
      <SectionTitle title="التواصل ورفيق" subtitle="رسائلك والمساعد الذكي" />
      <div className="mt-5 grid gap-3">
        <Link
          to="/expatriate/messages"
          className="rounded-2xl bg-[#F6F8FE] px-4 py-3"
        >
          <p className="text-lg font-black text-[#111D35]">
            {loading ? "الرسائل" : conversationCount.toLocaleString("ar-EG")}
          </p>
          <p className="mt-1 text-xs font-bold text-slate-500">
            {conversationCount === 0 ? "انتقل إلى صفحة الرسائل" : "محادثات"}
          </p>
        </Link>
        <div className="rounded-2xl bg-blue-50 px-4 py-3 text-[#1f5bd7]">
          <p className="text-sm font-black">رفيق جاهز لمساعدتك</p>
          <p className="mt-1 text-xs font-bold opacity-80">
            افتح المساعد من الزر العائم أسفل الصفحة.
          </p>
        </div>
      </div>
    </section>
  );
}

function QuickActions({ onNavigate }) {
  const actions = [
    { label: "تصفح الشقق", path: "/expatriate/search" },
    { label: "الشقق المحفوظة", path: "/expatriate/favorites" },
    { label: "حجوزاتي", path: "/expatriate/bookings" },
    { label: "الرسائل", path: "/expatriate/messages" },
    { label: "الملف الشخصي", path: "/expatriate/profile" },
    { label: "بيانات التوافق", path: "/expatriate/profile/roommate-profile" },
  ];

  return (
    <section>
      <h2 className="mb-4 text-xl font-black text-[#111D35]">خدمات سريعة</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {actions.map((action) => (
          <button
            key={action.label}
            type="button"
            onClick={() => onNavigate(action.path)}
            className="rounded-[22px] border border-[#E5EBF6] bg-white px-4 py-5 text-sm font-black text-[#111D35] shadow-[0_14px_32px_rgba(31,57,104,0.08)] transition hover:-translate-y-0.5 hover:text-[#1f5bd7]"
          >
            {action.label}
          </button>
        ))}
      </div>
    </section>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="rounded-2xl bg-[#F6F8FE] px-4 py-3">
      <p className="text-lg font-black text-[#111D35]">
        {Number(value || 0).toLocaleString("ar-EG")}
      </p>
      <p className="mt-1 text-xs font-bold text-slate-500">{label}</p>
    </div>
  );
}

function SectionTitle({ title, subtitle }) {
  return (
    <div>
      <h2 className="text-xl font-black text-[#111D35]">{title}</h2>
      <p className="mt-1 text-xs font-semibold text-slate-400">{subtitle}</p>
    </div>
  );
}

function EmptyHint({ text }) {
  return (
    <div className="mt-5 rounded-2xl bg-[#F6F8FE] px-4 py-8 text-center text-sm font-bold text-slate-500">
      {text}
    </div>
  );
}

function getBookingStatusLabel(status) {
  const labels = {
    PENDING_HOST_APPROVAL: "بانتظار موافقة المالك",
    PENDING_PAYMENT: "بانتظار الدفع",
    CHECK_IN_PENDING: "تم الدفع - بانتظار الانتقال",
    COMPLETED: "مكتمل",
    REJECTED: "مرفوض",
    CANCELLED_BY_GUEST: "ملغي من قبلك",
    CANCELLED_BY_HOST: "ملغي من المالك",
    CANCELED: "ملغي",
    EXPIRED: "انتهت المهلة",
    REFUNDED: "تم الاسترداد",
    DISPUTED: "نزاع قائم",
  };

  return labels[status] || status || "غير محدد";
}
