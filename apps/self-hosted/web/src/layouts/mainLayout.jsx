import React, { lazy, Suspense } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";

const CropImageStudio = lazy(() =>
  import("@/components/common/CropImageStudio")
);

const DefaultLayout = ({ children }) => {
  const location = useLocation();
  // Các route cần ẩn FloatingActions
  const hiddenFloatingRoutes = ["/tools"];
  const shouldHideFloating = hiddenFloatingRoutes.some((path) =>
    location.pathname.startsWith(path)
  );

  // Ẩn Header và Footer ở trang dashboard (đã có HeaderHome riêng)
  const isDashboard = location.pathname === "/dashboard";

  return (
    <div className={isDashboard ? "" : "grid grid-rows-[auto_1fr_auto]"}>
      {/* Fixed Header */}
      {!isDashboard && <Header />}

      {/* Main Content with Scroll */}
      <main className={isDashboard ? "" : "overflow-hidden bg-base-200 text-base-content relative"}>
        <div className="relative z-10">{children}</div>
      </main>

      {!shouldHideFloating && !isDashboard && <Footer />}

      <Suspense fallback={null}>
        <CropImageStudio />
      </Suspense>

      <Sidebar />
    </div>
  );
};

export default DefaultLayout;
