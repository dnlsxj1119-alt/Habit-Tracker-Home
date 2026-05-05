import { useState, useRef } from "react";
import { format, addDays, subDays, isToday } from "date-fns";
import { ko } from "date-fns/locale";
import { Plus, ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { useRoutines } from "@/hooks/useRoutines";
import { WeeklyDateBar } from "@/components/WeeklyDateBar";
import { RoutineCard } from "@/components/RoutineCard";
import { RoutineForm } from "@/components/RoutineForm";
import { HomeCalendarModal } from "@/components/HomeCalendarModal";

const ALL_CATEGORIES = ["전체", "건강", "운동", "학습", "마음", "생활", "기타"] as const;
type Category = typeof ALL_CATEGORIES[number];

const CATEGORY_SUMMARY_COLORS: Record<string, string> = {
  "건강": "text-red-600 bg-red-50 border-red-100",
  "운동": "text-blue-600 bg-blue-50 border-blue-100",
  "학습": "text-purple-600 bg-purple-50 border-purple-100",
  "마음": "text-amber-600 bg-amber-50 border-amber-100",
  "생활": "text-teal-600 bg-teal-50 border-teal-100",
  "기타": "text-gray-600 bg-gray-50 border-gray-200",
};

export default function Home() {
  const { routines, addRoutine, toggleDate, reorderRoutines } = useRoutines();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCategory, setSelectedCategory] = useState<Category>("전체");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Drag state
  const draggedId = useRef<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const selectedDateStr = format(selectedDate, "yyyy-MM-dd");

  const handlePrevWeek = () => setSelectedDate((d) => subDays(d, 7));
  const handleNextWeek = () => setSelectedDate((d) => addDays(d, 7));
  const handleSelectDate = (date: Date) => setSelectedDate(date);

  // Drag handlers
  const handleDragStart = (id: string) => (e: React.DragEvent) => {
    draggedId.current = id;
    setDraggingId(id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDragOver = (id: string) => (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (draggedId.current !== id) setDragOverId(id);
  };

  const handleDrop = (id: string) => (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedId.current && draggedId.current !== id) {
      reorderRoutines(draggedId.current, id);
    }
    setDragOverId(null);
  };

  const handleDragEnd = () => {
    draggedId.current = null;
    setDraggingId(null);
    setDragOverId(null);
  };

  // Category counts (all routines, not filtered by date)
  const categoryCounts = ALL_CATEGORIES.reduce<Record<string, number>>((acc, cat) => {
    acc[cat] = cat === "전체"
      ? routines.length
      : routines.filter(r => r.category === cat).length;
    return acc;
  }, {});

  // Filtered list for display
  const filteredRoutines = selectedCategory === "전체"
    ? routines
    : routines.filter(r => r.category === selectedCategory);

  // Category completion summary for selected date (only categories that have routines)
  const categoryStats = ALL_CATEGORIES.filter(c => c !== "전체").map(cat => {
    const inCategory = routines.filter(r => r.category === cat);
    if (inCategory.length === 0) return null;
    const completed = inCategory.filter(r => r.completedDates.includes(selectedDateStr)).length;
    return { cat, total: inCategory.length, completed };
  }).filter(Boolean) as { cat: string; total: number; completed: number }[];

  return (
    <div className="min-h-[100dvh] bg-background w-full max-w-[430px] mx-auto shadow-2xl relative pb-24 flex flex-col font-sans">
      <header className="px-6 pt-12 pb-2 sticky top-0 bg-background/90 backdrop-blur-xl z-10 border-b border-border/40">
        {/* Week navigation */}
        <div className="flex items-center justify-between mb-1">
          <button
            onClick={handlePrevWeek}
            data-testid="button-prev-week"
            className="p-2 -ml-2 rounded-full hover:bg-secondary text-muted-foreground transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
            {format(selectedDate, "yyyy년 M월", { locale: ko })}
          </h1>
          <button
            onClick={handleNextWeek}
            data-testid="button-next-week"
            className="p-2 -mr-2 rounded-full hover:bg-secondary text-muted-foreground transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Calendar view button */}
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

      <main className="flex-1 px-6 pt-2 flex flex-col gap-3">
        {/* Date title */}
        <div className="flex items-center justify-between pt-2">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              {isToday(selectedDate) ? "오늘의 루틴" : format(selectedDate, "M월 d일 루틴", { locale: ko })}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {format(selectedDate, "yyyy년 M월 d일 EEEE", { locale: ko })}
            </p>
          </div>
          <span className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
            {filteredRoutines.length}개
          </span>
        </div>

        {/* Combined category chips: 전체 + per-category, with filter + completion stats */}
        {routines.length > 0 && (
          <div className="flex overflow-x-auto gap-2 pb-1 scrollbar-hide -mx-1 px-1">
            {/* 전체 chip */}
            {(() => {
              const totalCompleted = routines.filter(r => r.completedDates.includes(selectedDateStr)).length;
              const isActive = selectedCategory === "전체";
              return (
                <button
                  key="전체"
                  onClick={() => setSelectedCategory("전체")}
                  data-testid="button-chip-전체"
                  className={`shrink-0 flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 rounded-full border transition-all
                    ${isActive
                      ? "bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/20"
                      : "bg-secondary text-muted-foreground border-border hover:text-foreground hover:border-primary/30"
                    }`}
                >
                  <span>전체</span>
                  <span className={`font-extrabold ${isActive ? "opacity-90" : "opacity-70"}`}>
                    {totalCompleted}/{routines.length}
                  </span>
                </button>
              );
            })()}

            {/* Per-category chips (only categories that have routines) */}
            {categoryStats.map(({ cat, total, completed }) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat as Category)}
                  data-testid={`button-chip-${cat}`}
                  className={`shrink-0 flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 rounded-full border transition-all
                    ${isActive
                      ? "bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/20"
                      : `${CATEGORY_SUMMARY_COLORS[cat] || "text-gray-600 bg-gray-50 border-gray-200"} hover:opacity-100 opacity-80`
                    }`}
                >
                  <span>{cat}</span>
                  <span className={`font-extrabold ${isActive ? "opacity-90" : completed === total ? "opacity-100" : "opacity-70"}`}>
                    {completed}/{total}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Routine list */}
        {filteredRoutines.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-6 shadow-inner">
              <Plus className="w-10 h-10 text-muted-foreground/50" />
            </div>
            {routines.length === 0 ? (
              <>
                <h3 className="text-xl font-bold mb-2 text-foreground">루틴이 없습니다</h3>
                <p className="text-sm text-muted-foreground max-w-[200px] leading-relaxed">
                  오른쪽 아래 버튼을 눌러<br />새로운 루틴을 추가해보세요.
                </p>
              </>
            ) : (
              <>
                <h3 className="text-xl font-bold mb-2 text-foreground">{selectedCategory} 루틴이 없습니다</h3>
                <button
                  onClick={() => setSelectedCategory("전체")}
                  className="text-sm font-semibold text-primary bg-primary/10 px-4 py-2 rounded-full hover:bg-primary/20 transition-colors"
                >
                  전체 보기
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredRoutines.map((routine) => (
              <RoutineCard
                key={routine.id}
                routine={routine}
                selectedDateStr={selectedDateStr}
                onToggle={toggleDate}
                isDragging={draggingId === routine.id}
                isDragOver={dragOverId === routine.id}
                onDragStart={handleDragStart(routine.id)}
                onDragOver={handleDragOver(routine.id)}
                onDrop={handleDrop(routine.id)}
                onDragEnd={handleDragEnd}
              />
            ))}
          </div>
        )}
      </main>

      {/* FAB */}
      <button
        onClick={() => setIsFormOpen(true)}
        data-testid="button-add-routine"
        className="fixed bottom-8 right-1/2 w-16 h-16 bg-primary text-primary-foreground rounded-[24px] shadow-xl shadow-primary/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform z-20"
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
