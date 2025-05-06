
import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  className?: string
  mode?: "single" | "range" | "multiple"
  defaultMonth?: Date
  selected?: Date | DateRange | Date[] | undefined
  onSelect?: (date: DateRange | undefined) => void
}

export function DatePicker({ className, mode = "single", defaultMonth, selected, onSelect }: DatePickerProps) {
  const [date, setDate] = React.useState<DateRange | undefined>(
    mode === "range" && selected && "from" in selected ? selected : undefined
  )

  React.useEffect(() => {
    if (mode === "range" && selected && "from" in selected) {
      setDate(selected)
    }
  }, [selected, mode])

  const handleSelect = (selectedDate: DateRange | undefined) => {
    setDate(selectedDate)
    if (onSelect) {
      onSelect(selectedDate)
    }
  }

  const displayText = React.useMemo(() => {
    if (date?.from) {
      if (date.to) {
        return `${format(date.from, "LLL dd, y")} - ${format(date.to, "LLL dd, y")}`
      }
      return format(date.from, "LLL dd, y")
    }
    return "Select date range"
  }, [date])

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-auto justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {displayText}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={defaultMonth}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={2}
            className="p-3 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
