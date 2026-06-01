import { useEffect, useMemo, useState } from 'react'
import { Plus, Trash2, CheckCircle2, Clock3, X } from 'lucide-react'
import { createBill } from '../../services/billingService'
import { fetchMedicalRecordByAppointment } from '../../services/medicalRecordService'

const ITEM_TYPES = [
  { value: 'service',  label: 'សេវាកម្ម' },
  { value: 'medicine', label: 'ថ្នាំ' },
  { value: 'test',     label: 'ការវិភាគ/Lab' },
]

const PAYMENT_METHODS = [
  { id: 'cash',     label: 'សាច់ប្រាក់ 💵' },
  { id: 'card',     label: 'កាតធនាគារ 💳' },
  { id: 'transfer', label: 'ផ្ទេរប្រាក់ 📲' },
]

function emptyItem() {
  return { item_name: '', item_type: 'service', unit_price: '', quantity: 1 }
}

export default function BillingModal({ isOpen, onClose, appointment, onSaveSuccess }) {
  const [loadingRx, setLoadingRx]         = useState(false)
  const [medicalRecord, setMedicalRecord] = useState(null)
  const [saving, setSaving]               = useState(false)
  const [saveError, setSaveError]         = useState('')
  const [saveSuccess, setSaveSuccess]     = useState(false)

  const [form, setForm] = useState({
    consultation_fee: '',
    payment_method:   'cash',
    items:            [emptyItem()],
  })


  useEffect(() => {
    if (!isOpen || !appointment) return

    
    setMedicalRecord(null)
    setForm({
      consultation_fee: appointment.consultationFee ?? appointment.fee ?? appointment.consultation_fee ?? '',
      payment_method:   'cash',
      items:            [emptyItem()],
    })

    const loadRxData = async () => {
      setLoadingRx(true)
      try {
        const res = await fetchMedicalRecordByAppointment(appointment.id)
        const record = res.data ?? res
        if (record) {
          setMedicalRecord(record)
          if (record.prescriptions?.length > 0) {
            const rxItems = record.prescriptions.map((p) => ({
              item_name:  `${p.medicine_name}${p.dosage ? ` ${p.dosage}` : ''}`,
              item_type:  'medicine',
              unit_price: '',
              quantity:   parseFloat(p.quantity) || 1,
            }))
            setForm((p) => ({ ...p, items: rxItems }))
          }
        }
      } catch (e) {
        console.warn('No medical record found for this appointment')
      } finally {
        setLoadingRx(false)
      }
    }

    loadRxData()
  }, [isOpen, appointment])

  const itemsTotal = useMemo(
    () => form.items.reduce((sum, i) => sum + (parseFloat(i.unit_price) || 0) * (parseInt(i.quantity) || 0), 0),
    [form.items]
  )
  const grandTotal = (parseFloat(form.consultation_fee) || 0) + itemsTotal

  const updateItem = (index, field, value) => {
    setForm((p) => {
      const items = [...p.items]
      items[index] = { ...items[index], [field]: value }
      return { ...p, items }
    })
  }
  const addItem    = () => setForm((p) => ({ ...p, items: [...p.items, emptyItem()] }))
  const removeItem = (i) => setForm((p) => ({ ...p, items: p.items.filter((_, idx) => idx !== i) }))

  const handleSubmit = async () => {
    if (!form.consultation_fee) { setSaveError('សូមបំពេញថ្លៃពិនិត្យ'); return }
    const filledItems = form.items.filter((i) => i.item_name)
    if (filledItems.some((i) => !i.unit_price)) {
      setSaveError('សូមបំពេញតម្លៃមុខទំនិញទាំងអស់')
      return
    }
    setSaveError('')
    setSaving(true)
    try {
      await createBill({
        appointment_id:   Number(appointment.id),
        consultation_fee: parseFloat(form.consultation_fee),
        payment_method:   form.payment_method,
        items: filledItems.map((i) => ({
          item_name:  i.item_name,
          item_type:  i.item_type,
          unit_price: parseFloat(i.unit_price),
          quantity:   parseInt(i.quantity),
        })),
      })
      setSaveSuccess(true)
      setTimeout(() => {
        setSaveSuccess(false)
        onSaveSuccess() 
        onClose()
      }, 1500)
    } catch (e) {
      setSaveError(e.response?.data?.message || 'មិនអាចរក្សាទុកបានទេ')
    } finally {
      setSaving(false)
    }
  }

  if (!isOpen || !appointment) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        
     
        <div className="bg-gradient-to-r from-blue-50 to-transparent px-6 py-4 flex items-center justify-between border-b border-slate-100">
          <div>
            <h3 className="font-bold text-lg text-[#1976D2]">គិតប្រាក់ជូនអ្នកជំងឺ</h3>
            <p className="text-xs text-slate-500 font-medium">អ្នកជំងឺ៖ {appointment.patientName} · គ្រូពេទ្យ៖ {appointment.doctorName}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition">
            <X size={18} />
          </button>
        </div>

       
        <div className="p-6 overflow-y-auto flex-1 grid gap-5 md:grid-cols-[1fr_280px]">
          <div className="space-y-4">
            {saveSuccess && (
              <div className="flex items-center gap-3 rounded-xl bg-emerald-50 p-4 text-emerald-700">
                <CheckCircle2 size={20} /><p className="font-semibold text-sm">វិក្កយបត្រត្រូវបានរក្សាទុកដោយជោគជ័យ!</p>
              </div>
            )}
            {saveError && <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 font-semibold">{saveError}</div>}

            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-800">ព័ត៌មានថ្លៃសេវា និងទំនិញ</h4>
              <button type="button" onClick={addItem} className="text-xs font-bold text-[#1976D2] bg-blue-50 px-2.5 py-1.5 rounded-xl hover:bg-blue-100 transition">
                + បន្ថែមមុខទំនិញ
              </button>
            </div>

            <div className="grid gap-1">
              <label className="text-xs font-bold text-slate-600">ថ្លៃពិនិត្យពិគ្រោះជំងឺ ($)</label>
              <input
                type="number"
                value={form.consultation_fee}
                onChange={(e) => setForm((p) => ({ ...p, consultation_fee: e.target.value }))}
                placeholder="0.00"
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-[#1976D2] transition"
              />
            </div>

            {/* Dynamic Items */}
            <div className="space-y-2.5">
              {form.items.map((item, idx) => (
                <div key={idx} className="flex flex-wrap items-end gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex-1 min-w-[140px] grid gap-1">
                    <input
                      type="text"
                      value={item.item_name}
                      onChange={(e) => updateItem(idx, 'item_name', e.target.value)}
                      placeholder="ឈ្មោះសេវា/ឈ្មោះថ្នាំ"
                      className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none focus:border-[#1976D2]"
                    />
                  </div>
                  <div className="w-24">
                    <select
                      value={item.item_type}
                      onChange={(e) => updateItem(idx, 'item_type', e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-2 py-1.5 text-xs outline-none focus:border-[#1976D2]"
                    >
                      {ITEM_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </div>
                  <div className="w-20">
                    <input
                      type="number"
                      value={item.unit_price}
                      onChange={(e) => updateItem(idx, 'unit_price', e.target.value)}
                      placeholder="តម្លៃ ($)"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none focus:border-[#1976D2]"
                    />
                  </div>
                  <div className="w-16">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(idx, 'quantity', e.target.value)}
                      min="1"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none focus:border-[#1976D2]"
                    />
                  </div>
                  {form.items.length > 1 && (
                    <button type="button" onClick={() => removeItem(idx)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition">
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* SIDEBAR SUMMARY */}
          <div className="space-y-4 border-l border-slate-100 pl-4">
            {loadingRx ? (
              <p className="text-xs text-slate-400 font-medium">កំពុងទាញយកវេជ្ជបញ្ជា...</p>
            ) : medicalRecord ? (
              <div className="bg-blue-50/50 border border-blue-100 p-3 rounded-xl text-xs space-y-1">
                <p className="font-bold text-[#1976D2]">📋 វេជ្ជបញ្ជាពីគ្រូពេទ្យ៖</p>
                <p className="text-slate-600 font-semibold truncate">រោគវិនិច្ឆ័យ៖ {medicalRecord.diagnosis || '—'}</p>
                <ul className="list-disc list-inside text-slate-500 font-medium">
                  {medicalRecord.prescriptions?.map((p, i) => (
                    <li key={i} className="truncate">{p.medicine_name} ({p.quantity})</li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-xs text-amber-600 font-medium bg-amber-50 p-2.5 rounded-xl border border-amber-100">⚠️ មិនទាន់មានទិន្នន័យវេជ្ជបញ្ជាទេ</p>
            )}

            <div className="grid gap-1">
              <label className="text-xs font-bold text-slate-600">វិធីសាស្ត្រទូទាត់</label>
              <div className="grid gap-1">
                {PAYMENT_METHODS.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, payment_method: m.id }))}
                    className={`w-full text-left rounded-xl border px-3 py-2 text-xs font-bold transition-all ${form.payment_method === m.id ? 'border-[#1976D2] bg-blue-50 text-[#1976D2]' : 'border-slate-200 hover:bg-slate-50 text-slate-700'}`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3 space-y-1.5 text-xs font-semibold text-slate-600">
              <div className="flex justify-between"><span>ថ្លៃពិនិត្យ៖</span><span>${(parseFloat(form.consultation_fee) || 0).toFixed(2)}</span></div>
              <div className="flex justify-between"><span>ថ្លៃទំនិញសរុប៖</span><span>${itemsTotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-base font-bold text-slate-900 border-t border-slate-100 pt-2">
                <span>សរុប៖</span><span className="text-[#1976D2]">${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="button"
              disabled={saving}
              onClick={handleSubmit}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#1976D2] py-2 text-sm font-bold text-white hover:bg-blue-700 transition disabled:opacity-50 shadow-sm"
            >
              {saving ? 'កំពុងរក្សាទុក...' : 'រក្សាទុកវិក្កយបត្រ'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}