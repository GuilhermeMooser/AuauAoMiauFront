// import * as React from "react";
// import { format } from "date-fns";
// import { ptBR } from "date-fns/locale";
// import { CalendarIcon } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";

// interface DatePickerProps {
//   date?: Date | null;
//   onDateChange: (date: Date | undefined) => void;
//   placeholder?: string;
//   disabled?: boolean;
//   disablePastDates?: boolean;
//   className?: string;
// }

// export function DatePicker({
//   date,
//   onDateChange,
//   placeholder = "Selecione uma data",
//   disabled = false,
//   className,
//   disablePastDates = false,
// }: DatePickerProps) {
//   return (
//     <Popover>
//       <PopoverTrigger asChild>
//         <Button
//           variant={"outline"}
//           className={cn(
//             "w-full justify-start text-left font-normal",
//             !date && "text-muted-foreground",
//             className
//           )}
//           disabled={disabled}
//         >
//           <CalendarIcon className="mr-2 h-4 w-4" />
//           {date ? (
//             format(date, "PPP", { locale: ptBR })
//           ) : (
//             <span>{placeholder}</span>
//           )}
//         </Button>
//       </PopoverTrigger>
//       <PopoverContent className="w-auto p-0" align="start">
//         <Calendar
//           mode="single"
//           selected={date ? date : undefined}
//           onSelect={onDateChange}
//           initialFocus
//           locale={ptBR}
//           disabled={
//             disablePastDates
//               ? (d) => d < new Date(new Date().setHours(0, 0, 0, 0))
//               : undefined
//           }
//           captionLayout="dropdown-buttons"
//           fromYear={1960}
//           toYear={new Date().getFullYear() + 5}
//           className="pointer-events-auto"
//         />
//       </PopoverContent>
//     </Popover>
//   );
// }
"use client";

import * as React from "react";
import { format, setYear, setMonth, getYear, getMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  date?: Date | null;
  onDateChange: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  disablePastDates?: boolean;
  className?: string;
  fromYear?: number;
  toYear?: number;
}

const MONTHS_PT = [
  "Janeiro", "Fevereiro", "Março", "Abril",
  "Maio", "Junho", "Julho", "Agosto",
  "Setembro", "Outubro", "Novembro", "Dezembro",
];

export function DatePicker({
  date,
  onDateChange,
  placeholder = "Selecione uma data",
  disabled = false,
  className,
  disablePastDates = false,
  fromYear = 1900,
  toYear = new Date().getFullYear() + 10,
}: DatePickerProps) {
  const [month, setMonthState] = React.useState<Date>(
    date ? new Date(date) : new Date()
  );
  const [yearDropdownOpen, setYearDropdownOpen] = React.useState(false);
  const yearListRef = React.useRef<HTMLDivElement>(null);
  const selectedYearRef = React.useRef<HTMLButtonElement>(null);

  const currentYear = getYear(month);
  const currentMonth = getMonth(month);

  const years = React.useMemo(() => {
    const arr: number[] = [];
    for (let y = toYear; y >= fromYear; y--) {
      arr.push(y);
    }
    return arr;
  }, [fromYear, toYear]);

  // Scroll to selected year when dropdown opens
  React.useEffect(() => {
    if (yearDropdownOpen && selectedYearRef.current && yearListRef.current) {
      setTimeout(() => {
        selectedYearRef.current?.scrollIntoView({
          block: "center",
          behavior: "instant",
        });
      }, 0);
    }
  }, [yearDropdownOpen]);

  function handleYearSelect(year: number) {
    setMonthState((prev) => setYear(prev, year));
    setYearDropdownOpen(false);
  }

  function handleMonthChange(delta: number) {
    setMonthState((prev) => {
      const next = new Date(prev);
      next.setMonth(next.getMonth() + delta);
      return next;
    });
  }

  function handleMonthSelect(monthIndex: number) {
    setMonthState((prev) => setMonth(prev, monthIndex));
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            format(date, "PPP", { locale: ptBR })
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0" align="start">
        {/* Custom Caption / Header */}
        <div className="flex items-center justify-between px-3 pt-3 pb-1 gap-1">
          {/* Prev month */}
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7 shrink-0"
            onClick={() => handleMonthChange(-1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Month select */}
          <select
            value={currentMonth}
            onChange={(e) => handleMonthSelect(Number(e.target.value))}
            className={cn(
              "flex-1 rounded-md border border-input bg-background px-2 py-1",
              "text-sm font-medium text-center cursor-pointer",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
              "appearance-none"
            )}
          >
            {MONTHS_PT.map((m, i) => (
              <option key={i} value={i}>
                {m}
              </option>
            ))}
          </select>

          {/* Year — custom scrollable dropdown */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              className="h-7 min-w-[64px] px-2 text-sm font-medium"
              onClick={() => setYearDropdownOpen((prev) => !prev)}
            >
              {currentYear}
            </Button>

            {yearDropdownOpen && (
              <>
                {/* Overlay to close on outside click */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setYearDropdownOpen(false)}
                />

                <div
                  ref={yearListRef}
                  className={cn(
                    "absolute right-0 top-8 z-50 w-[80px]",
                    "max-h-[200px] overflow-y-auto overscroll-contain",
                    "rounded-md border border-border bg-popover shadow-md",
                    "flex flex-col py-1"
                  )}
                >
                  {years.map((year) => (
                    <button
                      key={year}
                      ref={year === currentYear ? selectedYearRef : undefined}
                      onClick={() => handleYearSelect(year)}
                      className={cn(
                        "w-full px-2 py-1 text-sm text-left",
                        "hover:bg-accent hover:text-accent-foreground",
                        "focus:outline-none focus:bg-accent",
                        year === currentYear &&
                          "bg-primary text-primary-foreground font-semibold hover:bg-primary hover:text-primary-foreground"
                      )}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Next month */}
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7 shrink-0"
            onClick={() => handleMonthChange(1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Calendar — sem caption nativa */}
        <Calendar
          mode="single"
          selected={date ? date : undefined}
          onSelect={onDateChange}
          month={month}
          onMonthChange={setMonthState}
          initialFocus
          locale={ptBR}
          disabled={
            disablePastDates
              ? (d) => d < new Date(new Date().setHours(0, 0, 0, 0))
              : undefined
          }
          // Remove o caption padrão do shadcn
          classNames={{
            caption: "hidden",
            head_row: "flex",
            head_cell:
              "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
            row: "flex w-full mt-2",
            cell: "h-9 w-9 text-center text-sm p-0 relative",
            day: cn(
              "h-9 w-9 p-0 font-normal",
              "hover:bg-accent hover:text-accent-foreground rounded-md",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
            ),
            day_selected:
              "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground rounded-md",
            day_today: "bg-accent text-accent-foreground rounded-md",
            day_outside: "text-muted-foreground opacity-50",
            day_disabled: "text-muted-foreground opacity-50 cursor-not-allowed",
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
