import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Routine } from "@/types/routine";
import { useCategories } from "@/hooks/useCategories";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Plus, Check, X } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, "루틴 이름을 입력해주세요"),
  category: z.string().min(1, "카테고리를 선택해주세요"),
  goal: z.string().optional(),
  memo: z.string().optional(),
  subOptions: z.array(z.string()).optional(),
  subOptionType: z.enum(["single", "multi"]).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  routine?: Routine;
  onSave: (data: Omit<Routine, "id" | "createdAt" | "completedDates" | "completedDetails">) => void;
}

export function RoutineForm({ open, onOpenChange, routine, onSave }: Props) {
  const { categories, addCategory } = useCategories();
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [addError, setAddError] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: routine?.name || "",
      category: routine?.category || categories[0],
      goal: routine?.goal || "",
      memo: routine?.memo || "",
      subOptions: routine?.subOptions || [],
      subOptionType: routine?.subOptionType || "multi",
    },
  });

  const onSubmit = (values: FormValues) => {
    onSave({
      name: values.name,
      category: values.category,
      goal: values.goal || "",
      memo: values.memo || "",
      subOptions: values.subOptions?.filter(o => o.trim().length > 0),
      subOptionType: values.subOptionType || "multi",
    });
    onOpenChange(false);
    if (!routine) form.reset();
    setIsAddingCategory(false);
    setNewCategoryName("");
  };

  const handleAddCategory = () => {
    const trimmed = newCategoryName.trim();
    if (!trimmed) {
      setAddError("카테고리 이름을 입력해주세요");
      return;
    }
    if (categories.includes(trimmed)) {
      setAddError("이미 존재하는 카테고리입니다");
      return;
    }
    addCategory(trimmed);
    form.setValue("category", trimmed);
    setNewCategoryName("");
    setAddError("");
    setIsAddingCategory(false);
  };

  const handleCancelAdd = () => {
    setIsAddingCategory(false);
    setNewCategoryName("");
    setAddError("");
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) handleCancelAdd(); }}>
      <DialogContent className="sm:max-w-md w-[90%] rounded-[24px] bg-background border-border p-6" aria-describedby="routine-form-description">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-xl font-bold">{routine ? "루틴 수정" : "새 루틴 만들기"}</DialogTitle>
          <DialogDescription id="routine-form-description" className="sr-only">
            루틴의 이름, 카테고리, 목표 및 메모를 설정합니다.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">이름</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="매일 물 2리터 마시기"
                      {...field}
                      className="rounded-xl bg-secondary/50 border-none h-12 focus-visible:ring-2 focus-visible:ring-primary focus-visible:bg-background"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">카테고리</FormLabel>
                  <div className="flex gap-2 items-center">
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="flex-1 rounded-xl bg-secondary/50 border-none h-12 focus:ring-2 focus:ring-primary focus:bg-background">
                          <SelectValue placeholder="카테고리 선택" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xl">
                        {categories.map(cat => (
                          <SelectItem key={cat} value={cat} className="rounded-lg my-1">{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {!isAddingCategory && (
                      <button
                        type="button"
                        onClick={() => setIsAddingCategory(true)}
                        data-testid="button-add-category"
                        className="shrink-0 w-12 h-12 rounded-xl bg-secondary/50 flex items-center justify-center text-muted-foreground hover:bg-secondary hover:text-primary transition-colors"
                        title="카테고리 추가"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Inline new category input */}
            {isAddingCategory && (
              <div className="flex gap-2 items-start">
                <div className="flex-1">
                  <Input
                    autoFocus
                    placeholder="새 카테고리 이름"
                    value={newCategoryName}
                    onChange={(e) => { setNewCategoryName(e.target.value); setAddError(""); }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") { e.preventDefault(); handleAddCategory(); }
                      if (e.key === "Escape") handleCancelAdd();
                    }}
                    data-testid="input-new-category"
                    className="rounded-xl bg-secondary/50 border-none h-12 focus-visible:ring-2 focus-visible:ring-primary focus-visible:bg-background"
                  />
                  {addError && <p className="text-xs text-destructive mt-1 ml-1">{addError}</p>}
                </div>
                <button
                  type="button"
                  onClick={handleAddCategory}
                  data-testid="button-confirm-category"
                  className="shrink-0 w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <Check className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleCancelAdd}
                  data-testid="button-cancel-category"
                  className="shrink-0 w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground hover:bg-secondary/80 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Goal */}
            <FormField
              control={form.control}
              name="goal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">목표 (선택)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="예: 2리터"
                      {...field}
                      className="rounded-xl bg-secondary/50 border-none h-12 focus-visible:ring-2 focus-visible:ring-primary focus-visible:bg-background"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* SubOptions */}
            <FormField
              control={form.control}
              name="subOptions"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center mb-2">
                    <FormLabel className="text-sm font-semibold">하위 선택지 (선택)</FormLabel>
                    {field.value && field.value.length > 0 && (
                      <FormField
                        control={form.control}
                        name="subOptionType"
                        render={({ field: typeField }) => (
                          <div className="flex bg-secondary rounded-lg p-1">
                            <button
                              type="button"
                              onClick={() => typeField.onChange("single")}
                              className={`px-3 py-1 text-[10px] font-bold rounded-md transition-colors ${typeField.value === "single" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"}`}
                            >
                              단일 선택
                            </button>
                            <button
                              type="button"
                              onClick={() => typeField.onChange("multi")}
                              className={`px-3 py-1 text-[10px] font-bold rounded-md transition-colors ${typeField.value === "multi" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"}`}
                            >
                              중복 선택
                            </button>
                          </div>
                        )}
                      />
                    )}
                  </div>
                  <div className="space-y-2">
                    {field.value?.map((option, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <Input
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...(field.value || [])];
                            newOptions[index] = e.target.value;
                            field.onChange(newOptions);
                            if (form.getValues("subOptionType") !== "multi") {
                              form.setValue("subOptionType", "multi");
                            }
                          }}
                          placeholder={`선택지 ${index + 1}`}
                          className="rounded-xl bg-secondary/50 border-none h-12 focus-visible:ring-2 focus-visible:ring-primary focus-visible:bg-background flex-1"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newOptions = field.value?.filter((_, i) => i !== index);
                            field.onChange(newOptions);
                          }}
                          className="shrink-0 w-12 h-12 rounded-xl bg-secondary/50 flex items-center justify-center text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        field.onChange([...(field.value || []), ""]);
                        form.setValue("subOptionType", "multi");
                      }}
                      className="w-full h-12 rounded-xl border border-dashed border-border flex items-center justify-center text-sm font-semibold text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-colors gap-2"
                    >
                      <Plus className="w-4 h-4" /> 선택지 추가
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Memo */}
            <FormField
              control={form.control}
              name="memo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">메모 (선택)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="루틴에 대한 간단한 메모"
                      {...field}
                      className="rounded-xl bg-secondary/50 border-none resize-none min-h-[100px] py-3 focus-visible:ring-2 focus-visible:ring-primary focus-visible:bg-background"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-6 flex gap-3 flex-row pb-2">
              <Button type="button" variant="secondary" onClick={() => onOpenChange(false)} className="flex-1 rounded-xl h-12 font-semibold">
                취소
              </Button>
              <Button type="submit" className="flex-1 rounded-xl h-12 font-bold shadow-md shadow-primary/20">
                저장
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
