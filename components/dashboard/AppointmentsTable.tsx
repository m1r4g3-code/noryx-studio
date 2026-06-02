'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { cn, formatDateShort, formatTime } from '@/lib/utils'
import type { ActionResult, AppointmentStatus, AppointmentWithService } from '@/types'

interface AppointmentsTableProps {
  appointments: AppointmentWithService[]
  onStatusChange: (id: string, status: AppointmentStatus) => Promise<ActionResult>
  onDelete: (id: string) => Promise<ActionResult>
}

const STATUS_FILTERS: { value: AppointmentStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

const statusBadgeVariant: Record<AppointmentStatus, 'yellow' | 'blue' | 'muted' | 'red'> = {
  pending: 'yellow',
  confirmed: 'blue',
  completed: 'muted',
  cancelled: 'red',
}

export function AppointmentsTable({
  appointments,
  onStatusChange,
  onDelete,
}: AppointmentsTableProps) {
  const router = useRouter()
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | 'all'>('all')
  const [detailAppt, setDetailAppt] = useState<AppointmentWithService | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const filtered =
    statusFilter === 'all'
      ? appointments
      : appointments.filter((a) => a.status === statusFilter)

  const handleStatusChange = async (id: string, status: AppointmentStatus) => {
    setUpdatingId(id)
    await onStatusChange(id, status)
    router.refresh()
    setUpdatingId(null)
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    await onDelete(id)
    router.refresh()
    setDeletingId(null)
    setConfirmDeleteId(null)
  }

  return (
    <div>
      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2 mb-5">
        {STATUS_FILTERS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setStatusFilter(value)}
            className={`px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] font-body rounded-sm border transition-all ${
              statusFilter === value
                ? 'bg-gold/10 border-gold/30 text-gold'
                : 'bg-surface border-border text-text-muted hover:border-gold/30 hover:text-text-primary'
            }`}
          >
            {label}
            {value !== 'all' && (
              <span className="ml-1.5 text-[10px] opacity-70">
                ({appointments.filter((a) => a.status === value).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Table — desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm font-body">
          <thead>
            <tr className="border-b border-border">
              {['Reference', 'Client', 'Service', 'Date', 'Time', 'Status', 'Actions'].map((h) => (
                <th
                  key={h}
                  className="text-left text-[11px] uppercase tracking-[0.1em] text-text-muted font-semibold pb-3 pr-4 last:pr-0"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-text-muted">
                  No appointments found.
                </td>
              </tr>
            ) : (
              filtered.map((appt) => (
                <tr
                  key={appt.id}
                  className="hover:bg-surface-elevated transition-colors cursor-pointer"
                  onClick={() => setDetailAppt(appt)}
                >
                  <td className="py-3 pr-4">
                    <span className="text-gold font-semibold tracking-wider text-xs">
                      {appt.reference}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <div className="font-medium text-text-primary">{appt.client_name}</div>
                    <div className="text-[11px] text-text-muted">{appt.client_phone}</div>
                  </td>
                  <td className="py-3 pr-4 text-text-muted">
                    {appt.services?.name ?? '—'}
                  </td>
                  <td className="py-3 pr-4 text-text-muted whitespace-nowrap">
                    {formatDateShort(appt.appointment_date)}
                  </td>
                  <td className="py-3 pr-4 text-text-muted whitespace-nowrap">
                    {formatTime(appt.appointment_time)}
                  </td>
                  <td className="py-3 pr-4" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={appt.status}
                      disabled={updatingId === appt.id}
                      onChange={(e) =>
                        handleStatusChange(appt.id, e.target.value as AppointmentStatus)
                      }
                      className="bg-surface border border-border text-text-primary text-xs px-2 py-1 rounded-sm focus:border-gold outline-none cursor-pointer"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="py-3" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setConfirmDeleteId(appt.id)}
                      className="text-text-muted hover:text-red-400 transition-colors p-1"
                      aria-label="Delete"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Cards — mobile */}
      <div className="md:hidden flex flex-col gap-3">
        {filtered.length === 0 ? (
          <p className="text-center text-text-muted py-8 font-body text-sm">
            No appointments found.
          </p>
        ) : (
          filtered.map((appt) => (
            <div
              key={appt.id}
              className="bg-surface border border-border rounded-sm p-4"
              onClick={() => setDetailAppt(appt)}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-gold font-semibold text-xs tracking-wider font-body">
                  {appt.reference}
                </span>
                <Badge variant={statusBadgeVariant[appt.status]}>
                  {appt.status}
                </Badge>
              </div>
              <div className="font-medium text-text-primary font-body">{appt.client_name}</div>
              <div className="text-xs text-text-muted font-body mt-1">
                {appt.services?.name} · {formatDateShort(appt.appointment_date)} · {formatTime(appt.appointment_time)}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Detail modal */}
      <Modal
        isOpen={!!detailAppt}
        onClose={() => setDetailAppt(null)}
        title="Appointment Details"
        size="md"
      >
        {detailAppt && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Reference', value: detailAppt.reference },
                { label: 'Status', value: detailAppt.status.toUpperCase() },
                { label: 'Client', value: detailAppt.client_name },
                { label: 'Phone', value: detailAppt.client_phone },
                ...(detailAppt.client_email
                  ? [{ label: 'Email', value: detailAppt.client_email }]
                  : []),
                { label: 'Service', value: detailAppt.services?.name ?? '—' },
                { label: 'Date', value: formatDateShort(detailAppt.appointment_date) },
                { label: 'Time', value: formatTime(detailAppt.appointment_time) },
                ...(detailAppt.notes ? [{ label: 'Notes', value: detailAppt.notes }] : []),
              ].map(({ label, value }) => (
                <div key={label} className="col-span-1">
                  <div className="text-[10px] uppercase tracking-[0.12em] text-text-muted font-body font-semibold mb-0.5">
                    {label}
                  </div>
                  <div className="text-sm text-text-primary font-body">{value}</div>
                </div>
              ))}
            </div>
            {/* Change status — works on mobile and desktop */}
            <div className="border-t border-border pt-4">
              <div className="text-[10px] uppercase tracking-[0.12em] text-text-muted font-body font-semibold mb-2">
                Change Status
              </div>
              <div className="grid grid-cols-2 gap-2">
                {(['pending', 'confirmed', 'completed', 'cancelled'] as AppointmentStatus[]).map((s) => (
                  <button
                    key={s}
                    disabled={updatingId === detailAppt.id}
                    onClick={async () => {
                      await handleStatusChange(detailAppt.id, s)
                      setDetailAppt((prev) => (prev ? { ...prev, status: s } : prev))
                    }}
                    className={cn(
                      'px-3 py-2.5 text-xs font-semibold uppercase tracking-[0.1em] rounded-sm border transition-colors disabled:opacity-50',
                      detailAppt.status === s
                        ? 'bg-gold/10 border-gold/40 text-gold'
                        : 'bg-surface border-border text-text-muted hover:border-gold/40 hover:text-text-primary'
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDetailAppt(null)}
                className="flex-1"
              >
                Close
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  setConfirmDeleteId(detailAppt.id)
                  setDetailAppt(null)
                }}
                className="flex-1"
              >
                Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Confirm delete modal */}
      <Modal
        isOpen={!!confirmDeleteId}
        onClose={() => setConfirmDeleteId(null)}
        title="Delete Appointment"
        size="sm"
      >
        <p className="text-text-muted text-sm font-body mb-5">
          Are you sure you want to delete this appointment? This cannot be undone.
        </p>
        <div className="flex gap-3">
          <Button
            variant="ghost"
            size="md"
            onClick={() => setConfirmDeleteId(null)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            isLoading={deletingId === confirmDeleteId}
            onClick={() => confirmDeleteId && handleDelete(confirmDeleteId)}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  )
}
