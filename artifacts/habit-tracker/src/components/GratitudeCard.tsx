import { useState, useRef, useEffect } from "react";
import { Routine } from "@/types/routine";
import { ChevronRight, Check, GripVertical, ChevronDown, ChevronUp } from "lucide-react";
import { useGratitude } from "@/hooks/useGratitude";

interface Props {
  routine: Routine;
  selectedDateStr: string;
  onToggle: (id: string, date: string, forceState?: boolean, subOption?: string) => void;
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

export function GratitudeCard({
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
  const [isExpanded, setIsExpanded] = useState(false);
  const { entries, saveEntry, getEntry } = useGratitude();
  
  const text = getEntry(selectedDateStr);
  const isCompleted = routine.completedDates.includes(selectedDateStr);
  const hasText = text.trim().length > 0;
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text, isExpanded]);

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(prev => !prev);
  };

  const handleToggleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle(routine.id, selectedDateStr);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    saveEntry(selectedDateStr, val);
    
    if (val.trim().length > 0 && !isCompleted) {
      onToggle(routine.id, selectedDateStr, true);
    } else if (val.trim().length === 0 && isCompleted) {
      onToggle(routine.id, selectedDateStr, false);
    }
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      data-testid={`card-routine-${routine.id}`}
      className={[
        "bg-card rounded-xl shadow-sm border transition-all duration-200 select-none overflow-hidden",
        isDragging ? "opacity-40 scale-[0.98] border-primary/40 shadow-none" : "border-border",
        isDragOver ? "border-primary border-2 shadow-md shadow-primary/10 scale-[1.01]" : "",
      ].join(" ")}
    >
      {/* Header section identical to RoutineCard but toggles expand */}
      <div 
        className="flex items-center gap-2.5 py-3 px-3 cursor-pointer"
        onClick={toggleExpand}
      >
        {/* Drag handle */}
        <div
          className="cursor-grab active:cursor-grabbing shrink-0 text-muted-foreground/30 hover:text-muted-foreground transition-colors touch-none"
          data-testid={`handle-routine-${routine.id}`}
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="w-3.5 h-3.5" />
        </div>

        {/* Completion toggle icon */}
        <button
          onClick={handleToggleClick}
          className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300
            ${isCompleted
              ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30"
              : "bg-secondary border border-border text-transparent hover:bg-secondary/80"
            }`}
        >
          <Check className="w-3.5 h-3.5" />
        </button>

        {/* Routine title */}
        <span
          className={`flex-1 min-w-0 text-[15px] font-semibold truncate transition-colors duration-300 ${
            isCompleted ? "text-primary font-bold" : "text-foreground"
          }`}
        >
          {isCompleted ? "감사일기 작성 ✓" : routine.name}
        </span>

        {/* Category badge */}
        {routine.category && (
          <span
            className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
              CATEGORY_COLORS[routine.category] || "bg-gray-50 text-gray-500 border-gray-200"
            }`}
          >
            {routine.category}
          </span>
        )}

        {/* Expand/Collapse arrow */}
        <div className="shrink-0 text-muted-foreground hover:text-foreground transition-colors">
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </div>

      {/* Expandable Text Area */}
      <div
        className={`transition-all duration-300 ease-in-out ${isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
        style={{ display: "grid" }}
      >
        <div className="overflow-hidden">
          <div className="px-3 pb-3 pt-0">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={handleChange}
              placeholder="오늘 하루 감사했던 일은 무엇인가요?"
              className="w-full min-h-[80px] bg-secondary/30 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30 border border-transparent focus:border-primary/20 resize-none transition-shadow text-foreground placeholder:text-muted-foreground/50"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
