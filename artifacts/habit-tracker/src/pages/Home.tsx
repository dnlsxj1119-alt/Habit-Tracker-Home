import { useState } from "react";
import { format, addMonths, subMonths, startOfMonth, isSameMonth, isToday } from "date-fns";
import { ko } from "date-fns/locale";
import { Plus, ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { useRoutines } from "@/hooks/useRoutines";
import { WeeklyDateBar } from "@/components/WeeklyDateBar";
import { RoutineCard } from "@/components/RoutineCard";
import { RoutineForm } from "@/components/RoutineForm";
import { HomeCalendarModal } from "@/components/HomeCalendarModal";

export default function Home() {
  const { routines, addRoutine, toggleDate } = useRoutines();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const selectedDateStr = format(selectedDate, "yyyy-MM-dd");
  const today = new Date();

  // Move to previous month: jump selectedDate to 1st of prev month
  // (if currently on today's month, keep today otherwise use 1st)
  const handlePrevMonth = () => {
    const prevMonth = subMonths(selectedDate, 1);
    const firstOfPrev = startOfMonth(prevMonth);
    setSelectedDate(firstOfPrev);
  };

  // Move to next month: jump to 1st of next month, or today if that's current month
  const handleNextMonth = () => {
    const nextMonth = addMonths(selectedDate, 1);
    if (isSameMonth(nextMonth, today)) {
      setSelectedDate(today);
    } else {
      setSelectedDate(startOfMonth(nextMonth));
    }
  };

  // When a date is selected from any source (weekly bar or calendar modal)
  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <div className="min-h-[100dvh] bg-background w-full max-w-[430px] mx-auto shadow-2xl relative pb-24 flex flex-col font-sans">
      <header className="px-6 pt-12 pb-2 sticky top-0 bg-background/90 backdrop-blur-xl z-10 border-b border-border/40">
        {/* Month navigation row */}
        <div className="flex items-center justify-between mb-1">
          <button
            onClick={handlePrevMonth}
            data-testid="button-prev-month"
            className="p-2 -ml-2 rounded-full hover:bg-secondary text-muted-foreground transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
            {format(selectedDate, "yyyy년 M월", { locale: ko })}
          </h1>

          <button
            onClick={handleNextMonth}
            data-testid="button-next-month"
            className="p-2 -mr-2 rounded-full hover:bg-secondary text-muted-foreground transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Calendar button row */}
        <div className="flex justify-center pb-1">
          <button
            onClick={() => setIsCalendarOpen(true)}
            data-testid="button-open-calendar"
            className="flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors"
          >
            <CalendarDays className="w-3.5 h-3.5" />
            전체 달력 보기
          </button>
        </div>
      </header>

      <div className="px-4">
        <WeeklyDateBar selectedDate={selectedDate} onSelectDate={handleSelectDate} />
      </div>

      <main className="flex-1 px-6 pt-4 flex flex-col gap-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              {isToday(selectedDate) ? "오늘의 루틴" : format(selectedDate, "M월 d일 루틴", { locale: ko })}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {format(selectedDate, "yyyy년 M월 d일 EEEE", { locale: ko })}
            </p>
          </div>
          <span className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
            {routines.length}개
          </span>
        </div>

        {routines.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-6 shadow-inner">
              <Plus className="w-10 h-10 text-muted-foreground/50" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-foreground">루틴이 없습니다</h3>
            <p className="text-sm text-muted-foreground max-w-[200px] leading-relaxed">
              오른쪽 아래 버튼을 눌러<br />새로운 루틴을 추가해보세요.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {routines.map((routine) => (
              <RoutineCard
                key={routine.id}
                routine={routine}
                selectedDateStr={selectedDateStr}
                onToggle={toggleDate}
              />
            ))}
          </div>
        )}
      </main>

      {/* FAB */}
      <button
        onClick={() => setIsFormOpen(true)}
        data-testid="button-add-routine"
        className="fixed bottom-8 right-1/2 translate-x-[160px] w-16 h-16 bg-primary text-primary-foreground rounded-[24px] shadow-xl shadow-primary/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform z-20"
        style={{ transform: "translateX(calc(min(430px, 100vw)/2 - 4.5rem))" }}
      >
        <Plus className="w-8 h-8" />
      </button>

      <RoutineForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSave={addRoutine}
      />

      <HomeCalendarModal
        open={isCalendarOpen}
        onOpenChange={setIsCalendarOpen}
        selectedDate={selectedDate}
        onSelectDate={handleSelectDate}
      />
    </div>
  );
}
