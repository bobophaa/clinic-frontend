import api from './api'

export const fetchAppointments = async () => {
  const response = await api.get('/appointments')
  return response.data
}

export const fetchAppointmentDetail = async (id) => {
  const response = await api.get(`/appointments/${id}`)
  return response.data
}

export const createAppointment = async (data) => {
  const response = await api.post('/appointments', data)
  return response.data
}

export const approveAppointment = async (id) => {
  const response = await api.put(`/appointments/${id}/approve`)
  return response.data
}

export const rejectAppointment = async (id) => {
  const response = await api.put(`/appointments/${id}/reject`)
  return response.data
}

export const completeAppointment = async (id) => {
  const response = await api.put(`/appointments/${id}/complete`)
  return response.data
}