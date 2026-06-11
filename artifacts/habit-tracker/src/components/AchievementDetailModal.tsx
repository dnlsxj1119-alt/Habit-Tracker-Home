import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Routine } from "@/types/routine";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: Date | null;
  activeRoutines: Routine[];
}

export function AchievementDetailModal({ open, onOpenChange, date, activeRoutines }: Props) {
  if (!date) return null;

  const dateStr = format(date, "yyyy-MM-dd");
  const completedRoutines = activeRoutines.filter(r => r.completedDates.includes(dateStr));
  const uncompletedRoutines = activeRoutines.filter(r => !r.completedDates.includes(dateStr));

  const total = activeRoutines.length;
  const completed = completedRoutines.length;
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm w-[90%] rounded-[24px] bg-background border-border p-6 max-h-[85vh] overflow-y-auto" aria-describedby="achievement-detail-description">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-bold text-center">
            {format(date, "yyyy년 M월 d일", { locale: ko })}
          </DialogTitle>
          <DialogDescription id="achievement-detail-description" className="text-center mt-2">
            달성률 {rate}% ({completed}/{total}개)
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div>
            <h3 className="text-sm font-bold text-primary mb-3">완료한 습관 ({completed})</h3>
            {completed === 0 ? (
              <p className="text-sm text-muted-foreground">완료한 습관이 없습니다.</p>
            ) : (
              <div className="space-y-2">
                {completedRoutines.map(r => (
                  <div key={r.id} className="bg-primary/10 px-4 py-3 rounded-xl border border-primary/20 flex flex-col">
                    <span className="font-semibold text-sm text-foreground">{r.name}</span>
                    {r.completedDetails?.[dateStr] && (
                      <span className="text-xs font-medium text-primary mt-1">
                        ↳ {Array.isArray(r.completedDetails[dateStr]) ? (r.completedDetails[dateStr] as string[]).join(", ") : r.completedDetails[dateStr]}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-sm font-bold text-muted-foreground mb-3">미완료 습관 ({uncompletedRoutines.length})</h3>
            {uncompletedRoutines.length === 0 ? (
              <p className="text-sm text-muted-foreground">모든 습관을 완료했습니다! 🎉</p>
            ) : (
              <div className="space-y-2">
                {uncompletedRoutines.map(r => (
                  <div key={r.id} className="bg-secondary/50 px-4 py-3 rounded-xl border border-border flex flex-col">
                    <span className="font-semibold text-sm text-muted-foreground">{r.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
