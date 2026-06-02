'use client'

import { useState, useEffect } from 'react'
import { DayPicker } from 'react-day-picker'
import { format, isBefore, startOfDay } from 'date-fns'
import 'react-day-picker/dist/style.css'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { cn, formatTime } from '@/lib/utils'

interface DateTimeSelectProps {
  selectedDate: Date | null
  selectedTime: string | null
  onDateSelect: (date: Date) => void
  onTimeSelect: (time: string) => void
  onBack: () => void
  onNext: () => void
}

export function DateTimeSelect({
  selectedDate,
  selectedTime,
  onDateSelect,
  onTimeSelect,
  onBack,
  onNext,
}: DateTimeSelectProps) {
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [bookedTimes, setBookedTimes] = useState<string[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)

  // Fetch configured time slots once
  useEffect(() => {
    const fetchSlots = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'time_slots')
        .single()
      if (data?.value) {
        setAvailableSlots(data.value as string[])
      }
    }
    fetchSlots()
  }, [])

  // When date changes, fetch booked times for that date
  useEffect(() => {
    if (!selectedDate) return

    const fetchBookedTimes = async () => {
      setLoadingSlots(true)
      const supabase = createClient()
      const dateStr = format(selectedDate, 'yyyy-MM-dd')
      const { data } = await supabase
        .from('appointments')
        .select('appointment_time')
        .eq('appointment_date', dateStr)
        .in('status', ['pending', 'confirmed'])

      const times = (data ?? []).map((a: { appointment_time: string }) => {
        // Normalize HH:MM:SS → HH:MM
        return a.appointment_time.substring(0, 5)
      })
      setBookedTimes(times)
      setLoadingSlots(false)
    }

    fetchBookedTimes()
  }, [selectedDate])

  const today = startOfDay(new Date())
  const isDateDisabled = (date: Date) => isBefore(date, today)

  return (
    <div className="w-full">
      <h2 className="font-display text-3xl tracking-[0.08em] text-text-primary mb-2">
        PICK A DATE & TIME
      </h2>
      <p className="text-text-muted text-sm font-body mb-8">
        Select your preferred date and available time slot.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Calendar */}
        <div className="bg-surface border border-border rounded-sm p-4">
          <DayPicker
            mode="single"
            selected={selectedDate ?? undefined}
            onSelect={(date) => date && onDateSelect(date)}
            disabled={isDateDisabled}
            fromDate={today}
            modifiersClassNames={{
              selected: 'rdp-day_selected',
              today: 'rdp-day_today',
              disabled: 'rdp-day_disabled',
            }}
          />
        </div>

        {/* Time slots */}
        <div>
          <div className="mb-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-text-muted font-body">
              {selectedDate
                ? `Available Times — ${format(selectedDate, 'MMMM d, yyyy')}`
                : 'Select a date first'}
            </h3>
          </div>

          {!selectedDate ? (
            <div className="bg-surface border border-border rounded-sm p-8 text-center">
              <p className="text-text-muted text-sm font-body">
                ← Choose a date on the calendar
              </p>
            </div>
          ) : loadingSlots ? (
            <div className="bg-surface border border-border rounded-sm p-8 text-center">
              <p className="text-text-muted text-sm font-body">Loading availability...</p>
            </div>
          ) : availableSlots.length === 0 ? (
            <div className="bg-surface border border-border rounded-sm p-8 text-center">
              <p className="text-text-muted text-sm font-body">No time slots configured.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {availableSlots.map((slot) => {
                const isBooked = bookedTimes.includes(slot)
                const isSelected = selectedTime === slot

                return (
                  <button
                    key={slot}
                    type="button"
                    disabled={isBooked}
                    onClick={() => !isBooked && onTimeSelect(slot)}
                    className={cn(
                      'py-2.5 text-sm font-body font-semibold tracking-wider rounded-sm border transition-all',
                      isBooked &&
                        'opacity-25 cursor-not-allowed border-border text-text-muted',
                      isSelected && !isBooked &&
                        'bg-gold border-gold text-bg',
                      !isSelected && !isBooked &&
                        'bg-surface border-border text-text-primary hover:border-gold hover:text-gold'
                    )}
                  >
                    {formatTime(slot)}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-4 mt-8">
        <Button variant="secondary" size="lg" onClick={onBack}>
          Back
        </Button>
        <Button
          variant="primary"
          size="lg"
          disabled={!selectedDate || !selectedTime}
          onClick={onNext}
          className="flex-1"
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
