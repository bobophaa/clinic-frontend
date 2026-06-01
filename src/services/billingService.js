import api from './api'

export const fetchBills = async () => {
  const res = await api.get('/billing')
  return res.data
}

export const fetchBill = async (id) => {
  const res = await api.get(`/billing/${id}`)
  return res.data
}

export const fetchBillByAppointment = async (appointmentId) => {
  const res = await api.get(`/billing/appointment/${appointmentId}`)
  return res.data
}

export const createBill = async (data) => {
  const res = await api.post('/billing', data)
  return res.data
}