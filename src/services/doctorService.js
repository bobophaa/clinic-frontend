import api from "./api";

const unwrap = (response) => response?.data?.data ?? response?.data;

export const fetchDoctors = async () => {
  const response = await api.get("/doctors");
  return unwrap(response);
};

export const fetchDoctorSchedules = async (doctorId, date) => {
  const response = await api.get("/doctor-schedules", {
    params: {
      doctor_id: doctorId,
      date,
    },
  });
  return unwrap(response);
};

export const createDoctor = async (data) => {
  const response = await api.post('/admin/doctors', data)
  return response.data
}

export const updateDoctor = async (id, data) => {
  const response = await api.put(`/admin/doctors/${id}`, data)
  return response.data
}
export const deleteDoctor = async (id) => {
  const response = await api.delete(`/doctors/${id}`);
  return unwrap(response);
};
