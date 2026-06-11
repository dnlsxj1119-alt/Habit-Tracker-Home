import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { ChevronLeft, Pencil, Trash2 } from "lucide-react";
import { useRoutines } from "@/hooks/useRoutines";
import { MonthlyCalendar } from "@/components/MonthlyCalendar";
import { RoutineForm } from "@/components/RoutineForm";
import { SubOptionModal } from "@/components/SubOptionModal";
import { getDaysInMonth, isSameMonth, parseISO, startOfMonth, format } from "date-fns";
import { ko } from "date-fns/locale";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";

export default function RoutineDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { routines, updateRoutine, deleteRoutine, toggleDate } = useRoutines();
  
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(() => startOfMonth(new Date()));
  const [selectedDateForSubOption, setSelectedDateForSubOption] = useState<Date | null>(null);

  const routine = routines.find(r => r.id === id);

  if (!routine) {
    return (
      <div className="min-h-[100dvh] bg-background w-full max-w-[430px] mx-auto shadow-2xl flex items-center justify-center flex-col gap-4">
        <p className="text-muted-foreground font-medium">루틴을 찾을 수 없습니다</p>
        <button onClick={() => setLocation("/")} className="text-primary font-bold bg-primary/10 px-6 py-2 rounded-full">돌아가기</button>
      </div>
    );
  }

  const handleDelete = () => {
    deleteRoutine(routine.id);
    setLocation("/");
  };

  const handleUpdate = (data: any) => {
    updateRoutine(routine.id, data);
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const completedInMonth = routine.completedDates.filter(dateStr =>
    isSameMonth(parseISO(dateStr), currentMonth)
  );
  const completionRate = Math.round((completedInMonth.length / daysInMonth) * 100);
  const monthLabel = format(currentMonth, "M월", { locale: ko });

  const subOptionCounts: Record<string, number> = {};
  completedInMonth.forEach(dateStr => {
    const option = routine.completedDetails?.[dateStr];
    if (option) {
      const optionsArray = Array.isArray(option) ? option : [option];
      optionsArray.forEach(opt => {
        subOptionCounts[opt] = (subOptionCounts[opt] || 0) + 1;
      });
    }
  });
  const hasSubOptionsStats = Object.keys(subOptionCounts).length > 0;

  const handleCalendarToggle = (id: string, dateStr: string) => {
    if (routine.subOptions && routine.subOptions.length > 0) {
      setSelectedDateForSubOption(parseISO(dateStr));
    } else {
      toggleDate(id, dateStr);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-background w-full max-w-[430px] mx-auto shadow-2xl flex flex-col relative pb-12 font-sans">
      <header className="px-4 pt-12 pb-4 sticky top-0 bg-background/90 backdrop-blur-xl z-10 flex items-center justify-between border-b border-border/40">
        <button onClick={() => setLocation("/")} className="p-2.5 -ml-2 rounded-full hover:bg-secondary transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex gap-1.5">
          <button onClick={() => setIsEditOpen(true)} className="p-2.5 rounded-full hover:bg-secondary text-muted-foreground transition-colors">
            <Pencil className="w-5 h-5" />
          </button>
          <button onClick={() => setIsDeleteOpen(true)} className="p-2.5 rounded-full hover:bg-destructive/10 text-destructive transition-colors">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="flex-1 px-5 pt-4 flex flex-col gap-5">
        <div>
          {routine.category && (
            <span className="text-[10px] font-extrabold tracking-wider text-primary uppercase mb-2 block">{routine.category}</span>
          )}
          <h1 className="text-2xl font-extrabold mb-3 text-foreground leading-tight">{routine.name}</h1>
          
          {(routine.goal || routine.memo) && (
            <div className="bg-secondary/40 rounded-3xl p-5 space-y-4 border border-border/50">
              {routine.goal && (
                <div>
                  <span className="text-[11px] font-bold text-muted-foreground block mb-1 uppercase tracking-wider">목표</span>
                  <p className="text-[15px] font-medium text-foreground">{routine.goal}</p>
                </div>
              )}
              {routine.memo && (
                <div>
                  <span className="text-[11px] font-bold text-muted-foreground block mb-1 uppercase tracking-wider">메모</span>
                  <p className="text-[15px] text-foreground leading-relaxed">{routine.memo}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <MonthlyCalendar
          routine={routine}
          onToggle={handleCalendarToggle}
          currentMonth={currentMonth}
          onMonthChange={setCurrentMonth}
        />

        <div className="bg-primary/5 border border-primary/20 rounded-[20px] p-4 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-baseline gap-2">
              <h3 className="text-sm font-bold text-primary">{monthLabel} 완료율</h3>
              <p className="text-[10px] font-semibold text-primary/70">
                ({daysInMonth}일 중 {completedInMonth.length}일)
              </p>
            </div>
            <span className="text-2xl font-extrabold text-primary tracking-tighter">{completionRate}%</span>
          </div>
          <Progress value={completionRate} className="h-3 rounded-full bg-primary/20" />
        </div>

        {hasSubOptionsStats && (
          <div className="bg-secondary/30 border border-border/50 rounded-3xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-foreground mb-4">{monthLabel} 하위 활동 통계</h3>
            <div className="space-y-2">
              {Object.entries(subOptionCounts)
                .sort((a, b) => b[1] - a[1])
                .map(([option, count]) => (
                <div key={option} className="flex justify-between items-center bg-background px-4 py-3 rounded-xl border border-border/40">
                  <span className="font-semibold text-sm text-foreground">{option}</span>
                  <span className="font-bold text-sm text-primary bg-primary/10 px-2 py-0.5 rounded-md">{count}회</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {completedInMonth.length > 0 && (
          <div className="bg-secondary/20 border border-border/40 rounded-3xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-foreground mb-4">{monthLabel} 상세 기록</h3>
            <div className="space-y-2">
              {[...completedInMonth]
                .sort((a, b) => b.localeCompare(a))
                .map(dateStr => (
                <div key={dateStr} className="flex flex-col bg-background px-4 py-3 rounded-xl border border-border/30">
                  <span className="font-semibold text-sm text-foreground">
                    {dateStr} {routine.name} {routine.completedDetails?.[dateStr] ? `(${Array.isArray(routine.completedDetails[dateStr]) ? (routine.completedDetails[dateStr] as string[]).join(", ") : routine.completedDetails[dateStr]})` : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <RoutineForm 
        open={isEditOpen} 
        onOpenChange={setIsEditOpen}
        routine={routine}
        onSave={handleUpdate}
      />

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent className="max-w-[360px] rounded-[24px] bg-background p-6">
          <AlertDialogHeader className="mb-2">
            <AlertDialogTitle className="text-xl font-bold">루틴 삭제</AlertDialogTitle>
            <AlertDialogDescription className="text-[15px]">
              '{routine.name}' 루틴을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 flex flex-row gap-3">
            <AlertDialogCancel className="flex-1 rounded-xl h-12 m-0 font-semibold border-border">취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="flex-1 rounded-xl h-12 m-0 bg-destructive text-destructive-foreground hover:bg-destructive/90 font-bold shadow-md shadow-destructive/20">
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {selectedDateForSubOption && (
        <SubOptionModal
          open={!!selectedDateForSubOption}
          onOpenChange={(open) => !open && setSelectedDateForSubOption(null)}
          routine={routine}
          selectedDate={selectedDateForSubOption}
          onSelectOption={toggleDate}
        />
      )}
    </div>
  );
}
