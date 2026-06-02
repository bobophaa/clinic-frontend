import api from "./api";

/**
 * Login helper.
 * If the supplied email looks like an admin (contains "admin"), we hit the admin
 * login endpoint; otherwise we use the normal user login.
 */
export async function login(email, password) {
  const endpoint = email.toLowerCase().includes("admin") ? "/auth/admin/login" : "/auth/login";
  const { data } = await api.post(endpoint, {
    email: email.trim().toLowerCase(),
    password,
  });
  return { ...(data.user ?? {}), token: data.token };
}

function normalizeGender(gender) {
  const map = {
    ប្រុស: "male",
    ស្រី: "female",
    male: "male",
    female: "female",
    other: "other",
  };

  return map[gender] ?? null;
}

export function buildRegisterPayload(form) {
  return {
    name: form.name?.trim(),
    email: form.email?.trim().toLowerCase(),
    password: form.password,
    password_confirmation: form.password_confirmation ?? form.password,
    phone: form.phone?.trim() || null,
    dob: form.dob || null,
    gender: normalizeGender(form.gender) || null,
    address: form.address?.trim() || null,
    nationalId: form.nationalId?.trim() || null,
    occupation: form.occupation?.trim() || null,
    maritalStatus: form.maritalStatus || null,
    weight: form.weight || null,
    height: form.height || null,
    bloodType: form.bloodType || null,
    allergies: form.allergies?.trim() || null,
    chronicDisease: form.chronicDisease?.trim() || null,
    medicalHistory: form.medicalHistory?.trim() || null,
    emergencyName: form.emergencyName?.trim() || null,
    emergencyPhone: form.emergencyPhone?.trim() || null,
    emergencyRelation: form.emergencyRelation?.trim() || null,
    insuranceProvider: form.insuranceProvider?.trim() || null,
    insuranceNumber: form.insuranceNumber?.trim() || null,
  };
}

export async function register(form) {
  const { data } = await api.post("/auth/register", buildRegisterPayload(form));
  return { ...(data.user ?? {}), token: data.token };
}

export async function fetchMe() {
  const { data } = await api.get("/auth/me");
  return data.user;
}

export async function logoutApi() {
  await api.post("/auth/logout");
}
