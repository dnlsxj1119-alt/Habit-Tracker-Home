import { useState } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  eachDayOfInterval,
} from "date-fns";
import { ko } from "date-fns/locale";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

const WEEK_DAYS = ["일", "월", "화", "수", "목", "금", "토"];

export function HomeCalendarModal({ open, onOpenChange, selectedDate, onSelectDate }: Props) {
  const [viewMonth, setViewMonth] = useState(() => startOfMonth(selectedDate));

  const today = new Date();
  const monthStart = startOfMonth(viewMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const handleSelectDate = (date: Date) => {
    onSelectDate(date);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[380px] w-[90vw] rounded-3xl p-0 overflow-hidden border-border gap-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/50">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setViewMonth(subMonths(viewMonth, 1))}
              className="p-2 rounded-full hover:bg-secondary text-muted-foreground transition-colors"
              data-testid="button-prev-month-modal"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <DialogTitle className="text-lg font-bold text-foreground">
              {format(viewMonth, "yyyy년 M월", { locale: ko })}
            </DialogTitle>
            <button
              onClick={() => setViewMonth(addMonths(viewMonth, 1))}
              className="p-2 rounded-full hover:bg-secondary text-muted-foreground transition-colors"
              data-testid="button-next-month-modal"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </DialogHeader>

        <div className="px-6 pb-6 pt-4">
          <div className="grid grid-cols-7 gap-1 mb-2">
            {WEEK_DAYS.map((day) => (
              <div
                key={day}
                className="text-center text-xs font-bold text-muted-foreground py-1"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-1 gap-x-1">
            {days.map((day) => {
              const isSelected = isSameDay(day, selectedDate);
              const isToday = isSameDay(day, today);
              const isCurrentMonth = isSameMonth(day, monthStart);

              return (
                <button
                  key={day.toISOString()}
                  onClick={() => handleSelectDate(day)}
                  data-testid={`button-cal-day-${format(day, "yyyy-MM-dd")}`}
                  className={[
                    "aspect-square flex items-center justify-center rounded-full text-sm font-medium transition-all",
                    !isCurrentMonth ? "text-muted-foreground/30 hover:bg-secondary/50" : "text-foreground hover:bg-secondary",
                    isSelected ? "bg-primary text-primary-foreground font-bold shadow-sm shadow-primary/30 hover:bg-primary" : "",
                    isToday && !isSelected ? "border-2 border-primary text-primary font-bold" : "",
                  ].join(" ")}
                >
                  {format(day, "d")}
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex justify-center">
            <button
              onClick={() => {
                setViewMonth(startOfMonth(today));
                handleSelectDate(today);
              }}
              className="text-sm font-semibold text-primary bg-primary/10 px-4 py-2 rounded-full hover:bg-primary/20 transition-colors"
              data-testid="button-go-today"
            >
              오늘로 이동
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
