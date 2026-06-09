import { addDays, subDays, format, isSameDay } from "date-fns";
import { ko } from "date-fns/locale";

interface Props {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export function WeeklyDateBar({ selectedDate, onSelectDate }: Props) {
  const today = new Date();

  const days = Array.from({ length: 7 }, (_, i) => addDays(subDays(selectedDate, 3), i));

  return (
    <div className="flex justify-between py-2">
      {days.map((date) => {
        const isSelected = isSameDay(date, selectedDate);
        const isToday = isSameDay(date, today);

        return (
          <button
            key={date.toISOString()}
            onClick={() => onSelectDate(date)}
            data-testid={`button-weekday-${format(date, "yyyy-MM-dd")}`}
            className={[
              "flex flex-col items-center justify-center w-10 h-12 rounded-full transition-colors relative",
              isSelected
                ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30"
                : "bg-card text-foreground hover:bg-secondary border border-border",
              isToday && !isSelected ? "ring-2 ring-primary/40" : "",
            ].join(" ")}
          >
            <span className="text-[10px] font-semibold uppercase mb-0.5">
              {format(date, "E", { locale: ko })}
            </span>
            <span className="text-sm font-bold">{format(date, "d")}</span>
            {isToday && (
              <span
                className={`w-1 h-1 rounded-full absolute bottom-1.5 ${
                  isSelected ? "bg-primary-foreground" : "bg-primary"
                }`}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
