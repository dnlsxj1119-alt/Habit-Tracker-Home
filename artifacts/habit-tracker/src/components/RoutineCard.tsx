import { Routine } from "@/types/routine";
import { Link } from "wouter";
import { ChevronRight, Check, GripVertical } from "lucide-react";

interface Props {
  routine: Routine;
  selectedDateStr: string;
  onToggle: (id: string, date: string) => void;
  isDragging?: boolean;
  isDragOver?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  "건강": "bg-red-50 text-red-600 border-red-100",
  "운동": "bg-blue-50 text-blue-600 border-blue-100",
  "학습": "bg-purple-50 text-purple-600 border-purple-100",
  "마음": "bg-amber-50 text-amber-600 border-amber-100",
  "생활": "bg-teal-50 text-teal-600 border-teal-100",
  "기타": "bg-gray-50 text-gray-600 border-gray-200",
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
        "bg-card rounded-2xl p-4 shadow-sm border flex items-center gap-3 transition-all duration-200 select-none",
        isDragging ? "opacity-40 scale-[0.98] border-primary/40 shadow-none" : "border-border",
        isDragOver ? "border-primary border-2 shadow-md shadow-primary/10 scale-[1.01]" : "",
      ].join(" ")}
    >
      {/* Drag handle */}
      <div
        className="cursor-grab active:cursor-grabbing shrink-0 text-muted-foreground/40 hover:text-muted-foreground transition-colors touch-none"
        data-testid={`handle-routine-${routine.id}`}
      >
        <GripVertical className="w-4 h-4" />
      </div>

      {/* Completion toggle — stopPropagation so drag doesn't fire */}
      <button
        data-testid={`button-toggle-${routine.id}`}
        onClick={(e) => {
          e.stopPropagation();
          onToggle(routine.id, selectedDateStr);
        }}
        onMouseDown={(e) => e.stopPropagation()}
        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300
          ${isCompleted
            ? "bg-primary text-primary-foreground shadow-sm shadow-primary/40"
            : "bg-secondary border border-border text-transparent hover:bg-secondary/80"
          }`}
      >
        <Check className="w-5 h-5" />
      </button>

      {/* Routine info + detail link */}
      <Link
        href={`/routine/${routine.id}`}
        data-testid={`link-detail-${routine.id}`}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        className="flex-1 flex items-center min-w-0 group"
      >
        <div className="flex flex-col flex-1 min-w-0 pr-4">
          <span
            className={`text-base font-semibold truncate transition-colors duration-300 ${
              isCompleted ? "text-muted-foreground line-through" : "text-foreground"
            }`}
          >
            {routine.name}
          </span>
          {routine.category && (
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full w-fit mt-1.5 border ${
                CATEGORY_COLORS[routine.category] || "bg-gray-50 text-gray-600 border-gray-200"
              }`}
            >
              {routine.category}
            </span>
          )}
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
      </Link>
    </div>
  );
}
