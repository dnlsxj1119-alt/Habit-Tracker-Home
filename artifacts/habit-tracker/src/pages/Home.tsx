import { useState } from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Plus } from "lucide-react";
import { useRoutines } from "@/hooks/useRoutines";
import { WeeklyDateBar } from "@/components/WeeklyDateBar";
import { RoutineCard } from "@/components/RoutineCard";
import { RoutineForm } from "@/components/RoutineForm";

export default function Home() {
  const { routines, addRoutine, toggleDate } = useRoutines();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isFormOpen, setIsFormOpen] = useState(false);

  const selectedDateStr = format(selectedDate, "yyyy-MM-dd");

  return (
    <div className="min-h-[100dvh] bg-background w-full max-w-[430px] mx-auto shadow-2xl relative pb-24 flex flex-col font-sans">
      <header className="px-6 pt-12 pb-2 sticky top-0 bg-background/90 backdrop-blur-xl z-10 border-b border-border/40">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          {format(selectedDate, "MMMM yyyy", { locale: ko })}
        </h1>
      </header>

      <div className="px-4">
        <WeeklyDateBar selectedDate={selectedDate} onSelectDate={setSelectedDate} />
      </div>

      <main className="flex-1 px-6 pt-6 flex flex-col gap-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold tracking-tight text-foreground">오늘의 루틴</h2>
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
              오른쪽 아래 버튼을 눌러<br/>새로운 루틴을 추가해보세요.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {routines.map(routine => (
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

      <button
        onClick={() => setIsFormOpen(true)}
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
    </div>
  );
}
