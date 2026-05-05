import { addDays, subDays, format, isSameDay } from "date-fns";
import { ko } from "date-fns/locale";

interface Props {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export function WeeklyDateBar({ selectedDate, onSelectDate }: Props) {
  const today = new Date();
  
  // Generate 7 days centered around today
  const days = Array.from({ length: 7 }, (_, i) => {
    return addDays(subDays(today, 3), i);
  });

  return (
    <div className="flex overflow-x-auto gap-2 py-4 px-2 scrollbar-hide snap-x snap-mandatory">
      {days.map((date) => {
        const isSelected = isSameDay(date, selectedDate);
        const isToday = isSameDay(date, today);

        return (
          <button
            key={date.toISOString()}
            onClick={() => onSelectDate(date)}
            className={`
              snap-center shrink-0 flex flex-col items-center justify-center w-12 h-16 rounded-full transition-colors relative
              ${isSelected ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30" : "bg-card text-foreground hover:bg-secondary border border-border"}
              ${isToday && !isSelected ? "ring-2 ring-primary/30" : ""}
            `}
          >
            <span className="text-xs font-semibold uppercase mb-1">
              {format(date, "E", { locale: ko })}
            </span>
            <span className="text-base font-bold">
              {format(date, "d")}
            </span>
            {isToday && (
              <span className={`w-1 h-1 rounded-full absolute bottom-1.5 ${isSelected ? 'bg-primary-foreground' : 'bg-primary'}`} />
            )}
          </button>
        );
      })}
    </div>
  );
}
