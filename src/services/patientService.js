import api from "./api";

export const fetchPatients = async () => {
  const response = await api.get("/patients");
  return response.data;
};

export const fetchMedicalRecords = async () => {
  const response = await api.get("/patient/medical-records");
  return response.data;
};

export const fetchPrescriptions = async () => {
  const response = await api.get("/patient/prescriptions");
  return response.data;
};

export const fetchMyHealthVitals = async () => {
  const response = await api.get("/patient/health-vitals");
  return response.data;
};

// Backwards-compatible aliases used by pages
export const fetchMyMedicalRecords = fetchMedicalRecords;
export const fetchMyPrescriptions = fetchPrescriptions;
export const createPatient = async (data) => {
  const res = await api.post('/patients', data)
  return res.data
}