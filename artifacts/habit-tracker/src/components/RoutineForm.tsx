import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Routine, CATEGORIES } from "@/types/routine";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const formSchema = z.object({
  name: z.string().min(1, "루틴 이름을 입력해주세요"),
  category: z.string().min(1, "카테고리를 선택해주세요"),
  goal: z.string().optional(),
  memo: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  routine?: Routine;
  onSave: (data: Omit<Routine, "id" | "createdAt" | "completedDates">) => void;
}

export function RoutineForm({ open, onOpenChange, routine, onSave }: Props) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: routine?.name || "",
      category: routine?.category || CATEGORIES[0],
      goal: routine?.goal || "",
      memo: routine?.memo || "",
    },
  });

  const onSubmit = (values: FormValues) => {
    onSave({
      name: values.name,
      category: values.category,
      goal: values.goal || "",
      memo: values.memo || "",
    });
    onOpenChange(false);
    if (!routine) form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md w-[90%] rounded-[24px] bg-background border-border p-6" aria-describedby="routine-form-description">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-xl font-bold">{routine ? "루틴 수정" : "새 루틴 만들기"}</DialogTitle>
          <DialogDescription id="routine-form-description" className="sr-only">
            루틴의 이름, 카테고리, 목표 및 메모를 설정합니다.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">이름</FormLabel>
                  <FormControl>
                    <Input placeholder="매일 물 2리터 마시기" {...field} className="rounded-xl bg-secondary/50 border-none h-12 focus-visible:ring-2 focus-visible:ring-primary focus-visible:bg-background" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">카테고리</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-xl bg-secondary/50 border-none h-12 focus:ring-2 focus:ring-primary focus:bg-background">
                        <SelectValue placeholder="카테고리 선택" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-xl">
                      {CATEGORIES.map(cat => (
                        <SelectItem key={cat} value={cat} className="rounded-lg my-1">{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="goal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">목표 (선택)</FormLabel>
                  <FormControl>
                    <Input placeholder="예: 2리터" {...field} className="rounded-xl bg-secondary/50 border-none h-12 focus-visible:ring-2 focus-visible:ring-primary focus-visible:bg-background" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="memo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">메모 (선택)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="루틴에 대한 간단한 메모" {...field} className="rounded-xl bg-secondary/50 border-none resize-none min-h-[100px] py-3 focus-visible:ring-2 focus-visible:ring-primary focus-visible:bg-background" />
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
