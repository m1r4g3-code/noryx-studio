'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Modal } from '@/components/ui/Modal'
import { serviceSchema, type ServiceFormValues } from '@/lib/validations'
import { formatCurrency } from '@/lib/utils'
import type { ActionResult, Service } from '@/types'

interface ServicesTableProps {
  services: Service[]
  onCreate: (data: ServiceFormValues) => Promise<ActionResult>
  onUpdate: (id: string, data: ServiceFormValues) => Promise<ActionResult>
  onDelete: (id: string) => Promise<ActionResult>
  onToggleActive: (id: string, isActive: boolean) => Promise<ActionResult>
  onMoveUp: (id: string) => Promise<ActionResult>
  onMoveDown: (id: string) => Promise<ActionResult>
}

function ServiceForm({
  defaultValues,
  onSubmit,
  onCancel,
}: {
  defaultValues?: Partial<ServiceFormValues>
  onSubmit: (data: ServiceFormValues) => Promise<void>
  onCancel: () => void
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: defaultValues?.name ?? '',
      description: defaultValues?.description ?? '',
      price: defaultValues?.price ?? 0,
      duration_minutes: defaultValues?.duration_minutes ?? 30,
      is_active: defaultValues?.is_active ?? true,
      display_order: defaultValues?.display_order ?? 0,
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input label="Service Name" required error={errors.name?.message} {...register('name')} />
      <Textarea label="Description" rows={2} error={errors.description?.message} {...register('description')} />
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Price (₦)"
          type="number"
          required
          error={errors.price?.message}
          {...register('price', { valueAsNumber: true })}
        />
        <Input
          label="Duration (min)"
          type="number"
          required
          error={errors.duration_minutes?.message}
          {...register('duration_minutes', { valueAsNumber: true })}
        />
      </div>
      <Input
        label="Display Order"
        type="number"
        error={errors.display_order?.message}
        {...register('display_order', { valueAsNumber: true })}
      />
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="is_active"
          className="w-4 h-4 accent-gold"
          {...register('is_active')}
        />
        <label htmlFor="is_active" className="text-sm font-body text-text-primary">
          Active (visible on public site)
        </label>
      </div>
      <div className="flex gap-3 pt-1">
        <Button type="button" variant="ghost" size="md" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" variant="primary" size="md" isLoading={isSubmitting} className="flex-1">
          Save Service
        </Button>
      </div>
    </form>
  )
}

export function ServicesTable({
  services,
  onCreate,
  onUpdate,
  onDelete,
  onToggleActive,
  onMoveUp,
  onMoveDown,
}: ServicesTableProps) {
  const router = useRouter()
  const [modalMode, setModalMode] = useState<'add' | 'edit' | null>(null)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [error, setError] = useState('')

  const handleCreate = async (data: ServiceFormValues) => {
    const result = await onCreate(data)
    if (result.error) { setError(result.error); return }
    setModalMode(null)
    router.refresh()
  }

  const handleUpdate = async (data: ServiceFormValues) => {
    if (!editingService) return
    const result = await onUpdate(editingService.id, data)
    if (result.error) { setError(result.error); return }
    setModalMode(null)
    setEditingService(null)
    router.refresh()
  }

  const handleDelete = async (id: string) => {
    const result = await onDelete(id)
    if (result.error) { setError(result.error); return }
    setConfirmDeleteId(null)
    router.refresh()
  }

  const handleToggle = async (id: string, current: boolean) => {
    await onToggleActive(id, !current)
    router.refresh()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display text-2xl tracking-widest text-text-primary">SERVICES</h2>
        <Button
          variant="primary"
          size="sm"
          onClick={() => { setModalMode('add'); setError('') }}
        >
          + Add Service
        </Button>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-sm px-4 py-3 mb-4">
          <p className="text-red-400 text-sm font-body">{error}</p>
        </div>
      )}

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm font-body">
          <thead>
            <tr className="border-b border-border">
              {['Order', 'Name', 'Price', 'Duration', 'Status', 'Actions'].map((h) => (
                <th key={h} className="text-left text-[11px] uppercase tracking-[0.1em] text-text-muted font-semibold pb-3 pr-4 last:pr-0">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {services.map((service, index) => (
              <tr key={service.id} className="hover:bg-surface-elevated transition-colors">
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-1">
                    <button
                      disabled={index === 0}
                      onClick={() => { onMoveUp(service.id); router.refresh() }}
                      className="text-text-muted hover:text-gold disabled:opacity-20 transition-colors p-0.5"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <button
                      disabled={index === services.length - 1}
                      onClick={() => { onMoveDown(service.id); router.refresh() }}
                      className="text-text-muted hover:text-gold disabled:opacity-20 transition-colors p-0.5"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </td>
                <td className="py-3 pr-4">
                  <div className="font-medium text-text-primary">{service.name}</div>
                  {service.description && (
                    <div className="text-[11px] text-text-muted mt-0.5 max-w-xs truncate">{service.description}</div>
                  )}
                </td>
                <td className="py-3 pr-4 text-gold font-semibold">{formatCurrency(service.price)}</td>
                <td className="py-3 pr-4 text-text-muted">{service.duration_minutes} min</td>
                <td className="py-3 pr-4">
                  <button
                    onClick={() => handleToggle(service.id, service.is_active)}
                    className="flex items-center gap-2 group"
                  >
                    <div className={`w-8 h-4 rounded-full transition-colors ${service.is_active ? 'bg-gold' : 'bg-border'} relative`}>
                      <div className={`absolute top-0.5 w-3 h-3 bg-bg rounded-full transition-all ${service.is_active ? 'left-4' : 'left-0.5'}`} />
                    </div>
                    <Badge variant={service.is_active ? 'gold' : 'muted'}>
                      {service.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </button>
                </td>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { setEditingService(service); setModalMode('edit'); setError('') }}
                      className="text-text-muted hover:text-gold transition-colors p-1"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(service.id)}
                      className="text-text-muted hover:text-red-400 transition-colors p-1"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit modal */}
      <Modal
        isOpen={modalMode !== null}
        onClose={() => { setModalMode(null); setEditingService(null) }}
        title={modalMode === 'add' ? 'Add Service' : 'Edit Service'}
        size="md"
      >
        <ServiceForm
          defaultValues={
            editingService
              ? { ...editingService, description: editingService.description ?? undefined }
              : undefined
          }
          onSubmit={modalMode === 'add' ? handleCreate : handleUpdate}
          onCancel={() => { setModalMode(null); setEditingService(null) }}
        />
      </Modal>

      {/* Confirm delete modal */}
      <Modal
        isOpen={!!confirmDeleteId}
        onClose={() => setConfirmDeleteId(null)}
        title="Delete Service"
        size="sm"
      >
        <p className="text-text-muted text-sm font-body mb-5">
          Delete this service? Any linked appointments will remain but lose the service reference.
        </p>
        <div className="flex gap-3">
          <Button variant="ghost" size="md" onClick={() => setConfirmDeleteId(null)} className="flex-1">Cancel</Button>
          <Button variant="danger" size="md" onClick={() => confirmDeleteId && handleDelete(confirmDeleteId)} className="flex-1">Delete</Button>
        </div>
      </Modal>
    </div>
  )
}
