import { useState } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, eachDayOfInterval, isFuture } from "date-fns";
import { ko } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRoutines } from "@/hooks/useRoutines";
import { AchievementDetailModal } from "@/components/AchievementDetailModal";

export default function Achievement() {
  const { routines } = useRoutines();
  const [currentMonth, setCurrentMonth] = useState(() => startOfMonth(new Date()));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  const getActiveRoutines = (day: Date) => {
    return routines.filter(r => new Date(r.createdAt).getTime() <= day.getTime() + 24*60*60*1000 - 1);
  };

  const getDayLevel = (day: Date) => {
    if (isFuture(day)) return -1;
    const active = getActiveRoutines(day);
    if (active.length === 0) return -1;
    
    const dayStr = format(day, "yyyy-MM-dd");
    const completed = active.filter(r => r.completedDates.includes(dayStr)).length;
    const rate = Math.round((completed / active.length) * 100);

    if (rate === 0) return 0;
    if (rate <= 25) return 1;
    if (rate <= 50) return 2;
    if (rate <= 75) return 3;
    return 4;
  };

  const getLevelClass = (level: number) => {
    switch (level) {
      case -1: return "bg-transparent border border-dashed border-border opacity-50 text-muted-foreground";
      case 0: return "bg-secondary text-muted-foreground";
      case 1: return "bg-[var(--theme-l1)] text-foreground/80";
      case 2: return "bg-[var(--theme-l2)] text-foreground/90";
      case 3: return "bg-[var(--theme-l3)] text-white";
      case 4: return "bg-[var(--theme-l4)] text-white";
      default: return "bg-secondary text-muted-foreground";
    }
  };

  return (
    <div className="min-h-[100dvh] bg-background w-full max-w-[430px] mx-auto shadow-2xl relative pb-20 font-sans">
      <header className="px-6 pt-12 pb-4 sticky top-0 bg-background/90 backdrop-blur-xl z-10 border-b border-border/40">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">달성률</h1>
      </header>

      <main className="px-4 py-6">
        <div className="bg-card rounded-3xl p-5 shadow-sm border border-border">
          <div className="flex justify-between items-center mb-6 px-2">
            <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 rounded-full hover:bg-secondary text-muted-foreground transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-bold text-lg">
              {format(currentMonth, "yyyy년 M월", { locale: ko })}
            </span>
            <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 rounded-full hover:bg-secondary text-muted-foreground transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-2">
            {weekDays.map(day => (
              <div key={day} className="text-center text-xs font-bold text-muted-foreground pb-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {days.map(day => {
              const isCurrentMonth = isSameMonth(day, monthStart);
              const level = getDayLevel(day);
              
              let completedStr = null;
              if (level !== -1) {
                const active = getActiveRoutines(day);
                if (active.length > 0) {
                  const dayStr = format(day, "yyyy-MM-dd");
                  const completed = active.filter(r => r.completedDates.includes(dayStr)).length;
                  completedStr = `${completed}/${active.length}`;
                }
              }

              return (
                <button
                  key={day.toISOString()}
                  disabled={level === -1}
                  onClick={() => setSelectedDate(day)}
                  className={`
                    aspect-square rounded-[8px] flex flex-col items-center justify-center transition-transform hover:scale-110
                    ${!isCurrentMonth ? "opacity-30" : ""}
                    ${getLevelClass(level)}
                  `}
                >
                  <span className={`font-bold ${completedStr ? 'text-[11px] sm:text-xs leading-none mt-0.5' : 'text-xs'}`}>
                    {format(day, "d")}
                  </span>
                  {completedStr && (
                    <span className="text-[8px] sm:text-[9px] font-medium opacity-60 tracking-tighter leading-none mt-1">
                      {completedStr}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-end gap-1.5 mt-8 text-[10px] font-bold text-muted-foreground">
            <span>Low</span>
            <div className="w-3 h-3 rounded-[3px] bg-secondary" />
            <div className="w-3 h-3 rounded-[3px] bg-[var(--theme-l1)]" />
            <div className="w-3 h-3 rounded-[3px] bg-[var(--theme-l2)]" />
            <div className="w-3 h-3 rounded-[3px] bg-[var(--theme-l3)]" />
            <div className="w-3 h-3 rounded-[3px] bg-[var(--theme-l4)]" />
            <span>High</span>
          </div>
        </div>
      </main>

      <AchievementDetailModal
        open={!!selectedDate}
        onOpenChange={(open) => !open && setSelectedDate(null)}
        date={selectedDate}
        activeRoutines={selectedDate ? getActiveRoutines(selectedDate) : []}
      />
    </div>
  );
}
