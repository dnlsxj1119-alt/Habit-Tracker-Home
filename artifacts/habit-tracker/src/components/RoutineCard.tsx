import { Routine } from "@/types/routine";
import { Link } from "wouter";
import { ChevronRight, Check, GripVertical } from "lucide-react";

interface Props {
  routine: Routine;
  selectedDateStr: string;
  onToggle: (id: string, date: string, forceState?: boolean, subOption?: string) => void;
  onOpenSubOptions?: (routine: Routine) => void;
  isDragging?: boolean;
  isDragOver?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  "건강": "bg-red-50 text-red-500 border-red-100",
  "운동": "bg-blue-50 text-blue-500 border-blue-100",
  "학습": "bg-purple-50 text-purple-500 border-purple-100",
  "마음": "bg-amber-50 text-amber-500 border-amber-100",
  "생활": "bg-teal-50 text-teal-500 border-teal-100",
  "기타": "bg-gray-50 text-gray-500 border-gray-200",
};

export function RoutineCard({
  routine,
  selectedDateStr,
  onToggle,
  isDragging,
  isDragOver,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  onOpenSubOptions,
}: Props) {
  const isCompleted = routine.completedDates.includes(selectedDateStr);

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      data-testid={`card-routine-${routine.id}`}
      className={[
        "bg-card rounded-xl py-3 px-3 shadow-sm border flex items-center gap-2.5 transition-all duration-200 select-none",
        isDragging ? "opacity-40 scale-[0.98] border-primary/40 shadow-none" : "border-border",
        isDragOver ? "border-primary border-2 shadow-md shadow-primary/10 scale-[1.01]" : "",
      ].join(" ")}
    >
      {/* Drag handle */}
      <div
        className="cursor-grab active:cursor-grabbing shrink-0 text-muted-foreground/30 hover:text-muted-foreground transition-colors touch-none"
        data-testid={`handle-routine-${routine.id}`}
      >
        <GripVertical className="w-3.5 h-3.5" />
      </div>

      {/* Completion toggle */}
      <button
        data-testid={`button-toggle-${routine.id}`}
        onClick={(e) => {
          e.stopPropagation();
          if (routine.subOptions && routine.subOptions.length > 0 && onOpenSubOptions) {
            onOpenSubOptions(routine);
          } else {
            onToggle(routine.id, selectedDateStr);
          }
        }}
        onMouseDown={(e) => e.stopPropagation()}
        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300
          ${isCompleted
            ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30"
            : "bg-secondary border border-border text-transparent hover:bg-secondary/80"
          }`}
      >
        <Check className="w-3.5 h-3.5" />
      </button>

      {/* Routine title — takes remaining space */}
      <span
        className={`flex-1 min-w-0 text-[15px] font-semibold truncate transition-colors duration-300 ${
          isCompleted ? "text-muted-foreground line-through" : "text-foreground"
        }`}
      >
        {routine.name}
        {routine.completedDetails?.[selectedDateStr] && (
          <span className="ml-2 text-[11px] font-medium text-primary/80 bg-primary/10 px-1.5 py-0.5 rounded-md">
            {routine.completedDetails[selectedDateStr]}
          </span>
        )}
      </span>

      {/* Category badge — right-aligned, before the chevron */}
      {routine.category && (
        <span
          className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
            CATEGORY_COLORS[routine.category] || "bg-gray-50 text-gray-500 border-gray-200"
          }`}
        >
          {routine.category}
        </span>
      )}

      {/* Detail link arrow */}
      <Link
        href={`/routine/${routine.id}`}
        data-testid={`link-detail-${routine.id}`}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
