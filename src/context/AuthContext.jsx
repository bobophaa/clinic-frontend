import { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as authService from "../services/authService";

const AuthContext = createContext(null);

const ROLE_MENUS = {
  admin: [
    { label: "ផ្ទាំងគ្រប់គ្រង", path: "/admin/dashboard" },
    { label: "គ្រប់គ្រងវេជ្ជបណ្ឌិត", path: "/admin/doctors" },
    { label: "កាលវិភាគវេជ្ជបណ្ឌិត", path: "/admin/schedules" },
    { label: "អ្នកជំងឺ", path: "/admin/patients" },
    { label: "ការណាត់ជួបទាំងអស់", path: "/admin/appointments" },
   
    { label: "វិក្កយបត្រ", path: "/admin/billing" },
    { label: "របាយការណ៍", path: "/admin/reports" },
    { label: "គណនីរបស់ខ្ញុំ", path: "/admin/account" },
  ],
  doctor: [
    { label: "ផ្ទាំងវេជ្ជបណ្ឌិត", path: "/doctor/dashboard" },
    { label: "ការណាត់ជួបរបស់ខ្ញុំ", path: "/doctor/appointments" },
    { label: "កាលវិភាគរបស់ខ្ញុំ", path: "/doctor/schedule" },
    { label: "កំណត់ត្រាវេជ្ជសាស្ត្រ", path: "/doctor/medical-records" },
    { label: "វេជ្ជបញ្ជា", path: "/doctor/prescriptions" },
    { label: "គណនីរបស់ខ្ញុំ", path: "/doctor/account" },
  ],
  patient: [
    { label: "ទំព័រដើម", path: "/patient/home" },
    { label: "កក់ការណាត់ជួប", path: "/patient/book" },
    { label: "ការណាត់ជួបរបស់ខ្ញុំ", path: "/patient/appointments" },
    { label: "កំណត់ត្រាវេជ្ជសាស្ត្រ", path: "/patient/medical-records" },
    { label: "វេជ្ជបញ្ជារបស់ខ្ញុំ", path: "/patient/prescriptions" },
    { label: "គណនីរបស់ខ្ញុំ", path: "/patient/account" },
  ],
  receptionist: [
    { label: "ផ្ទាំងទទួលភ្ញៀវ", path: "/receptionist/dashboard" },
    { label: "ចុះឈ្មោះអ្នកជំងឺផ្ទាល់", path: "/receptionist/walk-in" },
    { label: "ការណាត់ជួបទាំងអស់", path: "/receptionist/appointments" },
    { label: "គិតប្រាក់", path: "/receptionist/billing" },
    { label: "វិក្កយបត្រ", path: "/receptionist/invoices" },
    { label: "គណនីរបស់ខ្ញុំ", path: "/receptionist/account" },
  ],
};

function readStoredUser() {
  const storedUser = localStorage.getItem("auth_user");
  if (!storedUser) return null;
  try {
    return JSON.parse(storedUser);
  } catch (error) {
    console.error("Failed to restore user from localStorage:", error);
    localStorage.removeItem("auth_user");
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);
  const [authLoading, setAuthLoading] = useState(() =>
    Boolean(localStorage.getItem("auth_token")),
  );

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      setAuthLoading(false);
      return;
    }

    authService
      .fetchMe()
      .then((me) => {
        const withToken = { ...me, token };
        localStorage.setItem("auth_user", JSON.stringify(withToken));
        setUser(withToken);
      })
      .catch(() => {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
        setUser(null);
      })
      .finally(() => setAuthLoading(false));
  }, []);

  const persistUser = (payload, remember = true) => {
    if (!payload?.token) {
      throw new Error("មិនអាចចូលប្រើបាន សូមព្យាយាមម្តងទៀត");
    }

    localStorage.setItem("auth_token", payload.token);
    if (remember) {
      localStorage.setItem("auth_user", JSON.stringify(payload));
    } else {
      localStorage.removeItem("auth_user");
    }
    setUser(payload);
    return payload;
  };

  const login = async (email, password, options = {}) => {
    const { remember = true } = options;
    const userData = await authService.login(email, password);
    return persistUser(userData, remember);
  };

  const register = async (payload) => {
    const userData = await authService.register(payload);
    return persistUser(userData, true);
  };

  const logout = async () => {
    try {
      await authService.logoutApi();
    } catch {
      // ignore — token may already be invalid
    }
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    setUser(null);
    window.location.href = "/login";
  };

  const roleMenus = useMemo(() => {
    if (!user || !user.role) {
      return [];
    }
    return ROLE_MENUS[user.role] ?? [];
  }, [user]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      authLoading,
      login,
      register,
      logout,
      roleMenus,
    }),
    [authLoading, roleMenus, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth ត្រូវប្រើនៅក្នុង AuthProvider ប៉ុណ្ណោះ");
  }
  return context;
}
