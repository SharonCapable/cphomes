'use client'

import { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { DateRange } from 'react-day-picker'
import { isSameDay, isWithinInterval } from 'date-fns'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface BookingCalendarProps {
    disabledDates?: { start: Date; end: Date }[]
    onRangeSelect: (range: DateRange | undefined) => void
    pricePerNight: number
}

export default function BookingCalendar({ disabledDates = [], onRangeSelect, pricePerNight }: BookingCalendarProps) {
    const [range, setRange] = useState<DateRange | undefined>()

    const isDateDisabled = (date: Date) => {
        // Disable past dates
        if (date < new Date(new Date().setHours(0, 0, 0, 0))) return true

        // Disable booked dates
        return disabledDates.some(interval =>
            isWithinInterval(date, { start: interval.start, end: interval.end }) ||
            isSameDay(date, interval.start) ||
            isSameDay(date, interval.end)
        )
    }

    const handleSelect = (newRange: DateRange | undefined) => {
        setRange(newRange)
        onRangeSelect(newRange)
    }

    return (
        <div className="space-y-6">
            <div className="p-4 bg-secondary/10 rounded-[2rem] border border-primary/5">
                <Calendar
                    mode="range"
                    selected={range}
                    onSelect={handleSelect}
                    disabled={isDateDisabled}
                    className="rounded-md border-none mx-auto"
                    classNames={{
                        day_selected: "bg-primary text-white hover:bg-primary/90 rounded-md",
                        day_today: "text-accent font-bold underline decoration-2 underline-offset-4",
                        head_cell: "text-muted-foreground font-bold text-[10px] uppercase tracking-widest pb-4",
                        caption: "flex justify-center pt-1 relative items-center mb-4",
                        caption_label: "text-sm font-bold heading-serif uppercase tracking-widest",
                    }}
                />
            </div>

            {range?.from && range?.to && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 bg-accent/5 rounded-2xl border border-accent/10 flex justify-between items-center"
                >
                    <div>
                        <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1">Stay Duration</p>
                        <p className="text-sm font-bold">
                            {Math.ceil((range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24))} Nights
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1">Est. Investment</p>
                        <p className="text-xl font-bold text-primary">
                            ${(Math.ceil((range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24)) * pricePerNight).toLocaleString()}
                        </p>
                    </div>
                </motion.div>
            )}
        </div>
    )
}
