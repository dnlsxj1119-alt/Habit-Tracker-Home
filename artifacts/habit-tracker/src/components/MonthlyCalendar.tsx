import { useState } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, eachDayOfInterval } from "date-fns";
import { ko } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Routine } from "@/types/routine";

interface Props {
  routine: Routine;
  onToggle: (id: string, date: string) => void;
}

export function MonthlyCalendar({ routine, onToggle }: Props) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const dateFormat = "yyyy-MM-dd";
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  return (
    <div className="bg-card rounded-3xl p-5 shadow-sm border border-border">
      <div className="flex justify-between items-center mb-6">
        <button onClick={prevMonth} className="p-2 rounded-full hover:bg-secondary text-muted-foreground transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="font-bold text-lg">
          {format(currentMonth, "MMMM yyyy", { locale: ko })}
        </span>
        <button onClick={nextMonth} className="p-2 rounded-full hover:bg-secondary text-muted-foreground transition-colors">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-xs font-bold text-muted-foreground pb-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-2 gap-x-1">
        {days.map(day => {
          const dayStr = format(day, dateFormat);
          const isCompleted = routine.completedDates.includes(dayStr);
          const isToday = isSameDay(day, new Date());
          const isCurrentMonth = isSameMonth(day, monthStart);

          return (
            <button
              key={dayStr}
              onClick={() => onToggle(routine.id, dayStr)}
              className={`
                aspect-square flex items-center justify-center rounded-full text-sm transition-all
                ${!isCurrentMonth ? "text-muted-foreground/30" : "text-foreground"}
                ${isCompleted ? "bg-primary text-primary-foreground font-bold shadow-sm shadow-primary/30" : "hover:bg-secondary font-medium"}
                ${isToday && !isCompleted ? "border-2 border-primary/30 text-primary" : ""}
                ${isCompleted && !isCurrentMonth ? "opacity-50" : ""}
              `}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>
    </div>
  );
}
