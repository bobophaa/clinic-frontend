import api from './api'

export const fetchMedicalRecords = async () => {
  const res = await api.get('/patient/medical-records')
  return res.data
}

export const createMedicalRecord = async (data) => {
  const res = await api.post('/patient/medical-records', data)
  return res.data
}

export const storePrescriptions = async (recordId, prescriptions) => {
  const res = await api.post(`/medical-records/${recordId}/prescriptions`, { prescriptions })
  return res.data
}

export const fetchMedicalRecordByAppointment = async (appointmentId) => {
  const res = await api.get(`/medical-records/appointment/${appointmentId}`)
  return res.data
}