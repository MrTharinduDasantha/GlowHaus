// Application route tree.
// All non-critical pages are lazy-loaded so the initial bundle stays small.

import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import Loader from "./components/common/Loader.jsx";
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";
import AdminProtectedRoute from "./components/common/AdminProtectedRoute.jsx";

import UserLayout from "./layout/UserLayout.jsx";
import AdminLayout from "./layout/AdminLayout.jsx";

/* ── User pages ── */
const HomePage = lazy(() => import("./pages/user/HomePage.jsx"));
const ServicesPage = lazy(() => import("./pages/user/ServicesPage.jsx"));
const ServiceDetailPage = lazy(
  () => import("./pages/user/ServiceDetailPage.jsx"),
);
const StylistsPage = lazy(() => import("./pages/user/StylistsPage.jsx"));
const StylistDetailPage = lazy(
  () => import("./pages/user/StylistDetailPage.jsx"),
);
const GalleryPage = lazy(() => import("./pages/user/GalleryPage.jsx"));
const AboutPage = lazy(() => import("./pages/user/AboutPage.jsx"));
const ContactPage = lazy(() => import("./pages/user/ContactPage.jsx"));
const LoginPage = lazy(() => import("./pages/user/LoginPage.jsx"));
const RegisterPage = lazy(() => import("./pages/user/RegisterPage.jsx"));
const ForgotPasswordPage = lazy(
  () => import("./pages/user/ForgotPasswordPage.jsx"),
);
const OtpVerifyPage = lazy(() => import("./pages/user/OtpVerifyPage.jsx"));
const ResetPasswordPage = lazy(
  () => import("./pages/user/ResetPasswordPage.jsx"),
);
const ProfilePage = lazy(() => import("./pages/user/ProfilePage.jsx"));
const FavoritesPage = lazy(() => import("./pages/user/FavoritesPage.jsx"));
const ServiceBagPage = lazy(() => import("./pages/user/ServiceBagPage.jsx"));
const DateTimeSelectionPage = lazy(
  () => import("./pages/user/DateTimeSelectionPage.jsx"),
);
const BookingSummaryPage = lazy(
  () => import("./pages/user/BookingSummaryPage.jsx"),
);
const PaymentSuccessPage = lazy(
  () => import("./pages/user/PaymentSuccessPage.jsx"),
);
const PaymentFailurePage = lazy(
  () => import("./pages/user/PaymentFailurePage.jsx"),
);
const MyBookingsPage = lazy(() => import("./pages/user/MyBookingsPage.jsx"));
const BookingDetailsPage = lazy(
  () => import("./pages/user/BookingDetailsPage.jsx"),
);

/* ── Admin pages ── */
const AdminLoginPage = lazy(() => import("./pages/admin/AdminLoginPage.jsx"));
const DashboardPage = lazy(() => import("./pages/admin/DashboardPage.jsx"));
const AdminCategoriesPage = lazy(
  () => import("./pages/admin/CategoriesPage.jsx"),
);
const AdminServicesPage = lazy(() => import("./pages/admin/ServicesPage.jsx"));
const AdminStylistsPage = lazy(() => import("./pages/admin/StylistsPage.jsx"));
const AdminStylistDetail = lazy(
  () => import("./pages/admin/StylistDetailPage.jsx"),
);
const AppointmentsPage = lazy(
  () => import("./pages/admin/AppointmentsPage.jsx"),
);
const CustomersPage = lazy(() => import("./pages/admin/CustomersPage.jsx"));
const CustomerDetailPage = lazy(
  () => import("./pages/admin/CustomerDetailPage.jsx"),
);
const PaymentsPage = lazy(() => import("./pages/admin/PaymentsPage.jsx"));
const ReportsPage = lazy(() => import("./pages/admin/ReportsPage.jsx"));
const PromoCodesPage = lazy(() => import("./pages/admin/PromoCodesPage.jsx"));
const AdminGalleryPage = lazy(() => import("./pages/admin/GalleryPage.jsx"));
const ReviewsPage = lazy(() => import("./pages/admin/ReviewsPage.jsx"));
const SettingsPage = lazy(() => import("./pages/admin/SettingsPage.jsx"));
const NotFoundPage = lazy(() => import("./pages/admin/NotFoundPage.jsx"));

const App = () => {
  return (
    <Suspense fallback={<Loader label="Loading page…" />}>
      <Routes>
        {/* ─── PUBLIC + CUSTOMER ROUTES (UserLayout) ─── */}
        <Route element={<UserLayout />}>
          {/* Public */}
          <Route index element={<HomePage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="services/:id" element={<ServiceDetailPage />} />
          <Route path="stylists" element={<StylistsPage />} />
          <Route path="stylists/:id" element={<StylistDetailPage />} />
          <Route path="gallery" element={<GalleryPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />

          {/* Auth */}
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="verify-otp" element={<OtpVerifyPage />} />
          <Route path="reset-password" element={<ResetPasswordPage />} />

          {/* Booking flow — bag is public, the rest require login */}
          <Route path="bag" element={<ServiceBagPage />} />
          <Route
            path="booking/datetime"
            element={
              <ProtectedRoute>
                <DateTimeSelectionPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="booking/summary"
            element={
              <ProtectedRoute>
                <BookingSummaryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="payment-success"
            element={
              <ProtectedRoute>
                <PaymentSuccessPage />
              </ProtectedRoute>
            }
          />
          <Route path="payment-failure" element={<PaymentFailurePage />} />

          {/* Customer-only */}
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="favorites"
            element={
              <ProtectedRoute>
                <FavoritesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="my-bookings"
            element={
              <ProtectedRoute>
                <MyBookingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="my-bookings/:id"
            element={
              <ProtectedRoute>
                <BookingDetailsPage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* ─── ADMIN LOGIN (no layout) ─── */}
        <Route path="admin/login" element={<AdminLoginPage />} />

        {/* ─── ADMIN ROUTES (AdminLayout + AdminProtectedRoute) ─── */}
        <Route
          path="admin"
          element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="services" element={<AdminServicesPage />} />
          <Route path="stylists" element={<AdminStylistsPage />} />
          <Route path="stylists/:id" element={<AdminStylistDetail />} />
          <Route path="appointments" element={<AppointmentsPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="customers/:id" element={<CustomerDetailPage />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="promos" element={<PromoCodesPage />} />
          <Route path="gallery" element={<AdminGalleryPage />} />
          <Route path="reviews" element={<ReviewsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* ─── 404 ─── */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default App;
