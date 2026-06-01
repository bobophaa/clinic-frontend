import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Auth
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";

// Landing Pages (Guest)
import LandingLayout from "../layouts/LandingLayout";
import LandingPage from "../pages/landing/LandingPage";
import AboutPage from "../pages/landing/AboutPage";
import ServicesPage from "../pages/landing/ServicesPage";
import DoctorsPage from "../pages/landing/DoctorsPage";
import ContactPage from "../pages/landing/ContactPage";

// Admin Pages
import AdminDashboard from "../pages/admin/Dashboard";
import AdminDoctors from "../pages/admin/Doctors";
import AdminDoctorSchedules from "../pages/admin/DoctorSchedules";
import AdminPatients from "../pages/admin/Patients";
import AdminAllAppointments from "../pages/admin/AllAppointments";
import AdminMedicalRecords from "../pages/admin/MedicalRecords";
import AdminBilling from "../pages/admin/Billing";
import AdminReports from "../pages/admin/Reports";
import AdminMyAccount from "../pages/admin/MyAccount";

// Doctor Pages
import DoctorDashboard from "../pages/doctor/Dashboard";
import DoctorMyAppointments from "../pages/doctor/MyAppointments";
import DoctorMySchedule from "../pages/doctor/MySchedule";
import DoctorMedicalRecords from "../pages/doctor/MedicalRecords";
import DoctorPrescriptions from "../pages/doctor/Prescriptions";
import DoctorMyAccount from "../pages/doctor/MyAccount";

// Patient Pages
import PatientHome from "../pages/patient/Home";
import PatientBookAppointment from "../pages/patient/BookAppointment";
import PatientMyAppointments from "../pages/patient/MyAppointments";
import PatientMyMedicalRecords from "../pages/patient/MyMedicalRecords";
import PatientMyPrescriptions from "../pages/patient/MyPrescriptions";
import PatientMyAccount from "../pages/patient/MyAccount";

// Receptionist Pages
import ReceptionistDashboard from "../pages/receptionist/Dashboard";
import ReceptionistBookWalkIn from "../pages/receptionist/BookWalkIn";
import ReceptionistAllAppointments from "../pages/receptionist/AllAppointments";
import ReceptionistBilling from "../pages/receptionist/Billing";
import ReceptionistInvoices from "../pages/receptionist/Invoices";
import ReceptionistMyAccount from "../pages/receptionist/MyAccount";

import MainLayout from "../layouts/MainLayout";

// ============================================================
// ProtectedRoute — ការពារ route តម្រូវឱ្យ Login
// ============================================================
function ProtectedRoute({ children, allowedRole }) {
  const { user, authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-500">
        កំពុងផ្ទុក...
      </div>
    );
  }

  if (!user || !user.token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }

  return children;
}


function GuestRoute({ children }) {
  const { user, authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-500">
        កំពុងផ្ទុក...
      </div>
    );
  }

  if (user && user.token) {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }

  return children;
}


function getDashboardPath(role) {
  switch (role) {
    case "admin":
      return "/admin/dashboard";
    case "doctor":
      return "/doctor/dashboard";
    case "patient":
      return "/patient/home";
    case "receptionist":
      return "/receptionist/dashboard";
    default:
      return "/login";
  }
}


export default function AppRoutes() {
  return (
    <Routes>
    
      <Route
        path="/"
        element={
          <LandingLayout>
            <LandingPage />
          </LandingLayout>
        }
      />

      <Route
        path="/about"
        element={
          <LandingLayout>
            <AboutPage />
          </LandingLayout>
        }
      />

      <Route
        path="/services"
        element={
          <LandingLayout>
            <ServicesPage />
          </LandingLayout>
        }
      />

      <Route
        path="/doctors"
        element={
          <LandingLayout>
            <DoctorsPage />
          </LandingLayout>
        }
      />

      <Route
        path="/contact"
        element={
          <LandingLayout>
            <ContactPage />
          </LandingLayout>
        }
      />

      
      <Route
        path="/login"
        element={
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        }
      />

      <Route
        path="/register"
        element={
          <GuestRoute>
            <RegisterPage />
          </GuestRoute>
        }
      />

      {/* ==================== ADMIN ROUTES ==================== */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRole="admin">
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="doctors" element={<AdminDoctors />} />
        <Route path="schedules" element={<AdminDoctorSchedules />} />
        <Route path="patients" element={<AdminPatients />} />
        <Route path="appointments" element={<AdminAllAppointments />} />
        <Route path="medical-records" element={<AdminMedicalRecords />} />
        <Route path="billing" element={<AdminBilling />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="account" element={<AdminMyAccount />} />
      </Route>

      {/* ==================== DOCTOR ROUTES ==================== */}
      <Route
        path="/doctor"
        element={
          <ProtectedRoute allowedRole="doctor">
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DoctorDashboard />} />
        <Route path="appointments" element={<DoctorMyAppointments />} />
        <Route path="schedule" element={<DoctorMySchedule />} />
        <Route path="medical-records" element={<DoctorMedicalRecords />} />
        <Route path="prescriptions" element={<DoctorPrescriptions />} />
        <Route path="account" element={<DoctorMyAccount />} />
      </Route>

      {/* ==================== PATIENT ROUTES ==================== */}
      <Route
        path="/patient"
        element={
          <ProtectedRoute allowedRole="patient">
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="home" replace />} />
        <Route path="home" element={<PatientHome />} />
        <Route path="book" element={<PatientBookAppointment />} />
        <Route path="appointments" element={<PatientMyAppointments />} />
        <Route path="medical-records" element={<PatientMyMedicalRecords />} />
        <Route path="prescriptions" element={<PatientMyPrescriptions />} />
        <Route path="account" element={<PatientMyAccount />} />
      </Route>

      {/* ==================== RECEPTIONIST ROUTES ==================== */}
      <Route
        path="/receptionist"
        element={
          <ProtectedRoute allowedRole="receptionist">
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<ReceptionistDashboard />} />
        <Route path="walk-in" element={<ReceptionistBookWalkIn />} />
        <Route path="appointments" element={<ReceptionistAllAppointments />} />
        <Route path="billing" element={<ReceptionistBilling />} />
        <Route path="invoices" element={<ReceptionistInvoices />} />
        <Route path="account" element={<ReceptionistMyAccount />} />
      </Route>

      {/* ==================== 404 — Unknown Routes ==================== */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
