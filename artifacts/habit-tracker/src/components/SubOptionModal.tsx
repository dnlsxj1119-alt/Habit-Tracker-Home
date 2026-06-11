import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Routine } from "@/types/routine";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  routine: Routine | null;
  selectedDate: Date;
  onSelectOption: (routineId: string, dateStr: string, forceState: boolean, subOption?: string) => void;
}

export function SubOptionModal({ open, onOpenChange, routine, selectedDate, onSelectOption }: Props) {
  if (!routine) return null;

  const dateStr = format(selectedDate, "yyyy-MM-dd");
  const isCompleted = routine.completedDates.includes(dateStr);
  const currentOption = routine.completedDetails?.[dateStr];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xs w-[85%] rounded-[24px] bg-background border-border p-6" aria-describedby="sub-option-description">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-bold text-center">
            {format(selectedDate, "M월 d일", { locale: ko })}
          </DialogTitle>
          <DialogDescription id="sub-option-description" className="text-center font-medium text-foreground mt-2">
            어떤 활동을 완료했나요?
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2 mt-2">
          {routine.subOptions?.map((option, idx) => (
            <button
              key={idx}
              onClick={() => {
                onSelectOption(routine.id, dateStr, true, option);
                onOpenChange(false);
              }}
              className={`w-full py-3 px-4 rounded-xl text-sm font-bold transition-all ${
                currentOption === option
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "bg-secondary text-foreground hover:bg-secondary/80 border border-border"
              }`}
            >
              {option}
            </button>
          ))}
          
          {isCompleted && (
            <button
              onClick={() => {
                onSelectOption(routine.id, dateStr, false);
                onOpenChange(false);
              }}
              className="w-full py-3 px-4 mt-2 rounded-xl text-sm font-bold bg-destructive/10 text-destructive hover:bg-destructive/20 transition-all border border-destructive/20"
            >
              완료 취소
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
