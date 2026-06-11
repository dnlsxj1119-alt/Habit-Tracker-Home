import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Routine } from "@/types/routine";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { useState, useEffect } from "react";
import { Check } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  routine: Routine | null;
  selectedDate: Date | null;
  onSelectOption: (routineId: string, dateStr: string, forceState: boolean, subOption?: string | string[]) => void;
}

export function SubOptionModal({ open, onOpenChange, routine, selectedDate, onSelectOption }: Props) {
  const dateStr = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";
  const currentOption = routine?.completedDetails?.[dateStr];
  const initialSelected = Array.isArray(currentOption) ? currentOption : (currentOption ? [currentOption] : []);
  
  const [selectedMulti, setSelectedMulti] = useState<string[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setSelectedMulti(initialSelected);
      setError("");
    }
  }, [open, currentOption]);

  if (!routine || !selectedDate) return null;
  const isCompleted = routine.completedDates.includes(dateStr);
  const isMulti = routine.subOptionType === "multi";

  const handleToggleMulti = (option: string) => {
    setError("");
    setSelectedMulti(prev => 
      prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option]
    );
  };

  const handleConfirmMulti = () => {
    if (selectedMulti.length === 0) {
      setError("하나 이상 선택해주세요.");
      return;
    }
    onSelectOption(routine.id, dateStr, true, selectedMulti);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xs w-[85%] rounded-[24px] bg-background border-border p-6" aria-describedby="sub-option-description">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-bold text-center">
            {format(selectedDate, "M월 d일", { locale: ko })}
          </DialogTitle>
          <DialogDescription id="sub-option-description" className="text-center font-medium text-foreground mt-2">
            어떤 활동을 완료했나요? {isMulti && "(다중 선택 가능)"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2 mt-2">
          {routine.subOptions?.map((option, idx) => {
            const isSelected = isMulti ? selectedMulti.includes(option) : currentOption === option;
            
            return (
              <button
                key={idx}
                onClick={() => {
                  if (isMulti) {
                    handleToggleMulti(option);
                  } else {
                    onSelectOption(routine.id, dateStr, true, option);
                    onOpenChange(false);
                  }
                }}
                className={`w-full py-3 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-between ${
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "bg-secondary text-foreground hover:bg-secondary/80 border border-border"
                }`}
              >
                <span>{option}</span>
                {isMulti && isSelected && <Check className="w-4 h-4" />}
              </button>
            );
          })}
          
          {isMulti && (
            <div className="mt-2">
              {error && <p className="text-xs text-destructive text-center mb-2">{error}</p>}
              <button
                onClick={handleConfirmMulti}
                className="w-full py-3 px-4 rounded-xl text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
              >
                완료
              </button>
            </div>
          )}

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
