import { useEffect, useMemo, useState } from 'react'
import * as doctorService from '../../services/doctorService'
import {
  Pencil,
  Plus,
  Search,
  Phone,
  Mail,
  BriefcaseMedical,
} from 'lucide-react'

import Modal from '../../components/Modal'
import StatusBadge from '../../components/StatusBadge'
import TableWrapper from '../../components/TableWrapper'

function Doctors() {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [saveError, setSaveError] = useState('')

  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '', 
    specialization: '', 
    phone: '',
    room: '',
    experience: '',
    fee: '',
  })

  const ITEMS_PER_PAGE = 4

  useEffect(() => {
    doctorService
      .fetchDoctors()
      .then((res) => {
        const doctorList = res.data || res;
        setDoctors(Array.isArray(doctorList) ? doctorList : []);
      })
      .catch((err) => console.error('Failed to load doctors:', err))
      .finally(() => setLoading(false))
  }, [])

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doctor) =>
      doctor.name?.toLowerCase().includes(search.toLowerCase()),
    )
  }, [doctors, search])

  const totalPages = Math.ceil(filteredDoctors.length / ITEMS_PER_PAGE)

  const paginatedDoctors = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredDoctors.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredDoctors, currentPage])

  const openAdd = () => {
    setEditingId(null)
    setSaveError('')
    setForm({
      name: '',
      email: '',
      password: '', 
      specialization: '',
      phone: '',
      room: '',
      experience: '',
      fee: '',
    })
    setIsOpen(true)
  }

  const openEdit = (doctor) => {
    setEditingId(doctor.dbId ?? doctor.id)
    setSaveError('')
    setForm({
      name: doctor.name,
      email: doctor.email,
      password: '',
      specialization: doctor.specialty || doctor.specialization, 
      phone: doctor.phone,
      room: doctor.room,
      experience: doctor.experience,
      fee: doctor.fee,
    })
    setIsOpen(true)
  }

  const saveDoctor = async () => {
  
    if (!form.name || !form.email || !form.specialization) {
      setSaveError('សូមបំពេញព័ត៌មានចាំបាច់ (ឈ្មោះ, អ៊ីមែល, ឯកទេស)');
      return;
    }

    if (!editingId && !form.password) {
      setSaveError('សូមបំពេញពាក្យសម្ងាត់សម្រាប់បង្កើតគណនីគ្រូពេទ្យថ្មី');
      return;
    }

    setSaveError('')

    try {
      if (editingId) {
      
        const payload = { ...form };
        if (!payload.password) delete payload.password;
        
        const response = await doctorService.updateDoctor(editingId, payload);
        const updatedData = response.data || response;

        setDoctors((prev) =>
          prev.map((item) =>
            (item.dbId ?? item.id) === editingId ? updatedData : item,
          ),
        )
      } else {
        const response = await doctorService.createDoctor({ ...form, is_active: true });
        const createdData = response.data || response;

        setDoctors((prev) => [...prev, createdData])
      }
      setIsOpen(false)
    } catch (err) {
      setSaveError(
        err.response?.data?.message || 'មិនអាចរក្សាទុកទិន្នន័យវេជ្ជបណ្ឌិតបានឡើយ'
      )
    }
  }

  return (
    <div className="space-y-5">
      {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">គ្រប់គ្រងវេជ្ជបណ្ឌិត</h1>
          <p className="mt-1 text-sm text-slate-500">បន្ថែម កែប្រែ និងគ្រប់គ្រងព័ត៌មានវេជ្ជបណ្ឌិត</p>
        </div>

        <button
          type="button"
          onClick={openAdd}
          className="inline-flex items-center gap-2 rounded-xl bg-[#1976D2] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition"
        >
          <Plus size={18} />
          បន្ថែមវេជ្ជបណ្ឌិត
        </button>
      </div>

      {loading && <p className="text-sm text-slate-500">កំពុងផ្ទុកទិន្នន័យវេជ្ជបណ្ឌិត...</p>}

      {/* STATS */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">វេជ្ជបណ្ឌិតសរុប</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">{doctors.length}</h2>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">កំពុងសកម្ម</p>
          <h2 className="mt-2 text-3xl font-bold text-emerald-600">
            {doctors.filter((d) => d.active || d.is_active).length}
          </h2>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">ផ្អាក</p>
          <h2 className="mt-2 text-3xl font-bold text-rose-500">
            {doctors.filter((d) => !(d.active || d.is_active)).length}
          </h2>
        </div>
      </div>

      {/* SEARCH */}
      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="ស្វែងរកឈ្មោះវេជ្ជបណ្ឌិត..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setCurrentPage(1)
            }}
            className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 text-sm outline-none focus:border-[#1976D2]"
          />
        </div>
      </div>

      {/* TABLE */}
      <TableWrapper>
        <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
          <tr>
            <th className="px-4 py-3">លេខកូដ</th>
            <th className="px-4 py-3">ព័ត៌មានវេជ្ជបណ្ឌិត</th>
            <th className="px-4 py-3">ឯកទេស</th>
            <th className="px-4 py-3">បន្ទប់</th>
            <th className="px-4 py-3">បទពិសោធន៍</th>
            <th className="px-4 py-3">តម្លៃ</th>
            <th className="px-4 py-3">ស្ថានភាព</th>
            <th className="px-4 py-3 text-right">សកម្មភាព</th>
          </tr>
        </thead>
        <tbody>
          {paginatedDoctors.map((doctor) => (
            <tr key={doctor.id} className="border-t border-slate-100">
              <td className="px-4 py-4 font-semibold">{doctor.displayId || doctor.id}</td>
              <td className="px-4 py-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-[#1976D2]">
                    <BriefcaseMedical size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{doctor.name}</p>
                    <div className="mt-1 space-y-1 text-xs text-slate-500">
                      <p className="flex items-center gap-1"><Phone size={12} />{doctor.phone}</p>
                      <p className="flex items-center gap-1"><Mail size={12} />{doctor.email}</p>
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4">{doctor.specialty || doctor.specialization}</td>
              <td className="px-4 py-4">{doctor.room}</td>
              <td className="px-4 py-4">{doctor.experience}</td>
              <td className="px-4 py-4 font-semibold text-emerald-600">
                {typeof doctor.fee === 'number' ? `$${doctor.fee}` : doctor.fee}
              </td>
              <td className="px-4 py-4">
                <StatusBadge status={(doctor.active || doctor.is_active) ? 'success' : 'warning'}>
                  {(doctor.active || doctor.is_active) ? 'សកម្ម' : 'ផ្អាក'}
                </StatusBadge>
              </td>
              <td className="px-4 py-4 text-right">
                <button
                  type="button"
                  onClick={() => openEdit(doctor)}
                  className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-[#1976D2] hover:bg-blue-100"
                >
                  <Pencil size={14} />
                  កែប្រែ
                </button>
              </td>
            </tr>
          ))}
          {paginatedDoctors.length === 0 && (
            <tr>
              <td colSpan="8" className="text-center py-8 text-sm text-slate-400">រកមិនឃើញទិន្នន័យគ្រូពេទ្យឡើយ</td>
            </tr>
          )}
        </tbody>
      </TableWrapper>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="rounded-lg border px-3 py-2 text-sm disabled:opacity-50"
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`h-9 w-9 rounded-lg text-sm font-semibold ${
                currentPage === index + 1 ? 'bg-[#1976D2] text-white' : 'border'
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="rounded-lg border px-3 py-2 text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      <Modal
        isOpen={isOpen}
        title={editingId ? 'កែប្រែព័ត៌មានវេជ្ជបណ្ឌិត' : 'បន្ថែមវេជ្ជបណ្ឌិតថ្មី'}
        onClose={() => setIsOpen(false)}
        footer={
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50"
            >
              បោះបង់
            </button>
            <button
              type="button"
              onClick={saveDoctor}
              className="rounded-lg bg-[#1976D2] px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              រក្សាទុក
            </button>
          </div>
        }
      >
        {saveError && <p className="mb-3 text-sm text-red-600 bg-red-50 p-2 rounded">{saveError}</p>}

        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">ឈ្មោះគ្រូពេទ្យ *</label>
            <input
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="ឈ្មោះវេជ្ជបណ្ឌិត"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#1976D2]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">អ៊ីមែលគណនី *</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              placeholder="អ៊ីមែល"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#1976D2]"
            />
          </div>

        
          {!editingId && (
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-600 mb-1">លេខសម្ងាត់ចូលប្រព័ន្ធ *</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                placeholder="ពាក្យសម្ងាត់ (យ៉ាងតិច ៦ ខ្ទង់)"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#1976D2]"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">ឯកទេស/ជំនាញ *</label>
            <input
              value={form.specialization}
              onChange={(e) => setForm((p) => ({ ...p, specialization: e.target.value }))}
              placeholder="ឯកទេស"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#1976D2]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">លេខទូរស័ព្ទ</label>
            <input
              value={form.phone}
              onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
              placeholder="លេខទូរស័ព្ទ"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#1976D2]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">បន្ទប់ពិនិត្យ</label>
            <input
              value={form.room}
              onChange={(e) => setForm((p) => ({ ...p, room: e.target.value }))}
              placeholder="បន្ទប់"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#1976D2]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">បទពិសោធន៍</label>
            <input
              value={form.experience}
              onChange={(e) => setForm((p) => ({ ...p, experience: e.target.value }))}
              placeholder="បទពិសោធន៍"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#1976D2]"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-slate-600 mb-1">តម្លៃសេវាពិនិត្យ ($)</label>
            <input
              type="number"
              value={form.fee}
              onChange={(e) => setForm((p) => ({ ...p, fee: e.target.value }))}
              placeholder="តម្លៃពិនិត្យជាលេខសុទ្ធ (ឧ. 25)"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#1976D2]"
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Doctors